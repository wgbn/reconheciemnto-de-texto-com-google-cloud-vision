import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {GenericService} from "../../app/generic.service";

@IonicPage()
@Component({
    selector: 'page-add-livro',
    templateUrl: 'add-livro.html',
})
export class AddLivroPage {

    livro: any = {};
    saveLoad: boolean = false;

    constructor(private navCtrl: NavController, private srv: GenericService, private alertCtrl: AlertController) { }

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
                let alert = this.alertCtrl.create({
                    title: 'Ooops!',
                    subTitle: 'Não foi possível conectar ao servidor',
                    buttons: ['OK']
                });
                alert.present();
            }
        );
    }

    cancelarClick() {
        this.navCtrl.pop();
    }

}
