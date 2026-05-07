import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth-service';
import { of, tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthService).token();
  const reqWithToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`)
  })

  return next(reqWithToken);
};
