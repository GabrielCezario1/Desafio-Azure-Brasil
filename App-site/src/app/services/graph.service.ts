import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface GraphUser {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  businessPhones: string[];
  mobilePhone?: string;
  preferredLanguage?: string;
  accountEnabled: boolean;
  createdDateTime: string;
  lastSignInDateTime?: string;
}

export interface GraphGroup {
  id: string;
  displayName: string;
  description?: string;
  groupTypes: string[];
  mail?: string;
  visibility?: string;
  createdDateTime: string;
}

export interface TenantInfo {
  id: string;
  displayName: string;
  tenantType?: string;
  countryLetterCode?: string;
  createdDateTime: string;
  verifiedDomains: Array<{
    name: string;
    type: string;
    isDefault: boolean;
    isInitial: boolean;
  }>;
}

export interface SignInActivity {
  lastSignInDateTime?: string;
  lastNonInteractiveSignInDateTime?: string;
  lastSuccessfulSignInDateTime?: string;
}

export interface UserProfile {
  user: GraphUser;
  tenantInfo?: TenantInfo | null;
  groups: GraphGroup[];
  signInActivity?: SignInActivity | null;
  recentUsers?: GraphUser[];
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  private readonly GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0';
  private readonly BETA_ENDPOINT = 'https://graph.microsoft.com/beta';
  
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  getUserProfile(): Observable<UserProfile> {
    return this.authService.getAccessToken([
      'User.Read', 
      'Directory.Read.All', 
      'Group.Read.All',
      'AuditLog.Read.All' 
    ]).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        
        return forkJoin({
          user: this.getCurrentUser(headers),
          groups: this.getUserGroups(headers),
          tenantInfo: this.getTenantInfo(headers).pipe(catchError(() => of(null))),
          signInActivity: this.getSignInActivity(headers).pipe(catchError(() => of(null))),
          recentUsers: this.getRecentTenantUsers(headers).pipe(catchError(() => of([])))
        });
      }),
      map(result => {
        const profile: UserProfile = {
          user: result.user,
          groups: result.groups,
          tenantInfo: result.tenantInfo,
          signInActivity: result.signInActivity,
          recentUsers: result.recentUsers
        };
        
        this.userProfileSubject.next(profile);
        return profile;
      }),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter perfil do usuário:', error);
        return throwError(() => error);
      })
    );
  }

  private getCurrentUser(headers: HttpHeaders): Observable<GraphUser> {
    return this.http.get<GraphUser>(`${this.GRAPH_ENDPOINT}/me`, { headers }).pipe(
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter usuário:', error);
        return throwError(() => error);
      })
    );
  }

  private getUserGroups(headers: HttpHeaders): Observable<GraphGroup[]> {
    return this.http.get<{ value: GraphGroup[] }>(`${this.GRAPH_ENDPOINT}/me/memberOf`, { headers }).pipe(
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter grupos:', error);
        return of([]);
      })
    );
  }

  private getTenantInfo(headers: HttpHeaders): Observable<TenantInfo> {
    return this.http.get<TenantInfo>(`${this.GRAPH_ENDPOINT}/organization`, { headers }).pipe(
      map((response: any) => {
        if (response.value && response.value.length > 0) {
          return response.value[0];
        }
        throw new Error('Informações do tenant não encontradas');
      }),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter tenant:', error);
        return throwError(() => error);
      })
    );
  }
 
  private getSignInActivity(headers: HttpHeaders): Observable<SignInActivity> {
    return this.http.get<SignInActivity>(`${this.BETA_ENDPOINT}/me?$select=signInActivity`, { headers }).pipe(
      map((response: any) => response.signInActivity || {}),
      catchError(error => {
        if (error.status === 403) {
          console.warn('⚠️ GraphService: Atividade de login não disponível (permissões insuficientes)');
        } else {
          console.error('❌ GraphService: Erro ao obter atividade de login:', error);
        }
        return of({});
      })
    );
  }
 
  private getRecentTenantUsers(headers: HttpHeaders): Observable<GraphUser[]> {
    return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=10&$orderby=displayName`, { headers }).pipe(
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter usuários do tenant:', error);
        return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=10`, { headers }).pipe(
          map(response => response.value || []),
          catchError(() => of([]))
        );
      })
    );
  }


  getTenantGroups(): Observable<GraphGroup[]> {
    return this.authService.getAccessToken(['Group.Read.All']).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return this.http.get<{ value: GraphGroup[] }>(`${this.GRAPH_ENDPOINT}/groups`, { headers });
      }),
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter grupos do tenant:', error);
        return throwError(() => error);
      })
    );
  }

  getTenantUsers(top: number = 20): Observable<GraphUser[]> {
    return this.authService.getAccessToken(['User.Read.All']).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=${top}&$orderby=displayName`, { headers });
      }),
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter usuários do tenant:', error);
        return this.authService.getAccessToken(['User.Read.All']).pipe(
          switchMap(token => {
            const headers = this.getHeaders(token);
            return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=${top}`, { headers });
          }),
          map(response => response.value || []),
          catchError(() => of([]))
        );
      })
    );
  }

  clearProfile(): void {
    this.userProfileSubject.next(null);
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  get currentProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }
}
