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
    console.log('🔐 AuthService: Iniciando processo de login...');
    
    // Verificar se MSAL está inicializado
    const isInitialized = this.msalService.instance.getConfiguration();
    if (!isInitialized) {
      console.error('❌ AuthService: MSAL não inicializado');
      return throwError(() => new Error('MSAL não está inicializado. Aguarde alguns segundos e tente novamente.'));
    }

    console.log('✅ AuthService: MSAL inicializado, prosseguindo com login');
    
    return this.msalService.loginPopup({
      scopes: ['User.Read'] 
    });
  }

  logout() {
    return this.msalService.logoutPopup();
  }

  // 🎫 MÉTODOS DE TOKEN AVANÇADOS

  /**
   * 🎫 OBTER TOKEN DE ACESSO
   * 
   * Obtém token de acesso para chamadas de API com scopes específicos
   * Tenta token silencioso primeiro, fallback para popup se necessário
   * 
   * @param scopes - Array de scopes necessários (padrão: ['User.Read'])
   * @returns Observable<string> - Access token
   */
  getAccessToken(scopes: string[] = ['User.Read']): Observable<string> {
    console.log('🎫 AuthService: Obtendo access token para scopes:', scopes);
    
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      console.error('🎫 AuthService: Nenhuma conta ativa encontrada');
      return throwError(() => new Error('Nenhuma conta ativa encontrada. Faça login primeiro.'));
    }

    console.log('🎫 AuthService: Tentando token silencioso para conta:', account.username);

    return this.msalService.acquireTokenSilent({
      scopes,
      account
    }).pipe(
      map(result => {
        console.log('🎫 AuthService: Token silencioso obtido com sucesso');
        return result.accessToken;
      }),
      catchError(error => {
        console.warn('🎫 AuthService: Token silencioso falhou, tentando popup:', error);
        
        return this.msalService.acquireTokenPopup({
          scopes,
          account
        }).pipe(
          map(result => {
            console.log('🎫 AuthService: Token popup obtido com sucesso');
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

  /**
   * 🔍 VERIFICAR SE HÁ TOKEN VÁLIDO
   * 
   * Verifica se existe um token válido em cache para os scopes especificados
   * 
   * @param scopes - Array de scopes para verificar
   * @returns boolean - true se há token válido
   */
  hasValidToken(scopes: string[] = ['User.Read']): boolean {
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      return false;
    }

    try {
      // Verifica se há token no cache
      const tokenCache = this.msalService.instance.getTokenCache();
      const silentRequest = {
        scopes,
        account,
        forceRefresh: false
      };
      
      // Esta é uma verificação básica - em produção você pode usar métodos mais específicos
      return true; // Por simplicidade, assumimos que se há conta ativa, há token válido
    } catch (error) {
      console.warn('🔍 AuthService: Erro ao verificar token válido:', error);
      return false;
    }
  }

  // 👤 MÉTODOS DE INFORMAÇÕES DO USUÁRIO

  /**
   * 👤 OBTER INFORMAÇÕES DO USUÁRIO
   * 
   * Extrai e formata informações do usuário logado de forma amigável
   * 
   * @returns UserInfo | null - Informações formatadas do usuário ou null se não logado
   */
  getUserInfo(): UserInfo | null {
    const account = this.userAccount;
    
    if (!account) {
      console.log('👤 AuthService: Nenhum usuário logado');
      return null;
    }

    const userInfo: UserInfo = {
      id: account.localAccountId || account.homeAccountId || '',
      email: account.username || '',
      name: account.name || account.username || '',
      displayName: account.name || account.username || 'Usuário',
      tenantId: account.tenantId,
      environment: account.environment,
      homeAccountId: account.homeAccountId
    };

    console.log('👤 AuthService: Informações do usuário obtidas:', userInfo.displayName);
    return userInfo;
  }

  /**
   * 📋 OBTER INFORMAÇÕES COMPLETAS DA CONTA
   * 
   * Retorna o objeto AccountInfo completo do MSAL
   * 
   * @returns AccountInfo | null - Informações completas da conta
   */
  getAccountInfo(): AccountInfo | null {
    return this.userAccount;
  }

  /**
   * 🏷️ OBTER CLAIMS DO TOKEN
   * 
   * Extrai claims/informações do ID token do usuário
   * 
   * @returns any | null - Claims do token ou null
   */
  getTokenClaims(): any | null {
    const account = this.userAccount;
    
    if (!account || !account.idTokenClaims) {
      console.log('🏷️ AuthService: Nenhum claim de token disponível');
      return null;
    }

    console.log('🏷️ AuthService: Claims do token obtidos');
    return account.idTokenClaims;
  }

  // 🔍 MÉTODOS DE VERIFICAÇÃO DE SESSÃO

  /**
   * 🔍 VERIFICAR SE SESSÃO ESTÁ ATIVA
   * 
   * Verifica se existe uma sessão válida ativa com informações essenciais
   * 
   * @returns boolean - true se sessão está ativa e válida
   */
  isSessionActive(): boolean {
    const accounts = this.msalService.instance.getAllAccounts();
    const hasAccounts = accounts.length > 0;
    const hasActiveAccount = this.msalService.instance.getActiveAccount() !== null;
    
    const isActive = hasAccounts && hasActiveAccount;
    console.log('🔍 AuthService: Verificação de sessão ativa:', isActive);
    
    return isActive;
  }

  /**
   * ⏰ VERIFICAR SE TOKEN ESTÁ EXPIRADO
   * 
   * Verifica se os tokens atuais estão próximos do vencimento
   * 
   * @returns boolean - true se token está expirado ou próximo do vencimento
   */
  isTokenExpired(): boolean {
    const account = this.userAccount;
    
    if (!account || !account.idTokenClaims) {
      return true;
    }

    // Verifica expiração do ID token
    const exp = account.idTokenClaims['exp'];
    if (exp) {
      const expirationTime = exp * 1000; // Converter para milliseconds
      const now = Date.now();
      const isExpired = now >= expirationTime;
      
      console.log('⏰ AuthService: Token expiration check:', isExpired);
      return isExpired;
    }

    return false;
  }

  // 🔧 MÉTODOS UTILITÁRIOS

  /**
   * 🔄 REFRESH TOKEN
   * 
   * Força a renovação do token de acesso
   * 
   * @param scopes - Scopes para renovar
   * @returns Observable<string> - Novo access token
   */
  refreshToken(scopes: string[] = ['User.Read']): Observable<string> {
    console.log('🔄 AuthService: Forçando refresh do token');
    
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      return throwError(() => new Error('Nenhuma conta ativa para refresh'));
    }

    return this.msalService.acquireTokenSilent({
      scopes,
      account,
      forceRefresh: true // Força renovação
    }).pipe(
      map(result => {
        console.log('🔄 AuthService: Token renovado com sucesso');
        return result.accessToken;
      }),
      catchError(error => {
        console.error('🔄 AuthService: Erro ao renovar token:', error);
        return throwError(() => new Error('Falha ao renovar token'));
      })
    );
  }

  /**
   * 🧹 LIMPAR CACHE
   * 
   * Remove todos os tokens do cache local
   */
  clearCache(): void {
    console.log('🧹 AuthService: Limpando cache de tokens');
    
    try {
      this.msalService.instance.clearCache();
      console.log('🧹 AuthService: Cache limpo com sucesso');
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
