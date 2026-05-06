import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { RouterLink } from "@angular/router";
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

  authService = inject(AuthService);

  formBuilder = inject(FormBuilder);
  hasError = signal<boolean>(false);
  isPosting = signal<boolean>(false);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(response => {
      console.log(response)
    })
  }
}
