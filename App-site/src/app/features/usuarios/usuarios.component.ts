import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { UsuariosResponse } from '../../shared/models/usuarios/usuarios-response.model';
import { SharedModule } from '../../shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { UsuariosEditarRequest } from '../../shared/models/usuarios/usuarios-editar-request.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuariosResponse[] = [];
  editarUsuarioRequest: UsuariosEditarRequest = {};
  usuarioForm: FormGroup;
  modoEdicao: boolean = false;

  paginaCorrente: number = 1;
  itensPorPagina: number = 10;
  totalRegistros: number = 0;

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.usuarioForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
    
  }

  listarUsuarios(): void {
    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.totalRegistros = data.length;
      },
      error: () => {
        this.toastr.error('Erro ao carregar a lista de usuários.');
      }
    });
  }

  selecionarUsuario(usuario: UsuariosResponse): void {
    this.modoEdicao = true;
    this.usuarioForm.patchValue(usuario);
    this.usuarioForm.get('senha')?.clearValidators();
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.usuarioForm.get('senha')?.disable();
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.usuarioForm.reset();
    this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.usuarioForm.get('senha')?.enable();
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.toastr.warning('Por favor, preencha o formulário corretamente.');
      Object.values(this.usuarioForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const formValue = this.usuarioForm.value;

    if (this.modoEdicao) {
      this.editarUsuarioRequest = formValue;
      console.log(this.editarUsuarioRequest);
      this.usuariosService.editar(this.editarUsuarioRequest).subscribe({
        next: () => {
          this.toastr.success('Usuário editado com sucesso!');
          this.listarUsuarios();
          this.cancelarEdicao();
        },
        error: () => {
          this.toastr.error('Erro ao editar o usuário.');
        }
      });
    } else {
      this.usuariosService.inserir(formValue).subscribe({
        next: () => {
          this.toastr.success('Usuário inserido com sucesso!');
          this.listarUsuarios();
          this.cancelarEdicao();
        },
        error: () => {
          this.toastr.error('Erro ao inserir o usuário.');
        }
      });
    }
  }

  excluirUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuariosService.excluir(id).subscribe({
        next: () => {
          this.toastr.success('Usuário excluído com sucesso.');
          this.listarUsuarios();
          this.cancelarEdicao();
        },
        error: () => {
          this.toastr.error('Erro ao excluir o usuário.');
        }
      });
    }
  }

  onTrocarDePagina(event: any): void {
    this.paginaCorrente = event.page;
    this.itensPorPagina = event.itemsPerPage;
  }

  getUsuariosPaginados(): UsuariosResponse[] {
    const inicio = (this.paginaCorrente - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.usuarios.slice(inicio, fim);
  }
}