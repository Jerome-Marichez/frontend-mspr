import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Connexion } from '../../core/login';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterResult } from './interfaces/registerInterface';

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
  codeTemp: string = '';

  email: string = '';
  password: string = '';         // Mot de passe généré
  crypte: string = '';
  qr: string = '';               // VA RECEVOIR qrCode (data URI)
  createdAt: string = '';
  expired: boolean = false;
  twofa: string = '';

  doubleAuth: boolean = false;
  doubleAuthOTP: boolean = false;

  linkQr: string = '';  // Ce qui sera affiché dans l'<img>
  linkOTP: string = '';

  // Pour affichage du mot de passe généré
  showPassword: boolean = false;

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy() {
    this.doubleAuthOTP = false;
  }

  onRegister() {
    // Vérification que tous les champs sont remplis
    if (!this.registerEmail) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (!this.registerEmail.includes('@') || !this.registerEmail.includes('.')) {
      this.errorMessage = 'Veuillez renseigner une adresse mail valide';
      return;
    }

    console.log('Inscription :', {
      email: this.registerEmail,
    });

    this.authService.inscription(this.registerEmail).subscribe(
      (result) => {
        if (result) {
          console.log('LE RESULT', result);

          this.email     = result.result.email;
          this.password  = result.result.password || '';  
          this.crypte    = result.result.encryptedPassword;
          this.qr        = result.result.qrCode || '';
          this.createdAt = result.result.createdAt.toString();
          this.expired   = result.result.expired;

          this.linkQr = this.qr;

          // Le mot de passe est affiché seulement avant la double auth
          this.doubleAuth = true;
          this.doubleAuthOTP = false;

          this.authService.generate2fa(result.result.email).subscribe(
            (result2fa) => {
              if (result2fa) {
                console.log(result2fa);

                this.linkOTP = result2fa.result.qrPath;
                this.crypte  = result2fa.result.encrypted2FASecret;

                this.doubleAuth = true;
                  // Quand on passe à l'étape OTP, on cache le password affiché
                  // Il reste en mémoire mais n'est plus affiché, sécurité++
              }
            },
            (error) => {
              if (error) {
                this.errorMessage = `Erreur serveur de génération du QR Code du mot de passe.`;
              }
            }
          );
        }
      },
      (error) => {
        if (error) {
          this.errorMessage = `Erreur serveur dans l'inscription.`;
        }
      }
    );
  }

  // Nouvelle fonction : Affiche/masque le password
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Nouvelle fonction : Copie le password dans le presse-papiers
  copyPassword() {
    if (this.password) {
      navigator.clipboard.writeText(this.password);
      this.openSnackBar('Mot de passe copié !', 'Fermer');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  mdpGenerated(pwd: string) {
    console.log(pwd);

    // Vérifie que l'utilisateur a bien recopié le mot de passe affiché UNIQUEMENT DANS LE FRONT !
    if (pwd && pwd === this.password) {
      this.linkQr        = this.linkOTP;  // Passe au QR OTP
      this.codeTemp      = '';
      this.doubleAuthOTP = true;
    } else {
      this.openSnackBar("Le mot de passe recopié ne correspond pas.", "Fermer");
    }
  }

  complete(pwd: string) {
    console.log(pwd);

    if (pwd.length == 6) {
      const connexion: Connexion = {
        email   : this.email,
        password: this.password,
        code2FA : pwd,
      };

      this.authService.connexion(connexion).subscribe(
        (result) => {
          if (result) {
            window.localStorage.setItem('email', this.email);
            window.localStorage.setItem('password', this.password);
            window.localStorage.setItem('crypte', this.crypte);
            window.localStorage.setItem('qr', this.qr);
            window.localStorage.setItem('createdAt', this.createdAt);
            window.localStorage.setItem('expired', String(this.expired));
            window.localStorage.setItem('2fa', this.twofa);

            this.router.navigate(['/home']);
          }
        },
        (error) => {
          if (error) {
            this.openSnackBar('Erreur serveur liée au QR Code.', 'Fermer');
          }
        }
      );
    } else {
      this.openSnackBar('Code invalide', 'Fermer');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
