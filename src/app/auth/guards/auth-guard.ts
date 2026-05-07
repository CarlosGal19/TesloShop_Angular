import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = await firstValueFrom(authService.checkStatus());

  if (isAuth) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
