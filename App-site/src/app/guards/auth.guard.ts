import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Observable, of } from 'rxjs';
import { filter, take, catchError, timeout, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (state): Observable<boolean> => {

    const authService = inject(AuthService);
    const msalBroadcastService = inject(MsalBroadcastService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    const quickCheck = authService.isLoggedIn;
    if (quickCheck) {
        return of(true);
    }

    return msalBroadcastService.inProgress$.pipe(
        timeout(5000),
        filter((status: InteractionStatus) => {
            return status === InteractionStatus.None;
        }),
        take(1),
        switchMap(() => {
            const isAuthenticated = authService.isLoggedIn;
            
            if (isAuthenticated) {
                return of(true);
            } else {
                toastr.warning('🛡️ AuthGuard: Usuário não autenticado - redirecionando para login');
                router.navigate(['/login'], {
                    queryParams: { returnUrl: state.url }
                });
                return of(false);
            }
        }),
        catchError((error) => {
            toastr.error('🛡️ AuthGuard: Erro ou Timeout detectado:', error);
            
            router.navigate(['/login'], {
                queryParams: { returnUrl: state.url, error: 'auth-timeout' }
            });
            return of(false);
        })
    );
};