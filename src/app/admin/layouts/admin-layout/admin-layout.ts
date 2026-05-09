import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'admin-layout',
  imports: [RouterOutlet],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  authService = inject(AuthService);
}
