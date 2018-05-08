import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GenericService} from "../../app/generic.service";
import {LivroPage} from "../livro/livro";
import {AddLivroPage} from "../add-livro/add-livro";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    livros: Array<any> = new Array<any>();

    constructor(private navCtrl: NavController, private srv: GenericService) { }

    ionViewWillEnter() {
        this.loadLivros();
    }

    private loadLivros() {
        this.srv.list('livro', 'sort=titulo').subscribe(
            success => this.livros = success.body
        );
    }

    livroClick(livro) {
        this.navCtrl.push(LivroPage, {livro: livro});
    }

    addLivroClick() {
        this.navCtrl.push(AddLivroPage);
    }

}
