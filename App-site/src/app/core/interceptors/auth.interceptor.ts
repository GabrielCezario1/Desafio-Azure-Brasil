import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { switchMap, catchError } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);
  const protectedUrls = ['localhost:5001', '/api'];
  const needsAuth = protectedUrls.some(url => req.url.includes(url));
  const account = msalService.instance.getActiveAccount();

  if (!needsAuth) {
    return next(req);
  }

  if (!account) {
    return next(req);
  }

  return msalService.acquireTokenSilent({
    scopes: ['User.Read'],
    account: account
  }).pipe(
    switchMap(result => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${result.accessToken}`
        }
      });
      return next(authReq);
    }),

    catchError(() => {
      return msalService.acquireTokenPopup({
        scopes: ['User.Read'],
        account: account
      }).pipe(
        switchMap(result => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${result.accessToken}`
            }
          });
          return next(authReq);
        }),
        catchError(() => {
          return next(req);
        })
      );
    })
  );
};
