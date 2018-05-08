import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLivroPage } from './add-livro';

@NgModule({
  declarations: [
    AddLivroPage,
  ],
  imports: [
    IonicPageModule.forChild(AddLivroPage),
  ],
})
export class AddLivroPageModule {}
