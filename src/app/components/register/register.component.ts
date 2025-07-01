import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector   : 'app-register',
  standalone : true,
  imports    : [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls  : ['./register.component.scss'],
})
export class RegisterComponent {
  registerEmail: string  = '';
  errorMessage : string  = '';
  email        : string  = '';
  password     : string  = '';     // Mot de passe généré
  crypte       : string  = '';
  qr           : string  = '';     // Data URI QR Code
  expired      : boolean = false;
  twofa        : string  = '';     // Secret 2FA crypté
  linkQr       : string  = '';     // QR Code affiché (2FA ou setup)
  showPassword : boolean = false;
  doubleAuth   : boolean = false;  // Pour afficher étape 2FA
  doubleAuthOTP: boolean = false;

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

          this.email    = result.result.email;
          this.password = result.result.password || '';
          this.crypte   = result.result.encryptedPassword || '';
          this.qr       = result.result.qrCode || '';
          this.expired  = result.result.expired || false;

          this.linkQr     = this.qr;
          this.doubleAuth = true;     // Affichage mot de passe + QR uniquement

          console.log('Mot de passe généré:', this.password);
          console.log('QR Code généré:', this.qr);

            // 🔹 NE PAS GENERER DE 2FA ICI
            // Le 2FA sera généré au moment de la connexion pour le setup OTP

          this.openSnackBar('Compte créé avec succès. Veuillez copier votre mot de passe.', 'Fermer');
        }
      },
      (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        this.errorMessage = 'Erreur serveur lors de l\'inscription.';
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
