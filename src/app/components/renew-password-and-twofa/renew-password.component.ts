import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-renew-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './renew-password.component.html',
  styleUrls: ['./renew-password.component.scss'],
})
export class RenewPasswordComponentAnd2FAComponent {
  email: string = '';
  password: string = '';
  crypte: string = '';
  qr: string = '';
  linkQr: string = '';
  showPassword: boolean = false;
  doubleAuth: boolean = true;      // affiche directement étape mot de passe
  showTwoFaStep: boolean = false;  // affichera étape QR 2FA
  twoFaQrCode: string = '';

  private _snackBar = inject(MatSnackBar);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      if (!this.email) {
        this._snackBar.open('Email non fourni, retour à l\'accueil', 'Fermer');
        this.router.navigate(['/']);
      } else {
        this.generateNewPassword();
      }
    });
  }

  generateNewPassword() {
    this.authService.generateNewPassword(this.email).subscribe(
      (result : any) => {
        if (result && result.result) {
          this.password = result.result.password || '';
          this.crypte = result.result.encryptedPassword || '';
          this.qr = result.result.qrCode || '';
          this.linkQr = this.qr;
          this._snackBar.open('Nouveau mot de passe généré.', 'Fermer');
        } else {
          this._snackBar.open('Erreur lors de la génération du mot de passe.', 'Fermer');
        }
      },
      (error) => {
        console.error('Erreur génération mot de passe:', error);
        this._snackBar.open('Erreur serveur.', 'Fermer');
      }
    );
  }

  activateTwoFA() {
    this.authService.generate2fa(this.email).subscribe(
      (result) => {
        if (result && result.result) {
          this.twoFaQrCode = result.result.qrCode;
          this.showTwoFaStep = true;
          this._snackBar.open('QR Code 2FA généré.', 'Fermer');
        } else {
          this._snackBar.open('Erreur génération QR Code 2FA.', 'Fermer');
        }
      },
      (error) => {
        console.error('Erreur génération QR Code 2FA:', error);
        this._snackBar.open('Erreur serveur.', 'Fermer');
      }
    );
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  copyPassword() {
    if (this.password) {
      navigator.clipboard.writeText(this.password);
      this._snackBar.open('Mot de passe copié !', 'Fermer');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
