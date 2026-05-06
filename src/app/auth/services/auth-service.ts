import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { IAuthResponse } from '@auth/interfaces/auth-response.interface';
import { IUser } from '@auth/interfaces/user.interface';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'auth' | 'not-auth';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<IUser | null>(null);
  private _token = signal<string | null>(null);

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._authStatus() === 'auth') return 'auth';
    return 'not-auth';
  });

  user = computed(() => this._user())

  token = computed(() => this._token() )

  http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<IAuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this._authStatus.set('auth');
        this._user.set(response.user);
        this._token.set(response.token);

        localStorage.setItem('authToken', response.token);
      })
    )
  };
}
