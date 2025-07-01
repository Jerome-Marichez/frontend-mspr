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
  otpQrCode: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;

  step: number = 0; // 0 = Email, 1 = QR OTP, 2 = Password + OTP

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy() {
    this.step = 0;
  }

  onRequest2FA() {
    this.errorMessage = '';

    if (!this.loginEmail) {
      this.errorMessage = 'Veuillez entrer votre email.';
      return;
    }

    this.isLoading = true;

    this.authService.generate2fa(this.loginEmail).subscribe(
      (result) => {
        if (result && result.result && result.result.qrCode) {
          this.otpQrCode = result.result.qrCode;
          this.step = 1; // affichage QR
          this._snackBar.open('Scannez le QR Code dans Google Authenticator.', 'Fermer');
        } else {
          this.errorMessage = 'Erreur lors de la génération du QR Code OTP.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur génération QR OTP :', error);
        this.errorMessage = 'Erreur serveur lors de la génération du QR Code OTP.';
        this.isLoading = false;
      }
    );
  }

  proceedToAuth() {
    this.step = 2; // affiche password + otp
  }

  onAuthCheck() {
    this.errorMessage = '';

    if (!this.loginEmail || !this.loginPassword || !this.otpCode) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
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
