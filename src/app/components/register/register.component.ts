import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onRegister() {
    // Vérification si les mots de passe correspondent
    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    
    // Vérification que tous les champs sont remplis
    if (!this.registerUsername || !this.registerEmail || !this.registerPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Simulation d'enregistrement (à remplacer par un appel API réel)
    console.log('Inscription :', {
      username: this.registerUsername,
      email: this.registerEmail,
      password: this.registerPassword
    });

    // Redirection vers la page de connexion après inscription
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
