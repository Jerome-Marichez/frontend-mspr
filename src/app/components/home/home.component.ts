import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'Tests.com';
  subtitle = 'Interface de tests de MSPR';
  currentDate = new Date();
  detailsCondition: boolean = false;
  connecte: boolean = false;
  password: string = '';
  private timerInterval: any;
  
  // Propriété pour gérer l'affichage conditionnel des boutons d'authentification
  isAuthenticated: boolean = false;

  connectedStyle: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Mise à jour de l'heure chaque seconde
    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    // Vérifie si l'utilisateur est authentifié en cherchant l'email dans le localStorage
    const userEmail = window.localStorage.getItem('email');
    this.isAuthenticated = !!userEmail; // Convertit en booléen (true si email existe, false sinon)
    
    if (userEmail) {
      this.connectedStyle = true;
      this.title = `Bonjour ${this.formatStringBeforeAt(userEmail)}`;
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.connectedStyle = false;
  }

  formatStringBeforeAt(input: string): string {
    const parts = input.split('@');
    const beforeAt = parts[0];
    return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  deco() {
    if (localStorage.getItem('email') != null) {
      localStorage.clear();
      
      // Mise à jour de l'authentification
      this.isAuthenticated = false;
      this.connectedStyle = false;
      this.title = 'Tests.com';

      this.router.navigate(['/register']);
    }
  }

  details(detailsCondition: boolean) {
    if (window.localStorage.getItem('email') != null) {
      if (!detailsCondition) {
        this.detailsCondition = true;
        this.router.navigate(['/compte']);
      } else {
        detailsCondition = false;
      }
    }
  }
}
