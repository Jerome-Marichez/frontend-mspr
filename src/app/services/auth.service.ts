import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Connexion, Gen2fa, Login, LoginResult } from '../core/login';
import { RegisterResult } from '../components/register/interfaces/registerInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //Username (ou email) qui appel la route qui genere un mdp, le crypte et genere un 2FA, le stocke en bdd, genere aussi un qr code -> Renvoi les 3 le username, le mdp généré et le 2fa, que derrière je display a l'utilisateur à sa guise, et une date de creation
  inscription(email: string): Observable<{ status: string; result: RegisterResult }> {
    const options = { email };
    return this.http.post<{ status: string; result: RegisterResult }>(
      "http://34.155.142.169/openfaas/function/passwordgenandqrcode",
      options
    );
  }

  //renseigne le username et le mdp et le 2fa, si la date de creation est outdated de 6 mois je bloque et le force a se réinscrire (peut etre delete le user existant ?)
  connexion(connexion: Connexion): Observable<LoginResult> {
    // Formatage explicite des données pour correspondre exactement à ce qu'attend le backend
    const payload = {
      email: connexion.email,
      password: connexion.password,
      code2FA: connexion.code2FA
    };
    
    console.log('Payload envoyé au backend:', payload);
    console.log('Heure exacte de l\'envoi:', new Date().toISOString());
    
    // Ajout d'un timeout plus long pour s'assurer que la requête a le temps de s'exécuter
    return this.http.post<LoginResult>("http://34.155.142.169/openfaas/function/authcheck", payload)
      .pipe(
        map(response => {
          console.log('Réponse brute du backend:', response);
          return response;
        }),
        catchError(error => {
          console.error('Erreur lors de l\'authentification:', error);
          
          const errorResult: LoginResult = {
            status: 'error',
            result: {
              success: false,
              expired: false,
              message: `Erreur de communication avec le serveur: ${error.message || error.statusText}`,
              reason: 'server_error'
            }
          };
          return of(errorResult);
        })
      );
  }

  generate2fa(email: string): Observable<Gen2fa> {
    const options = {email}

    return this.http.post<Gen2fa>("http://34.155.142.169/openfaas/function/secret2faandqrcode", options);
  }
    
}
