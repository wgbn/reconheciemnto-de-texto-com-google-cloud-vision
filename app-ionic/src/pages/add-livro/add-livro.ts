import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {GenericService} from "../../app/generic.service";

@IonicPage()
@Component({
    selector: 'page-add-livro',
    templateUrl: 'add-livro.html',
})
export class AddLivroPage {

    livro: any = {};
    saveLoad: boolean = false;

    constructor(private navCtrl: NavController, private srv: GenericService) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddLivroPage');
    }

    salvarLivroClick(values) {
        this.saveLoad = true;
        this.srv.create('livro', values).subscribe(
            success => {
                this.saveLoad = false;
                this.navCtrl.pop();
            }, err => {
                this.saveLoad = false;
                alert('Erro ao conectar ao servidor');
            }
        );
    }

    cancelarClick() {
        this.navCtrl.pop();
    }

}
