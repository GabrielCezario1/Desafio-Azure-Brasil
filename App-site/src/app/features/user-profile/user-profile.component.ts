import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { GraphService, UserProfile, GraphUser, GraphGroup, TenantInfo } from '../../services/graph.service';
import { AuthService } from '../../services/auth.service';
import { AppNavbarComponent } from '../../shared/components/app-navbar';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, AppNavbarComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private graphService = inject(GraphService);
  private authService = inject(AuthService);

  userProfile: UserProfile | null = null;
  isLoading = true;
  error: string | null = null;
  
  // Dados para exibição em abas
  activeTab: 'overview' | 'tenant' | 'groups' | 'users' = 'overview';
  tenantUsers: GraphUser[] = [];
  tenantGroups: GraphGroup[] = [];
  loadingTenantData = false;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.graphService.getUserProfile()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
        },
        error: (error) => {
          this.error = 'Erro ao carregar perfil do usuário. Verifique suas permissões.';
          console.error('❌ UserProfile: Erro ao carregar perfil:', error);
        }
      });
  }

  changeTab(tab: 'overview' | 'tenant' | 'groups' | 'users'): void {
    this.activeTab = tab;
    
    if (tab === 'users' && this.tenantUsers.length === 0) {
      this.loadTenantUsers();
    } else if (tab === 'groups' && this.tenantGroups.length === 0) {
      this.loadTenantGroups();
    }
  }

  private loadTenantUsers(): void {
    this.loadingTenantData = true;
    
    this.graphService.getTenantUsers(50)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingTenantData = false)
      )
      .subscribe({
        next: (users) => {
          this.tenantUsers = users;
        },
        error: (error) => {
          console.error('❌ UserProfile: Erro ao carregar usuários do tenant:', error);
        }
      });
  }

  private loadTenantGroups(): void {
    this.loadingTenantData = true;
    
    this.graphService.getTenantGroups()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingTenantData = false)
      )
      .subscribe({
        next: (groups) => {
          this.tenantGroups = groups;
        },
        error: (error) => {
          console.error('❌ UserProfile: Erro ao carregar grupos do tenant:', error);
        }
      });
  }

  refreshProfile(): void {
    this.graphService.clearProfile();
    this.loadUserProfile();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Não disponível';
    
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  }

  formatDateOnly(dateString: string | undefined): string {
    if (!dateString) return 'Não disponível';
    
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  }

  getCurrentSessionTime(): string {
    // Simular início da sessão atual (quando o componente foi carregado)
    const sessionStart = new Date();
    return sessionStart.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getLastLocalAccess(): string {
    const lastAccess = localStorage.getItem('lastAppAccess');
    if (lastAccess) {
      return new Date(lastAccess).toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    localStorage.setItem('lastAppAccess', new Date().toISOString());
    return 'Primeiro acesso neste dispositivo';
  }

  getGroupTypeDisplay(groupTypes: string[]): string {
    if (!groupTypes || groupTypes.length === 0) {
      return 'Grupo de Segurança';
    }
    
    if (groupTypes.includes('Unified')) {
      return 'Microsoft 365';
    }
    
    return 'Grupo de Segurança';
  }

  getUserStatusBadge(user: GraphUser): string {
    return user.accountEnabled ? 'success' : 'danger';
  }

  getUserStatusText(user: GraphUser): string {
    return user.accountEnabled ? 'Ativo' : 'Inativo';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
    }).catch(err => {
      console.error('❌ Erro ao copiar texto:', err);
    });
  }
}
