import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Connexion } from '../../core/login';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  logintwofa: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  codeTemp: string = '';

  doubleAuth: boolean = false;

  linkQr: string = '';

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy() {
    this.doubleAuth = false;
  }

  onLogin() {
    // Réinitialiser les messages d'erreur
    this.errorMessage = '';

    // Vérification des champs
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs svp !';
      return;
    } else if (window.localStorage.getItem('expired') == 'true') {
      this.errorMessage =
        'Il vous faut un nouveau mot de passe ! délai de 6 mois dépassé';
      this.router.navigate(['/register']);
    }

    this.authService.generate2fa(this.loginEmail).subscribe((result) => {
      if (result) {
        const otppath = result.result.qrPath;
        this.logintwofa = result.result.encrypted2FASecret;

        this.linkQr = otppath;
        this.doubleAuth = true;
      }
    });
  }

  complete(pwd: string) {
    if (pwd.length != 6) {
      const connexion: Connexion = {
        email: this.loginEmail,
        password: this.loginPassword,
        code2FA: pwd,
      };

      this.authService.connexion(connexion).subscribe(
        (result) => {
          console.log('Réponse de connexion:', result);
          if (result && result.status === 'ok' && result.result && result.result.success === true) {
            // Stockage des informations utilisateur
            window.localStorage.setItem('email', this.loginEmail);
            window.localStorage.setItem('password', this.loginPassword);
            window.localStorage.setItem('2fa', this.logintwofa);

            // Redirection vers la page d'accueil (route vide '')
            this.router.navigate(['']);
          } else {
            // Gestion des erreurs de connexion
            const message = result?.result?.message || 'Erreur d\'authentification';
            this._snackBar.open(message, 'Fermer');
          }
        },
        (error) => {
          if (error) {
            this.openSnackBar('Erreur serveur liée au QR Code', 'Fermer');
          }
        }
      );
    } else {
      this.openSnackBar('Code invalide', 'Fermer');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword() {
    // À implémenter : redirection vers la page de récupération de mot de passe
    console.log('Redirection vers récupération de mot de passe');
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
