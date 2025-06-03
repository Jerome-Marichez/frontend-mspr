import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Connexion, Login, LoginResult } from '../core/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //Username (ou email) qui appel la route qui genere un mdp, le crypte et genere un 2FA, le stocke en bdd, genere aussi un qr code -> Renvoi les 3 le username, le mdp généré et le 2fa, que derrière je display a l'utilisateur à sa guise, et une date de creation
  inscription(email: string): Observable<LoginResult> {
    const options = { email }

   return this.http.post<LoginResult>("http://34.155.52.159:8080/function/passwordgenandqrcode", options);
  }

  //renseigne le username et le mdp et le 2fa, si la date de creation est outdated de 6 mois je bloque et le force a se réinscrire (peut etre delete le user existant ?)
  connexion(connexion: Connexion): Observable<LoginResult> {
    const options = { connexion }

    return this.http.post<LoginResult>("http://34.155.52.159:8080/function/authcheck", options);
  }

  generate2fa(username: string): Observable<string> {
    const options = {username}

    return this.http.post<string>("http://34.155.52.159:8080/function/secret2faandqrcode", options);
  }
    
}
