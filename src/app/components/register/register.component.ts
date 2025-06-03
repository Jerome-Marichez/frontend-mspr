import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  registerEmail: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() { 
    // Vérification que tous les champs sont remplis
    if (!this.registerEmail) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    console.log('Inscription :', {
      email: this.registerEmail
    });

    this.authService.inscription(this.registerEmail).subscribe(result => {
      if (result) {
        console.log(result);

        window.localStorage.setItem('email',result.result.email);
        window.localStorage.setItem('password',result.result.password);
        window.localStorage.setItem('crypte',result.result.encryptedPassword);
        window.localStorage.setItem('qr',result.result.qrPath);
        window.localStorage.setItem('createdAt', result.result.createdAt);

        this.authService.generate2fa(result.result.email).subscribe(result => {
          if (result) {
            console.log(result);

            window.localStorage.setItem('2fa', result)

            this.router.navigate(['/home'])
            
          }
        })
        
        
      }
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
