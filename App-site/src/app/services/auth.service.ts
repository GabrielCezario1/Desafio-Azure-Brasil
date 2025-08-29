import { Injectable, inject } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { BehaviorSubject, filter, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  displayName: string;
  tenantId?: string;
  environment?: string;
  homeAccountId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userAccountSubject = new BehaviorSubject<AccountInfo | null>(null);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public userAccount$ = this.userAccountSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    this.msalBroadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  private setLoginDisplay() {
    const accounts = this.msalService.instance.getAllAccounts();
    const isLoggedIn = accounts.length > 0;
    
    this.isLoggedInSubject.next(isLoggedIn);
    
    if (isLoggedIn) {
      const account = accounts[0];
      this.userAccountSubject.next(account);
      this.msalService.instance.setActiveAccount(account);
    } else {
      this.userAccountSubject.next(null);
    }
  }

  login() {
    const isInitialized = this.msalService.instance.getConfiguration();
    if (!isInitialized) {
      console.error('❌ AuthService: MSAL não inicializado');
      return throwError(() => new Error('MSAL não está inicializado. Aguarde alguns segundos e tente novamente.'));
    }

    return this.msalService.loginPopup({
      scopes: ['User.Read'] 
    });
  }

  logout() {
    return this.msalService.logoutPopup();
  }

  getAccessToken(scopes: string[] = ['User.Read']): Observable<string> {
    
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      console.error('🎫 AuthService: Nenhuma conta ativa encontrada');
      return throwError(() => new Error('Nenhuma conta ativa encontrada. Faça login primeiro.'));
    }

    return this.msalService.acquireTokenSilent({
      scopes,
      account
    }).pipe(
      map(result => {
        return result.accessToken;
      }),
      catchError(error => {
        console.warn('🎫 AuthService: Token silencioso falhou, tentando popup:', error);
        
        return this.msalService.acquireTokenPopup({
          scopes,
          account
        }).pipe(
          map(result => {
            return result.accessToken;
          }),
          catchError(popupError => {
            console.error('🎫 AuthService: Falha total ao obter token:', popupError);
            return throwError(() => new Error('Não foi possível obter token de acesso.'));
          })
        );
      })
    );
  }

  hasValidToken(scopes: string[] = ['User.Read']): boolean {
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      return false;
    }

    try {
      const tokenCache = this.msalService.instance.getTokenCache();
      const silentRequest = {
        scopes,
        account,
        forceRefresh: false
      };
      
      return true; 
    } catch (error) {
      console.warn('🔍 AuthService: Erro ao verificar token válido:', error);
      return false;
    }
  }

  getUserInfo(): UserInfo | null {
    const account = this.userAccount;
    
    if (!account) {
      console.log('👤 AuthService: Nenhum usuário logado');
      return null;
    }

    return {
      id: account.localAccountId || account.homeAccountId || '',
      email: account.username || '',
      name: account.name || account.username || '',
      displayName: account.name || account.username || 'Usuário',
      tenantId: account.tenantId,
      environment: account.environment,
      homeAccountId: account.homeAccountId
    };
  }

  getAccountInfo(): AccountInfo | null {
    return this.userAccount;
  }

  getTokenClaims(): any | null {
    const account = this.userAccount;
    
    if (!account || !account.idTokenClaims) {
      console.log('🏷️ AuthService: Nenhum claim de token disponível');
      return null;
    }

    return account.idTokenClaims;
  }

  isSessionActive(): boolean {
    const accounts = this.msalService.instance.getAllAccounts();
    const hasAccounts = accounts.length > 0;
    const hasActiveAccount = this.msalService.instance.getActiveAccount() !== null;

    return hasAccounts && hasActiveAccount;
  }

  isTokenExpired(): boolean {
    const account = this.userAccount;
    
    if (!account || !account.idTokenClaims) {
      return true;
    }

    const exp = account.idTokenClaims['exp'];
    if (exp) {
      const expirationTime = exp * 1000; 
      const now = Date.now();
      const isExpired = now >= expirationTime;
      
      console.log('⏰ AuthService: Token expiration check:', isExpired);
      return isExpired;
    }

    return false;
  }

  refreshToken(scopes: string[] = ['User.Read']): Observable<string> {
    console.log('🔄 AuthService: Forçando refresh do token');
    
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      return throwError(() => new Error('Nenhuma conta ativa para refresh'));
    }

    return this.msalService.acquireTokenSilent({
      scopes,
      account,
      forceRefresh: true 
    }).pipe(
      map(result => {
        return result.accessToken;
      }),
      catchError(error => {
        console.error('🔄 AuthService: Erro ao renovar token:', error);
        return throwError(() => new Error('Falha ao renovar token'));
      })
    );
  }

  clearCache(): void {
    try {
      this.msalService.instance.clearCache();
    } catch (error) {
      console.error('🧹 AuthService: Erro ao limpar cache:', error);
    }
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  get userAccount(): AccountInfo | null {
    return this.userAccountSubject.value;
  }
}
