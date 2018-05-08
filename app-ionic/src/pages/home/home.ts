import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GenericService} from "../../app/generic.service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    livros: Array<any> = new Array<any>();

    constructor(private navCtrl: NavController, private srv: GenericService) {
        this.loadLivros();
    }

    private loadLivros() {
        this.srv.list('livro', 'sort=titulo')
    }

    livroClick(livro) {

    }

}
