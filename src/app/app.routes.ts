import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CompteComponent } from './components/compte/compte.component';
import { RenewPasswordComponentAnd2FAComponent } from './components/renew-password-and-twofa/renew-password.component';

export const routes: Routes = [
  {
    path     : '',
    component: HomeComponent,
    data     : { animation: 'home' },
  },
  {
    path     : 'login',
    component: LoginComponent,
    data     : { animation: 'login' },
  },
  {
    path     : 'register',
    component: RegisterComponent,
    data     : { animation: 'register' },
  },
  {
    path     : 'compte',
    component: CompteComponent,
    data     : { animation: 'compte' },
  },
    {
    path     : 'renew-password-and-twofa',
    component: RenewPasswordComponentAnd2FAComponent,
    data     : { animation: 'register' },
  },
  
];
