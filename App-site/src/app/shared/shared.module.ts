
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DsPaginacaoComponent } from './components/ds-paginacao/ds-paginacao.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DsPaginacaoComponent
  ],
  exports: [
    DsPaginacaoComponent
  ]
})
export class SharedModule { }
