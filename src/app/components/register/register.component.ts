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

          // Stockage des informations d'inscription
          this.email     = result.result.email;
          this.password  = result.result.password || '';  
          this.crypte    = result.result.encryptedPassword;
          this.qr        = result.result.qrCode || '';
          this.createdAt = result.result.createdAt.toString();
          this.expired   = result.result.expired;

          console.log('Mot de passe généré:', this.password);
          console.log('Mot de passe crypté:', this.crypte);

          this.linkQr = this.qr;

          // Le mot de passe est affiché seulement avant la double auth
          this.doubleAuth = true;
          this.doubleAuthOTP = false;
          
          // Nous allons générer un secret 2FA pour cet utilisateur
          this.authService.generate2fa(this.email).subscribe(
            (result2fa) => {
              if (result2fa) {
                console.log('Génération 2FA réussie:', result2fa);
                
                // Stockage du secret 2FA généré
                this.twofa = result2fa.result.encrypted2FASecret;
                this.linkOTP = result2fa.result.qrPath;
                
                // Passage à l'étape OTP
                this.doubleAuth = true;
                this.doubleAuthOTP = true;
                
                console.log('Secret 2FA généré et stocké:', {
                  email: this.email,
                  twofa: this.twofa,
                  qrPath: this.linkOTP
                });
              }
            },
            (error) => {
              console.error('Erreur lors de la génération du secret 2FA:', error);
              this.errorMessage = 'Erreur lors de la génération du code 2FA. Veuillez réessayer.';
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
    console.log('Code OTP saisi:', pwd);

    if (pwd.length == 6) {
      // Nettoyage du code OTP (suppression des espaces éventuels)
      const cleanCode = pwd.trim();
      
      // Affichage des données stockées pour débogage
      console.log('Données stockées avant envoi:', {
        email: this.email,
        password: this.password,
        twofa: this.twofa
      });
      
      // Vérification que le mot de passe n'a pas de caractères spéciaux qui pourraient causer des problèmes
      console.log('Mot de passe brut:', this.password);
      console.log('Longueur du mot de passe:', this.password.length);
      
      // IMPORTANT: Envoi immédiat du code OTP pour éviter qu'il n'expire (les codes TOTP changent toutes les 30 secondes)
      const connexion: Connexion = {
        email   : this.email,
        password: this.password,
        code2FA : cleanCode,
      };

      console.log('Données envoyées au serveur:', JSON.stringify(connexion));
      console.log('Heure d\'envoi du code OTP:', new Date().toISOString());
      
      this.authService.connexion(connexion).subscribe(
        (result) => {
          console.log('Réponse du serveur:', result);
          console.log('Détails de la réponse:', JSON.stringify(result, null, 2));
          // Vérification correcte de la structure de la réponse
          if (result && result.status === 'ok' && result.result && result.result.success === true) {
            // Authentification réussie
            window.localStorage.setItem('email', this.email);
            window.localStorage.setItem('password', this.password);
            window.localStorage.setItem('crypte', this.crypte);
            window.localStorage.setItem('qr', this.qr);
            window.localStorage.setItem('createdAt', this.createdAt);
            window.localStorage.setItem('expired', String(this.expired));
            window.localStorage.setItem('2fa', this.twofa);

            this.openSnackBar('Authentification réussie !', 'Fermer');
            // Redirection vers la page d'accueil (route vide '')
            this.router.navigate(['']);
          } else {
            // Authentification échouée mais réponse reçue
            const message = result?.result?.message || 'Code OTP invalide';
            this.openSnackBar(message, 'Fermer');
            console.error('Échec de validation:', result);
            
            // Affichage d'informations supplémentaires pour le débogage
            if (result && result.result && result.result.reason === 'invalid_password') {
              console.error('Erreur de mot de passe. Vérifiez que le mot de passe envoyé correspond à celui généré lors de l\'inscription.');
            } else if (result && result.result && result.result.reason === 'invalid_2fa') {
              console.error('Erreur de code 2FA. Vérifiez que le code saisi correspond bien à celui généré par Google Authenticator.');
            }
          }
        },
        (error) => {
          console.error('Erreur lors de la validation OTP:', error);
          this.openSnackBar('Code OTP invalide. Veuillez réessayer.', 'Fermer');
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