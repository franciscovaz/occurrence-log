import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestsService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000/';

  getOcorrencias(){
    return this.http.get(this.url + 'ocorrencias');
  }

  getOcorrenciaByUser(id){
    return this.http.get(this.url + 'ocorrencia-user/'+id, 
    {
      headers: new HttpHeaders()
      .set('authorization', localStorage.getItem('token'))
    })
  }

  getOcorrenciasByState(param, id){
    
    return this.http.get(this.url + 'ocorrencias-estado/'+id+'?estado='+param, 
    {
      headers: new HttpHeaders()
      .set('authorization', localStorage.getItem('token'))
      .append('Content-Type', 'application/json')
    })
  }

  getInformacaoPessoal(id){
    return this.http.get(this.url + 'utilizadorID/'+id, 
    {
      headers: new HttpHeaders()
      .set('authorization', localStorage.getItem('token'))
    })
  }

  getEmailAtLogin(email){
    return this.http.get(this.url + 'utilizador-login/'+email);
  }

  getEmailAndPaswoordAtLogin(email, password, hash){
    const body = new HttpParams()
    .set('hash', hash)
    return this.http.post(this.url + 'utilizador-check/'+email+'/'+password, body.toString(), 
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateInformacaoPessoal(id, nome, email, tel){
    const body = new HttpParams()
    .set('nome_utilizador', nome)
    .set('email_utilizador', email)
    .set('telemovel_utilizador', tel)
    return this.http.put(this.url + 'utilizador-update/'+id, body.toString(), 
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('authorization', localStorage.getItem('token'))
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  updateOcorrencia(id, comentario, estado) {
    const body = new HttpParams()
    .set('comentario_ocorrencia', comentario)
    .set('data_ultima_atualizacao_ocorrencia', moment(new Date).format('DD-MM-YYYY HH:mm'))
    .set('fk_estado', estado)
    return this.http.put(this.url + 'ocorrencia-update/'+id, body.toString(),
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  addFotografia(url_fotografia): Observable<any>{
    const body = new HttpParams()
    .set('url_fotografia', url_fotografia);
    return this.http.post(this.url + 'fotografia/', body.toString(),
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  addUser(name, email, phone, password){

    const body = new HttpParams()
    .set('nome_utilizador', name)
    .set('email_utilizador', email)
    .set('telemovel_utilizador', phone)
    .set('password_utilizador', password)
    .set('fk_tipo_utilizador', '4')
    return this.http.post(this.url + 'utilizador/', body.toString(),
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  addOcorrencia(titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia,longitude_ocorrencia, rua_ocorrencia, fk_fotografia, fk_utilizador): Observable<any> {
    if(rua_ocorrencia === undefined || rua_ocorrencia === null || rua_ocorrencia === ''){
      // TODO confirmar se entra aqui
      rua_ocorrencia = 'Rua não definida no marker do mapa';
    }
    
    const body = new HttpParams()
    .set('titulo_ocorrencia', titulo_ocorrencia)
    .set('descricao_ocorrencia', descricao_ocorrencia)
    .set('data_ocorrencia', data_ocorrencia)
    .set('latitude_ocorrencia', latitude_ocorrencia)
    .set('longitude_ocorrencia', longitude_ocorrencia)
    .set('rua_ocorrencia', rua_ocorrencia)
    .set('fk_fotografia', fk_fotografia)
    .set('fk_freguesia', '1')
    .set('fk_distrito', '1')
    .set('fk_estado', '1')
    .set('fk_utilizador', fk_utilizador)
    return this.http.post(this.url + 'ocorrencia/', body.toString(),
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('authorization', localStorage.getItem('token'))
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  sendEmail(data) {
    return this.http.post(this.url + 'sendmail', data);
  }

  sendEmailUpdate(data) {
    return this.http.post(this.url + 'sendmail-update', data);
  }


  getTokenAfterLogin(email, id_utilizador){
    return this.http.get(this.url + 'token/sign/'+email+'/'+id_utilizador);
  }


  /* --------------------------- Error handling ---------------------------------- */

  handleError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
    } else {
        // Get server-side error
        errorMessage = `Código do Erro: ${error.status}\ Mensagem: ${error.message}`;
    }
    return throwError(errorMessage);
}

/* --------------------------- END Error handling ---------------------------------- */
}
