import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'usuarios', component: UsuariosComponent }
];