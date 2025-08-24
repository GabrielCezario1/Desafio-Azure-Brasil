import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'usuarios', component: UsuariosComponent }
];