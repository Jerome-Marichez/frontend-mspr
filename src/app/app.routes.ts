import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component'; 
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    data: { animation: 'home' }
  },
  { 
    path: 'login', 
    component: LoginComponent,
    data: { animation: 'login' }
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    data: { animation: 'register' }
  },
  { 
    path: '**', 
    redirectTo: '',
    data: { animation: 'home' }
  }
];
