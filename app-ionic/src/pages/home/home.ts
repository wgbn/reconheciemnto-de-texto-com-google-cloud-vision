import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {GenericService} from "../../app/generic.service";
import {LivroPage} from "../livro/livro";
import {AddLivroPage} from "../add-livro/add-livro";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    livros: Array<any> = new Array<any>();
    load: boolean = false;

    constructor(private navCtrl: NavController, private srv: GenericService, private alertCtrl: AlertController) { }

    ionViewWillEnter() {
        this.loadLivros();
    }

    private loadLivros() {
        this.load = true;
        this.srv.list('livro', 'sort=titulo').subscribe(
            success => {
                this.livros = success.body;
                this.load = false;
            },
            err => {
                this.load = false;
                let alert = this.alertCtrl.create({
                    title: 'Ooops!',
                    subTitle: 'Não foi possível conectar ao servidor',
                    buttons: ['OK']
                });
                alert.present();
            }
        );
    }

    livroClick(livro) {
        this.navCtrl.push(LivroPage, {livro: livro});
    }

    addLivroClick() {
        this.navCtrl.push(AddLivroPage);
    }

}
