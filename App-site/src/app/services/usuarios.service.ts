import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosResponse } from '../shared/models/usuarios/usuarios-response.model';
import { UsuariosInserirRequest } from '../shared/models/usuarios/usuarios-inserir-request.model';
import { UsuariosEditarRequest } from '../shared/models/usuarios/usuarios-editar-request.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'https://localhost:5000/api/usuarios';

  constructor(private http: HttpClient) { }

  inserir(request: UsuariosInserirRequest): Observable<UsuariosResponse> {
    console.log('Inserindo usuário:', request);
    return this.http.post<UsuariosResponse>(this.apiUrl, request);
  }

  listar(): Observable<UsuariosResponse[]> {
    return this.http.get<UsuariosResponse[]>(this.apiUrl);
  }

  recuperar(id: number): Observable<UsuariosResponse> {
    return this.http.get<UsuariosResponse>(`${this.apiUrl}/${id}`);
  }

  editar(request: UsuariosEditarRequest): Observable<UsuariosResponse> {
    console.log('Editando usuário:', request);
    return this.http.put<UsuariosResponse>(this.apiUrl, request);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
