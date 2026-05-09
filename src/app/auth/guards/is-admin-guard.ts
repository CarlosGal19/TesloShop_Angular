import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(authService.checkStatus());
  const user = authService.user();

  if (!user || !user.roles.includes('admin')) {
    router.navigate(['/']);
    return false;
  }

  return true;



};
