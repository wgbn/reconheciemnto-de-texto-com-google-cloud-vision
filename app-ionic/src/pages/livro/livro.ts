import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddPaginaPage} from "../add-pagina/add-pagina";
import {GenericService} from "../../app/generic.service";

/**
 * Generated class for the LivroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-livro',
    templateUrl: 'livro.html',
})
export class LivroPage {

    livroId: number;
    livro: any = null;
    load: boolean = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private srv: GenericService) {
        this.livroId = navParams.get('livro').id;
    }

    ionViewWillEnter() {
        this.loadLivro();
    }

    private loadLivro() {
        this.load = true;
        this.srv.getOne('livro', this.livroId).subscribe(
            success => {
                this.load = false;
                this.livro = success.body;
            }, err => {
                this.load = false;
                alert('Não foi possível conectar ao servidor');
            }
        );
    }

    addPaginaClick() {
        this.navCtrl.push(AddPaginaPage, {livro: this.livro});
    }

}
