import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GenericService} from "../../app/generic.service";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
    selector: 'page-pagina',
    templateUrl: 'pagina.html',
})
export class PaginaPage {

    pagina: any = {};
    imagem: any;
    load: boolean = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private srv: GenericService, private sn: DomSanitizer, private alertCtrl: AlertController) {
        this.pagina = navParams.get('pagina');
    }

    ionViewWillEnter() {
        if (this.pagina.scan) {
            this.imagem = this.sn.bypassSecurityTrustResourceUrl(this.pagina.scan);
        }
    }

    excluirPaginaClick() {
        let confirm = this.alertCtrl.create({
            title: 'Atenção!',
            message: 'Quer mesmo excluir esta página?',
            buttons: [
                {
                    text: 'Não'
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.load = true;
                        this.srv.delete('pagina', this.pagina.id).subscribe(
                            success => {this.load = false; this.navCtrl.pop(); },
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
                }
            ]
        });
        confirm.present();
    }

    scanearClick() {
        if (this.pagina.scan) {
            this.load = true;
            this.srv.create('pagina/scanear', {file: this.pagina.scan}).subscribe(
                success => {
                    if (success.body.ok) {
                        this.srv.update(`pagina/${this.pagina.id}`, {texto: success.body.texto}).subscribe(
                            salvo => {
                                this.load = false;
                                this.pagina.texto = success.body.texto;
                            }
                        );
                    } else {
                        this.load = false;
                        let alert = this.alertCtrl.create({
                            title: 'Ooops!',
                            subTitle: 'Não foi possível reconhecer a imagem. tente uma melhor.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
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
    }

}
