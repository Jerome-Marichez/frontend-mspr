import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'TechTest';
  subtitle = 'Interface de test MSPR';
  currentDate = new Date();
  private timerInterval: any;

  ngOnInit(): void {
    // Mise à jour de l'heure chaque seconde
    this.timerInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Nettoyage de l'intervalle à la destruction du composant
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}