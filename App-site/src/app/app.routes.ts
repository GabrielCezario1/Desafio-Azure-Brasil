import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        title: 'Login Corporativo',
        data: {
            description: 'Acesso com Microsoft Entra ID',
            public: true,
            icon: 'bi-box-arrow-in-right'
        }
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Página Inicial',
        data: {
            description: 'Dashboard principal da aplicação',
            public: true,
            icon: 'bi-house-fill',
            menuOrder: 1
        }
    },
    {
        path: 'usuarios',
        loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent),
        canActivate: [authGuard],
        title: 'Gestão de Usuários',
        data: {
            description: 'CRUD de usuários do sistema',
            requiresAuth: true,
            icon: 'bi-people-fill',
            menuOrder: 2,
            permissions: ['users.read', 'users.write']
        }
    },
    {
        path: 'test',
        loadComponent: () => import('./features/test/test.component').then(m => m.TestComponent),
        canActivate: [authGuard],
        title: 'Dashboard de Testes',
        data: {
            description: 'Ferramenta de debug e validação MSAL',
            requiresAuth: true,
            icon: 'bi-gear-fill',
            menuOrder: 3,
            environment: 'development',
        }
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/user-profile/user-profile.component').then(m => m.UserProfileComponent),
        canActivate: [authGuard],
        title: 'Perfil do Usuário',
        data: {
            description: 'Informações do usuário e tenant Azure AD',
            requiresAuth: true,
            icon: 'bi-person-vcard',
            menuOrder: 4,
        }
    }
];