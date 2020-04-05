import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
let ApiRequestsService = class ApiRequestsService {
    constructor(http) {
        this.http = http;
    }
    getOcorrencias() {
        return this.http.get('http://localhost:3000/ocorrencias');
    }
    getOcorrenciasByState(param) {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:3000/ocorrencias-estado?estado=' + param);
    }
    getInformacaoPessoal(id) {
        return this.http.get('http://localhost:3000/utilizador/' + id);
    }
    updateInformacaoPessoal(id, nome, email, tel) {
        const body = new HttpParams()
            .set('nome_utilizador', nome)
            .set('email_utilizador', email)
            .set('telemovel_utilizador', tel);
        return this.http.put('http://localhost:3000/utilizador/' + id, body.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        })
            .pipe(retry(1), catchError(this.handleError));
    }
    addFotografia(url_fotografia) {
        const body = new HttpParams()
            .set('url_fotografia', url_fotografia);
        return this.http.post('http://localhost:3000/fotografia/', body.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        })
            .pipe(retry(1), catchError(this.handleError));
    }
    addOcorrencia(titulo_ocorrencia, descricao_ocorrencia, data_ocorrencia, latitude_ocorrencia, longitude_ocorrencia, rua_ocorrencia, fk_fotografia, fk_utilizador) {
        if (rua_ocorrencia === undefined || rua_ocorrencia === null || rua_ocorrencia === '') {
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
            .set('fk_utilizador', fk_utilizador);
        return this.http.post('http://localhost:3000/ocorrencia/', body.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        })
            .pipe(retry(1), catchError(this.handleError));
    }
    /* --------------------------- Error handling ---------------------------------- */
    handleError(error) {
        let errorMessage = '';
        console.log('STATUS: ', status);
        console.log('Erro: ', error);
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        }
        else {
            // Get server-side error
            errorMessage = `Código do Erro: ${error.status}\ Mensagem: ${error.message}`;
        }
        return throwError(errorMessage);
    }
};
ApiRequestsService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], ApiRequestsService);
export { ApiRequestsService };
//# sourceMappingURL=api-requests.service.js.map