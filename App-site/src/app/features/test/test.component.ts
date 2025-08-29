import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { Subject, takeUntil } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit, OnDestroy {
  isLoading = false;
  msalStatus = '';
  lastApiCall = '';
  lastApiResult = '';
  lastApiError = '';

  userInfo: AccountInfo | null = null;
  isAuthenticated = false;

  tokenInfo = {
    hasToken: false,
    tokenPreview: '',
    expiresOn: '',
    scopes: [] as string[]
  };

  apiTestHistory: Array<{
    timestamp: string;
    method: string;
    url: string;
    status: 'success' | 'error';
    result: string;
  }> = [];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status: InteractionStatus) => {
        this.msalStatus = this.getStatusDescription(status);
      });

    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        this.isAuthenticated = isLoggedIn;

        if (isLoggedIn) {
          this.loadUserInfo();
          this.loadTokenInfo();
        } else {
          this.clearUserInfo();
        }
      });

    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isAuthenticated = this.authService.isLoggedIn;

    if (this.isAuthenticated) {
      this.loadUserInfo();
      this.loadTokenInfo();
    }
  }


  private loadUserInfo(): void {
    this.userInfo = this.authService.userAccount;
  }

  private loadTokenInfo(): void {
    try {
      const accounts = this.msalService.instance.getAllAccounts();

      if (accounts.length > 0) {
        const account = accounts[0];

        this.msalService.instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: account
        }).then(response => {
          this.tokenInfo = {
            hasToken: true,
            tokenPreview: `${response.accessToken.substring(0, 20)}...${response.accessToken.slice(-10)}`,
            expiresOn: response.expiresOn ? response.expiresOn.toISOString() : 'N/A',
            scopes: response.scopes || []
          };
        }).catch(() => {
          this.tokenInfo = {
            hasToken: false,
            tokenPreview: 'Token não disponível',
            expiresOn: 'N/A',
            scopes: []
          };
        });
      }
    } catch (error) {
      console.error('TestComponent: Erro ao carregar informações do token:', error);
    }
  }

  private clearUserInfo(): void {
    this.userInfo = null;
    this.tokenInfo = {
      hasToken: false,
      tokenPreview: '',
      expiresOn: '',
      scopes: []
    };
  }

  private getStatusDescription(status: InteractionStatus): string {
    switch (status) {
      case InteractionStatus.Startup:
        return '🚀 Inicializando MSAL...';
      case InteractionStatus.AcquireToken:
        return '🔐 Obtendo token...';
      case InteractionStatus.HandleRedirect:
        return '🔄 Processando redirecionamento...';
      case InteractionStatus.Login:
        return '🚪 Realizando login...';
      case InteractionStatus.Logout:
        return '🚪 Realizando logout...';
      case InteractionStatus.None:
        return '✅ MSAL pronto';
      default:
        return '❓ Status desconhecido';
    }
  }

  async doLogin(): Promise<void> {
    this.isLoading = true;

    try {
      await this.authService.login().toPromise();
      this.addToHistory('POST', '/auth/login', 'success', 'Login realizado com sucesso');
    } catch (error: any) {
      this.addToHistory('POST', '/auth/login', 'error', error.message || 'Erro no login');
    } finally {
      this.isLoading = false;
    }
  }

  async doLogout(): Promise<void> {
    this.isLoading = true;
    try {
      await this.authService.logout().toPromise();
      this.addToHistory('POST', '/auth/logout', 'success', 'Logout realizado com sucesso');
    } catch (error: any) {
      this.addToHistory('POST', '/auth/logout', 'error', error.message || 'Erro no logout');
    } finally {
      this.isLoading = false;
    }
  }

  async testPublicEndpoint(): Promise<void> {
    this.isLoading = true;
    this.lastApiCall = 'GET /api/auth/public';

    try {
      const response = await this.http.get('http://localhost:5001/api/auth/public', {
        responseType: 'text'
      }).toPromise();

      this.lastApiResult = response || 'Endpoint público acessível';
      this.lastApiError = '';
      this.addToHistory('GET', '/api/auth/public', 'success', this.lastApiResult);

    } catch (error: any) {
      this.lastApiError = error.message || 'Erro ao acessar endpoint público';
      this.lastApiResult = '';
      this.addToHistory('GET', '/api/auth/public', 'error', this.lastApiError);
      console.error('❌ TestComponent: Erro no endpoint público:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async testProtectedEndpoint(): Promise<void> {
    this.isLoading = true;
    this.lastApiCall = 'GET /api/usuarios';

    try {
      const response = await this.usuariosService.listar().toPromise();

      this.lastApiResult = `Sucesso! ${response?.length || 0} usuários encontrados`;
      this.lastApiError = '';
      this.addToHistory('GET', '/api/usuarios', 'success', this.lastApiResult);

    } catch (error: any) {
      this.lastApiError = error.message || 'Erro ao acessar endpoint protegido';
      this.lastApiResult = '';
      this.addToHistory('GET', '/api/usuarios', 'error', this.lastApiError);
      console.error('❌ TestComponent: Erro no endpoint protegido:', error);
    } finally {
      this.isLoading = false;
    }
  }
  async testDebugEndpoint(): Promise<void> {
    this.isLoading = true;
    this.lastApiCall = 'GET /api/auth/debug/headers';

    try {
      const response = await this.http.get('http://localhost:5001/api/auth/debug/headers').toPromise();

      this.lastApiResult = JSON.stringify(response, null, 2);
      this.lastApiError = '';
      this.addToHistory('GET', '/api/auth/debug/headers', 'success', 'Debug executado - verifique resultado');

    } catch (error: any) {
      this.lastApiError = error.message || 'Erro no endpoint de debug';
      this.lastApiResult = '';
      this.addToHistory('GET', '/api/auth/debug/headers', 'error', this.lastApiError);
      console.error('❌ TestComponent: Erro no debug:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async testRealProtectedEndpoint(): Promise<void> {
    this.isLoading = true;
    this.lastApiCall = 'GET /api/auth/me';

    try {
      const response = await this.http.get('http://localhost:5001/api/auth/me').toPromise();

      this.lastApiResult = JSON.stringify(response, null, 2);
      this.lastApiError = '';
      this.addToHistory('GET', '/api/auth/me', 'success', 'Endpoint protegido funcionando!');
    } catch (error: any) {
      this.lastApiError = error.message || 'Erro no endpoint protegido';
      this.lastApiResult = '';
      this.addToHistory('GET', '/api/auth/me', 'error', this.lastApiError);
      console.error('❌ TestComponent: Erro no endpoint protegido:', error);
    } finally {
      this.isLoading = false;
    }
  }

  
  async testAdvancedDiagnostic(): Promise<void> {
    this.isLoading = true;
    this.lastApiCall = 'GET /api/auth/debug/auth-test';

    try {
      const response = await this.http.get('http://localhost:5001/api/auth/debug/auth-test').toPromise();

      this.lastApiResult = JSON.stringify(response, null, 2);
      this.lastApiError = '';
      this.addToHistory('GET', '/api/auth/debug/auth-test', 'success', 'Diagnóstico avançado executado');
    } catch (error: any) {
      this.lastApiError = error.message || 'Erro no diagnóstico avançado';
      this.lastApiResult = '';
      this.addToHistory('GET', '/api/auth/debug/auth-test', 'error', this.lastApiError);
      console.error('❌ TestComponent: Erro no diagnóstico avançado:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async testCustomEndpoint(): Promise<void> {
    this.isLoading = true;
    this.lastApiCall = 'GET /api/auth/me';

    try {
      const response = await this.http.get('http://localhost:5001/api/auth/me').toPromise();

      this.lastApiResult = JSON.stringify(response, null, 2);
      this.lastApiError = '';
      this.addToHistory('GET', '/api/auth/me', 'success', 'Informações do usuário obtidas');

    } catch (error: any) {
      this.lastApiError = error.message || 'Erro ao acessar endpoint customizado';
      this.lastApiResult = '';
      this.addToHistory('GET', '/api/auth/me', 'error', this.lastApiError);
      console.error('❌ TestComponent: Erro no endpoint customizado:', error);
    } finally {
      this.isLoading = false;
    }
  }


  refreshInfo(): void {
    this.loadUserInfo();
    this.loadTokenInfo();
    this.addToHistory('REFRESH', '/info', 'success', 'Informações atualizadas');
  }

  clearHistory(): void {
    this.apiTestHistory = [];
    this.lastApiCall = '';
    this.lastApiResult = '';
    this.lastApiError = '';
  }

  private addToHistory(method: string, url: string, status: 'success' | 'error', result: string): void {
    this.apiTestHistory.unshift({
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      status,
      result: result.length > 100 ? result.substring(0, 100) + '...' : result
    });

    if (this.apiTestHistory.length > 10) {
      this.apiTestHistory = this.apiTestHistory.slice(0, 10);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
