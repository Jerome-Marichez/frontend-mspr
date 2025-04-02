import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  loginUsername: string = '';
  loginPassword: string = '';
  registerName: string = '';

  onLogin() {
    if (this.loginUsername && this.loginPassword) {
      console.log('Connexion :', {
        username: this.loginUsername,
        password: this.loginPassword
      });
    } else {
      console.log('Renseigne les champs stp zinc');
    }
  }

  onRegister() {
    if (this.registerName) {
      console.log('Inscription :', {
        name: this.registerName
      });
    } else {
      console.log('Renseigne ton nom tranquillement stp');
    }
  }
}