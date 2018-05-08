import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaginaPage } from './pagina';

@NgModule({
  declarations: [
    PaginaPage,
  ],
  imports: [
    IonicPageModule.forChild(PaginaPage),
  ],
})
export class PaginaPageModule {}
