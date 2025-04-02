import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'TechTest';
  subtitle = 'Interface de test MSPR';
  currentDate = new Date();
  private timerInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Mise à jour de l'heure chaque seconde
    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}