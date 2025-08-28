import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';
  isAuthenticated = false;
private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const currentAuthStatus = this.authService.isLoggedIn;
    if (currentAuthStatus) {
      this.redirectAfterLogin();
      return;
    }
    
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        this.isAuthenticated = isLoggedIn;

        if (isLoggedIn) {
          this.redirectAfterLogin();
        }
      });
    }
  
  loginWithMicrosoft(): void {
    this.isLoading = true;

    this.authService.login().subscribe({
      next: (response) => {
        console.log('LoginComponent: Login bem-sucedido', response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ LoginComponent: Erro no login', error);
        this.isLoading = false;
        if (error.message?.includes('uninitialized_public_client_application')) {
          this.errorMessage = 'Sistema de autenticação está carregando. Aguarde alguns segundos e tente novamente.';
          setTimeout(() => {
            if (!this.isLoading) {
              this.loginWithMicrosoft();
            }
          }, 2000);
        } else {
          this.handleLoginError(error);
        }
      }
    });
  }

  private handleLoginError(error: any): void {

    if (error?.error_description) {
      if (error.error_description.includes('user_cancelled')) {
        this.errorMessage = 'Login cancelado pelo usuário.';
      } else if (error.error_description.includes('network')) {
        this.errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else {
        this.errorMessage = 'Erro na autenticação corporativa. Contate o suporte TI.';
      }
    } else if (error?.message) {
      this.errorMessage = 'Erro técnico: ' + error.message;
    } else {
      this.errorMessage = 'Erro inesperado. Tente novamente ou contate o suporte.';
    }
  }

  private redirectAfterLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/home']).then(success => {
        if (success) {
        } else {
          this.router.navigate(['/home']);
        }
      });
    }, 100);
  }

  ngOnDestroy(): void {
    console.log('🧹 LoginComponent: Limpando recursos...');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
