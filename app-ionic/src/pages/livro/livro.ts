import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddPaginaPage} from "../add-pagina/add-pagina";
import {GenericService} from "../../app/generic.service";
import {PaginaPage} from "../pagina/pagina";

@IonicPage()
@Component({
    selector: 'page-livro',
    templateUrl: 'livro.html',
})
export class LivroPage {

    livroId: number;
    livro: any = null;
    load: boolean = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private srv: GenericService, private alertCtrl: AlertController) {
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
                let alert = this.alertCtrl.create({
                    title: 'Ooops!',
                    subTitle: 'Não foi possível conectar ao servidor',
                    buttons: ['OK']
                });
                alert.present();
            }
        );
    }

    addPaginaClick() {
        this.navCtrl.push(AddPaginaPage, {livro: this.livro});
    }

    exluirLivroClick() {
        let confirm = this.alertCtrl.create({
            title: 'Atenção!',
            message: 'Quer mesmo excluir este livro?',
            buttons: [
                {
                    text: 'Não'
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.load = true;
                        this.livro.paginas.forEach( pagina => this.srv.delete('pagina', pagina.id).subscribe(ok => console.log('pagina esxluida', pagina.id)) );
                        this.srv.delete('livro', this.livro.id).subscribe(
                            success => {this.load = false; this.navCtrl.pop(); },
                            err => {
                                let alert = this.alertCtrl.create({
                                    title: 'Ooops!',
                                    subTitle: 'Não foi possível conectar ao servidor',
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                        );
                    }
                }
            ]
        });
        confirm.present();
    }

    paginaClick(pagina) {
        this.navCtrl.push(PaginaPage, {pagina: pagina});
    }

}
