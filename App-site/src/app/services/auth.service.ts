// ================================================================
// DESAFIO AZURE BRASIL - SERVIÇO DE AUTENTICAÇÃO
// REQUISITO VAGA: Implementa autenticação com Azure Entra ID
// ================================================================

import { Injectable, inject } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { BehaviorSubject, filter, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interface para informações do usuário autenticado
 * REQUISITO VAGA: Estrutura para exibir nome e informações do usuário
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  displayName: string;
  tenantId?: string;          // REQUISITO: ID do Tenant
  environment?: string;
  homeAccountId?: string;
}

/**
 * SERVIÇO PRINCIPAL DE AUTENTICAÇÃO AZURE ENTRA ID
 * REQUISITO VAGA: Implementa autenticação completa com Azure Entra ID
 * 
 * Funcionalidades implementadas:
 * - Login/logout com popup
 * - Gerenciamento de tokens de acesso
 * - Observables para estado de autenticação
 * - Validação de sessão e tokens
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Injeção de dependências MSAL
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);

  // Subjects para gerenciar estado reativo da autenticação
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userAccountSubject = new BehaviorSubject<AccountInfo | null>(null);

  // Observables públicos para componentes consumirem
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public userAccount$ = this.userAccountSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  /**
   * Inicializa o sistema de autenticação
   * Monitora mudanças no status de interação do MSAL
   */
  private initializeAuth() {
    this.msalBroadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  /**
   * Atualiza o estado de login baseado nas contas disponíveis
   * Configura a conta ativa se usuário estiver logado
   */
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

  /**
   * REQUISITO VAGA: Realiza login com Azure Entra ID
   * Utiliza popup para autenticação interativa
   * @returns Observable do resultado do login
   */
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

  /**
   * Realiza logout do Azure Entra ID
   * Limpa tokens e sessão local
   * @returns Observable do resultado do logout
   */
  logout() {
    return this.msalService.logoutPopup();
  }

  /**
   * REQUISITO VAGA: Obtém token de acesso para Microsoft Graph API
   * Estratégia: Tenta silent first, fallback para popup
   * Usado para acessar informações do usuário e tenant
   * @param scopes Array de permissões necessárias
   * @returns Observable com o access token
   */
  getAccessToken(scopes: string[] = ['User.Read']): Observable<string> {
    
    const account = this.msalService.instance.getActiveAccount();
    
    if (!account) {
      console.error('🎫 AuthService: Nenhuma conta ativa encontrada');
      return throwError(() => new Error('Nenhuma conta ativa encontrada. Faça login primeiro.'));
    }

    // Primeira tentativa: aquisição silenciosa de token
    return this.msalService.acquireTokenSilent({
      scopes,
      account
    }).pipe(
      map(result => {
        return result.accessToken;
      }),
      catchError(error => {
        console.warn('🎫 AuthService: Token silencioso falhou, tentando popup:', error);
        
        // Segunda tentativa: popup interativo
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

  /**
   * Verifica se existe um token válido em cache
   * @param scopes Escopos para validar
   * @returns true se token válido existe
   */
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

  /**
   * REQUISITO VAGA: Extrai informações do usuário autenticado
   * Retorna nome, email, tenantId conforme requisitos
   * @returns UserInfo com dados do usuário ou null
   */
  getUserInfo(): UserInfo | null {
    const account = this.userAccount;
    
    if (!account) {
      console.log('👤 AuthService: Nenhum usuário logado');
      return null;
    }

    return {
      id: account.localAccountId || account.homeAccountId || '',
      email: account.username || '',
      name: account.name || account.username || '',      // REQUISITO: Nome do usuário
      displayName: account.name || account.username || 'Usuário',
      tenantId: account.tenantId,                        // REQUISITO: ID do Tenant
      environment: account.environment,
      homeAccountId: account.homeAccountId
    };
  }

  /**
   * Retorna informações da conta MSAL ativa
   * @returns AccountInfo ou null
   */
  getAccountInfo(): AccountInfo | null {
    return this.userAccount;
  }

  /**
   * Extrai claims do token ID para análise detalhada
   * @returns Claims do token ou null
   */
  getTokenClaims(): any | null {
    const account = this.userAccount;
    
    if (!account || !account.idTokenClaims) {
      console.log('🏷️ AuthService: Nenhum claim de token disponível');
      return null;
    }

    return account.idTokenClaims;
  }

  /**
   * Verifica se a sessão está ativa
   * @returns true se sessão válida
   */
  isSessionActive(): boolean {
    const accounts = this.msalService.instance.getAllAccounts();
    const hasAccounts = accounts.length > 0;
    const hasActiveAccount = this.msalService.instance.getActiveAccount() !== null;

    return hasAccounts && hasActiveAccount;
  }

  /**
   * Verifica se o token atual está expirado
   * @returns true se token expirado
   */
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

  /**
   * Força renovação de token quando necessário
   * @param scopes Escopos para renovação
   * @returns Observable com novo token
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

  /**
   * Limpa cache de tokens localmente
   */
  clearCache(): void {
    try {
      this.msalService.instance.clearCache();
    } catch (error) {
      console.error('🧹 AuthService: Erro ao limpar cache:', error);
    }
  }

  // ================================================================
  // GETTERS PARA ACESSO DIRETO AO ESTADO
  // ================================================================

  /**
   * Getter para estado de login atual
   */
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Getter para conta do usuário atual
   */
  get userAccount(): AccountInfo | null {
    return this.userAccountSubject.value;
  }
}
