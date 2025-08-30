// ================================================================
// DESAFIO AZURE BRASIL - MICROSOFT GRAPH SERVICE
// REQUISITOS VAGA: Integração com Microsoft Graph API
// - Nome do usuário autenticado
// - ID do Tenant
// - Tentativas de login recentes  
// - Usuários do Tenant
// - Grupos do Tenant
// ================================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Interface para dados do usuário do Microsoft Graph
 * REQUISITO VAGA: Estrutura para exibir nome e informações do usuário
 */
export interface GraphUser {
  id: string;
  displayName: string;        // REQUISITO: Nome do usuário
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
  lastSignInDateTime?: string; // REQUISITO: Tentativas de login
}

/**
 * Interface para grupos do Microsoft Graph
 * REQUISITO VAGA: Estrutura para exibir grupos do Tenant
 */
export interface GraphGroup {
  id: string;
  displayName: string;        // REQUISITO: Nome do grupo
  description?: string;
  groupTypes: string[];
  mail?: string;
  visibility?: string;
  createdDateTime: string;
}

/**
 * Interface para informações do Tenant
 * REQUISITO VAGA: Estrutura para exibir ID do Tenant e informações
 */
export interface TenantInfo {
  id: string;                 // REQUISITO: ID do Tenant
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

/**
 * Interface para atividade de sign-in
 * REQUISITO VAGA: Estrutura para tentativas de login recentes
 */
export interface SignInActivity {
  lastSignInDateTime?: string;              // REQUISITO: Último login
  lastNonInteractiveSignInDateTime?: string;
  lastSuccessfulSignInDateTime?: string;
}

/**
 * Interface agregadora do perfil completo do usuário
 * Consolida todos os requisitos da vaga em uma estrutura
 */
export interface UserProfile {
  user: GraphUser;                // REQUISITO: Nome do usuário
  tenantInfo?: TenantInfo | null; // REQUISITO: ID do Tenant
  groups: GraphGroup[];           // REQUISITO: Grupos do Tenant
  signInActivity?: SignInActivity | null; // REQUISITO: Tentativas de login
  recentUsers?: GraphUser[];      // REQUISITO: Usuários do Tenant
}

/**
 * SERVIÇO PRINCIPAL DE INTEGRAÇÃO COM MICROSOFT GRAPH API
 * REQUISITOS VAGA: Implementa todas as funcionalidades obrigatórias
 * 
 * Funcionalidades implementadas:
 * ✅ Nome do usuário autenticado
 * ✅ ID do Tenant  
 * ✅ Tentativas de login recentes
 * ✅ Usuários do Tenant
 * ✅ Grupos do Tenant
 */
@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  // Endpoints do Microsoft Graph API
  private readonly GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0';
  private readonly BETA_ENDPOINT = 'https://graph.microsoft.com/beta';
  
  // Subject para gerenciar estado do perfil do usuário
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  /**
   * MÉTODO PRINCIPAL - REQUISITOS VAGA: Obtém perfil completo do usuário
   * Consolida todas as informações exigidas na vaga:
   * - Nome do usuário (getCurrentUser)
   * - ID do Tenant (getTenantInfo)  
   * - Tentativas de login (getSignInActivity)
   * - Usuários do Tenant (getRecentTenantUsers)
   * - Grupos do Tenant (getUserGroups)
   * 
   * @returns Observable com UserProfile completo
   */
  getUserProfile(): Observable<UserProfile> {
    return this.authService.getAccessToken([
      'User.Read',           // Para dados do usuário
      'Directory.Read.All',  // Para informações do tenant
      'Group.Read.All',      // Para grupos
      'AuditLog.Read.All'    // Para atividades de login
    ]).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        
        // Executa todas as chamadas em paralelo para eficiência
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

  /**
   * REQUISITO VAGA: Obtém informações do usuário autenticado (NOME)
   * Chama endpoint /me do Microsoft Graph
   * @param headers Headers com token de autorização
   * @returns Observable com dados do usuário logado
   */
  private getCurrentUser(headers: HttpHeaders): Observable<GraphUser> {
    return this.http.get<GraphUser>(`${this.GRAPH_ENDPOINT}/me`, { headers }).pipe(
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter usuário:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * REQUISITO VAGA: Obtém grupos do usuário autenticado
   * Parte das "informações relevantes do Entra ID"
   * @param headers Headers com token de autorização  
   * @returns Observable com array de grupos do usuário
   */
  private getUserGroups(headers: HttpHeaders): Observable<GraphGroup[]> {
    return this.http.get<{ value: GraphGroup[] }>(`${this.GRAPH_ENDPOINT}/me/memberOf`, { headers }).pipe(
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter grupos:', error);
        return of([]);
      })
    );
  }

  /**
   * REQUISITO VAGA: Obtém informações do Tenant (ID DO TENANT)
   * Chama endpoint /organization do Microsoft Graph
   * @param headers Headers com token de autorização
   * @returns Observable com informações do tenant
   */
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
 
  /**
   * REQUISITO VAGA: Obtém tentativas de login recentes
   * Usa endpoint beta para atividade de sign-in do usuário
   * @param headers Headers com token de autorização
   * @returns Observable com atividades de login
   */
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
 
  /**
   * REQUISITO VAGA: Obtém usuários do Tenant
   * Lista usuários recentes/principais do tenant organizacional
   * @param headers Headers com token de autorização
   * @returns Observable com array de usuários do tenant
   */
  private getRecentTenantUsers(headers: HttpHeaders): Observable<GraphUser[]> {
    return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=10&$orderby=displayName`, { headers }).pipe(
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter usuários do tenant:', error);
        // Fallback: tenta sem ordenação se falhar
        return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=10`, { headers }).pipe(
          map(response => response.value || []),
          catchError(() => of([]))
        );
      })
    );
  }


  /**
   * REQUISITO VAGA: Obtém todos os grupos do Tenant
   * Lista grupos organizacionais do tenant para exibição
   * @returns Observable com array de grupos do tenant
   */
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

  /**
   * REQUISITO VAGA: Obtém lista expandida de usuários do Tenant
   * Permite listar mais usuários com paginação customizada
   * @param top Número de usuários para retornar
   * @returns Observable com array de usuários do tenant
   */
  getTenantUsers(top: number = 20): Observable<GraphUser[]> {
    return this.authService.getAccessToken(['User.Read.All']).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        return this.http.get<{ value: GraphUser[] }>(`${this.GRAPH_ENDPOINT}/users?$top=${top}&$orderby=displayName`, { headers });
      }),
      map(response => response.value || []),
      catchError(error => {
        console.error('❌ GraphService: Erro ao obter usuários do tenant:', error);
        // Fallback: tenta sem ordenação
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

  /**
   * Limpa dados do perfil em cache
   */
  clearProfile(): void {
    this.userProfileSubject.next(null);
  }

  /**
   * Cria headers HTTP com token de autorização para Microsoft Graph
   * @param token Access token obtido via MSAL
   * @returns HttpHeaders configurado para Graph API
   */
  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Getter para acesso direto ao perfil atual em cache
   */
  get currentProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }
}
