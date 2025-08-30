import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent {
  private router = inject(Router);

  navItems: NavItem[] = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: 'bi-house',
      requiresAuth: false
    },
    { 
      path: '/usuarios', 
      label: 'Usuários', 
      icon: 'bi-people',
      requiresAuth: true
    },
    { 
      path: '/test', 
      label: 'Testes', 
      icon: 'bi-gear',
      requiresAuth: true
    },
    { 
      path: '/profile', 
      label: 'Perfil', 
      icon: 'bi-person-vcard',
      requiresAuth: true
    }
  ];

  /**
   * Verifica se a rota atual está ativa
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  /**
   * Retorna a classe CSS apropriada para cada botão
   */
  getButtonClass(route: string): string {
    const baseClasses = 'btn btn-sm me-1 mb-1';
    return this.isActive(route) 
      ? `${baseClasses} btn-primary` 
      : `${baseClasses} btn-outline-secondary`;
  }

  /**
   * Navega para a rota especificada
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
