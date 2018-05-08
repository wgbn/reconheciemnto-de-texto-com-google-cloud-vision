import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPaginaPage } from './add-pagina';

@NgModule({
  declarations: [
    AddPaginaPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPaginaPage),
  ],
})
export class AddPaginaPageModule {}
