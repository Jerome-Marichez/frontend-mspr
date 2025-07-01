import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Connexion } from '../../core/login';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginEmail: string = '';
  loginPassword: string = '';
  otpCode: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy() {}

  onLogin() {
    this.errorMessage = '';

    if (!this.loginEmail || !this.loginPassword || !this.otpCode) {
      this.errorMessage = 'Veuillez renseigner votre email, mot de passe et code OTP.';
      return;
    }

    const connexion: Connexion = {
      email: this.loginEmail,
      password: this.loginPassword,
      code2FA: this.otpCode,
    };

    this.isLoading = true;

    this.authService.connexion(connexion).subscribe(
      (result: any) => {
        this.isLoading = false;
        if (result && result.status === 'ok' && result.result?.success) {
          window.localStorage.setItem('email', this.loginEmail);
          window.localStorage.setItem('password', this.loginPassword);
          this._snackBar.open('Authentification réussie !', 'Fermer');
          this.router.navigate(['/']);
        } else {
          const message = result?.result?.message || 'Erreur d\'authentification.';
          this._snackBar.open(message, 'Fermer');
        }
      },
      (error: any) => {
        console.error('Erreur lors de l\'authentification :', error);
        this.isLoading = false;
        this._snackBar.open('Erreur serveur lors de l\'authentification.', 'Fermer');
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
