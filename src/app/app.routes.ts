import { Routes } from '@angular/router';
import { authGuard } from '@auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [authGuard]
  },
  {
    path: '',
    loadChildren: () => import('./store/store.routes')
  }
];
