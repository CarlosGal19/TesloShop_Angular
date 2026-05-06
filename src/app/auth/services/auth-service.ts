import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IAuthResponse } from '@auth/interfaces/auth-response.interface';
import { IUser } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
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

  validateStatusResource = rxResource({
    stream: () => this.checkStatus()
  })

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<IAuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => this.handleLoginSuccess(response)),
      map(() => true),
      catchError((error: any) => {
        this.logout()

        return of(false);
      })
    )
  };

  checkStatus(): Observable<boolean> {
    const authToken = localStorage.getItem('authToken') as string;
    if (!authToken) {
      this.logout()
      return of(false);
    }

    return this.http.get<IAuthResponse>(`${baseUrl}/auth/check-status`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).pipe(
      tap(response => this.handleLoginSuccess(response)),
      map(() => true),
      catchError((error: any) => {
        this.logout()

        return of(false);
      })
    )
  }

  logout() {
    this._authStatus.set('not-auth');
    this._user.set(null);
    this._token.set(null);

    localStorage.removeItem('authToken');
  }

  private handleLoginSuccess(data: IAuthResponse) {
    this._authStatus.set('auth');
    this._user.set(data.user);
    this._token.set(data.token);

    localStorage.setItem('authToken', data.token);
  }
}
