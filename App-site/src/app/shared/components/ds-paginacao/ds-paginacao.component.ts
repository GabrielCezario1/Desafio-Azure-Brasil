import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const $ : Object;

const PAGINA_CORRENTE = 1;
const NUMERO_DOIS = 2;
const NUMERO_TRES = 3;
const NUMERO_CINCO = 5;
const LIMITE_PAGINAS = 5;
const DEZ_ITENS_POR_PAGINA = 10;
const DOZE_ITENS_POR_PAGINA = 12;
const VINTE_ITENS_POR_PAGINA = 20;
const TRINTA_ITENS_POR_PAGINA = 30;
const CINQUENTA_ITENS_POR_PAGINA = 50;
const CEM_ITENS_POR_PAGINA = 100;
const ARRAY_QUANTIDADE_POR_PAGINA = [DEZ_ITENS_POR_PAGINA, DOZE_ITENS_POR_PAGINA, VINTE_ITENS_POR_PAGINA, TRINTA_ITENS_POR_PAGINA, CINQUENTA_ITENS_POR_PAGINA, CEM_ITENS_POR_PAGINA];

@Component({
    selector: "ds-paginacao",
    templateUrl: "./ds-paginacao.component.html",
    host: { 'class': 'w-100' },
    styles: [],
    imports: [NgClass, FormsModule, CommonModule]
})
export class DsPaginacaoComponent implements OnInit {

  @Input() paginaCorrente = PAGINA_CORRENTE;
  @Input() registros!: Array<Object>;
  @Input() total!: number;
  @Input() carregando: boolean = false;
  @Input() cor!: string;
  @Input() pequeno: boolean = false;
  @Input() itensPorPagina: number = DOZE_ITENS_POR_PAGINA;
  @Input() numeroLimiteDePaginas = LIMITE_PAGINAS;
  @Input() itensPorPaginaConfig: Array<number> = ARRAY_QUANTIDADE_POR_PAGINA;

  @Output() onTrocarDePagina = new EventEmitter<Object>();

  reload = false;

  constructor() {}

  ngOnInit() {
    this.total = this.registros.length;
  }

  trocarDePagina(event: any): void {
    const quantidadePaginas = this.getQuantidadePaginas();

    if(quantidadePaginas > 1 && event.page <= quantidadePaginas) {
      this.paginaCorrente = event.page;
      this.itensPorPagina = event.itemsPerPage;
      this.onTrocarDePagina.emit(event);
    }
  }

  mudarPagina(pagina: number): void {
    const evento = new Object({
      page: pagina,
      itemsPerPage: this.itensPorPagina
    });
    this.trocarDePagina(evento);
  }
    
  irParaPagina(evento: { page: number; }): void {
    this.paginaCorrente = evento.page;

    this.trocarDePagina(evento);

    this.recarregarPaginacao();
  }

  alteraItensPorPagina(): void {
    this.paginaCorrente = 1;

    const evento = new Object({
      page: this.paginaCorrente,
      itemsPerPage: this.itensPorPagina
    });

    this.onTrocarDePagina.emit(evento);

    this.recarregarPaginacao();
  }

  getQuantidadePaginas() : number {
    return Math.ceil((this.total / this.itensPorPagina));
  }

  recarregarPaginacao() {
    this.reload = true;

    setTimeout(() => {
      this.reload = false;
    }, 0);
  }

  obterNumerosPaginas(): number[] {
    const numeroPaginas = Math.ceil(this.total / this.itensPorPagina);
    if (numeroPaginas <= 0) {
      return [];
    }
    return Array.from({ length: numeroPaginas }, (_, indice) => indice + 1);
  }
    
  obterOpcoesPaginas(): number[] {
    const numerosPaginas = this.obterNumerosPaginas();
    if (this.paginaCorrente < NUMERO_TRES) {
      return numerosPaginas.slice(0, NUMERO_CINCO);
    }
    else if (this.paginaCorrente + NUMERO_DOIS >= numerosPaginas.length && numerosPaginas.length>=NUMERO_CINCO) {
      return numerosPaginas.slice(
        numerosPaginas.length - NUMERO_CINCO,
        numerosPaginas.length
      );
    }
    else {
      return numerosPaginas.slice(
        this.paginaCorrente - NUMERO_TRES,
        this.paginaCorrente + NUMERO_DOIS
      );
    }
  }
  trackByPagina(index: number, pagina: number): number {
    return pagina;
  }
}
