import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerEmail: string = '';
  errorMessage: string = '';
  email: string = '';
  password: string = '';
  crypte: string = '';
  qr: string = '';
  expired: boolean = false;
  twofa: string = '';
  linkQr: string = '';
  showPassword: boolean = false;
  doubleAuth: boolean = false; // affiche étape mot de passe
  showTwoFaStep: boolean = false; // affiche étape QR 2FA
  twoFaQrCode: string = ''; // QR Code 2FA

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    if (!this.registerEmail) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (!this.registerEmail.includes('@') || !this.registerEmail.includes('.')) {
      this.errorMessage = 'Veuillez renseigner une adresse mail valide';
      return;
    }

    console.log('Inscription :', { email: this.registerEmail });

    this.authService.inscription(this.registerEmail).subscribe(
      (result) => {
        if (result && result.result) {
          console.log('LE RESULT', result);

          this.email = result.result.email;
          this.password = result.result.password || '';
          this.crypte = result.result.encryptedPassword || '';
          this.qr = result.result.qrCode || '';
          this.expired = result.result.expired || false;

          this.linkQr = this.qr;
          this.doubleAuth = true; // passe à l'étape mot de passe

          this.openSnackBar('Compte créé avec succès. Veuillez copier votre mot de passe.', 'Fermer');
        }
      },
      (error) => {
        console.error("Erreur lors de l'inscription:", error);
        this.errorMessage = "Erreur serveur lors de l'inscription.";
      }
    );
  }

  activateTwoFA() {
    this.authService.generate2fa(this.email).subscribe(
      (result) => {
        if (result && result.result) {
          this.twoFaQrCode = result.result.qrCode;
          this.showTwoFaStep = true;
          this.openSnackBar('QR Code 2FA généré. Scannez-le dans Google Authenticator.', 'Fermer');
        } else {
          this.errorMessage = "Erreur lors de la génération du QR Code 2FA.";
        }
      },
      (error) => {
        console.error("Erreur lors de la génération du QR Code 2FA:", error);
        this.errorMessage = "Erreur serveur lors de la génération du QR Code 2FA.";
      }
    );
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  copyPassword() {
    if (this.password) {
      navigator.clipboard.writeText(this.password);
      this.openSnackBar('Mot de passe copié !', 'Fermer');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
