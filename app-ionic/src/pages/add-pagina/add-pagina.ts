import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {GenericService} from "../../app/generic.service";
import {DomSanitizer} from "@angular/platform-browser";
import {File} from "@ionic-native/file";
import {FileTransfer, FileUploadOptions, FileTransferObject} from "@ionic-native/file-transfer";

declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-add-pagina',
    templateUrl: 'add-pagina.html',
})
export class AddPaginaPage {

    livro: any = null;

    pagina: any = {};
    options: CameraOptions = {};
    foto: any = null;
    newPath: any = null;
    saveLoad: boolean = false;

    res: any;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private camera: Camera,
        private srv: GenericService,
        private sn: DomSanitizer,
        private alertCtrl: AlertController,
        private file: File) {
        this.livro = navParams.get('livro');

        this.options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
    }

    ionViewWillEnter() {
        console.log('ionViewDidLoad AddPaginaPage');
    }

    salvarPagina(values) {
        if (this.foto) {

            this.saveLoad = true;
            this.srv.uploadFile('pagina/uploadpagina', {path: this.foto, newPath: this.newPath}, {livroId: this.livro.id, pagina: this.pagina.pagina}).subscribe(
                success => {

                    //console.log(JSON.stringify(success.response));
                    this.res = JSON.parse(success.response);

                    if (this.res.ok) {
                        this.srv.update(`pagina/${this.res.pagina.id}`, {texto: this.res.texto}).subscribe(
                            salvo => {
                                this.saveLoad = false;
                                this.foto = null;
                                this.pagina = {};
                                this.navCtrl.pop();
                            }, erro => {
                                this.saveLoad = false;
                                this.saveLoad = false;
                                let alert = this.alertCtrl.create({
                                    title: 'Ooops!',
                                    subTitle: 'Não foi possível conectar ao servidor',
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                        );
                    } else {
                        this.saveLoad = false;
                        this.foto = null;
                        this.pagina = {};

                        let alert = this.alertCtrl.create({
                            title: 'Ooops!',
                            subTitle: 'A imagem não pôde ser reconhecida. Tente outra melhor.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }

                },err => {
                    this.saveLoad = false;
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
    }

    baterFoto() {
        this.camera.getPicture(this.options).then((imageData) => {

            let sourceDirectory = imageData.substring(0, imageData.lastIndexOf('/') + 1);
            let sourceFileName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.length);
            sourceFileName = sourceFileName.split('?').shift();

            this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.externalApplicationStorageDirectory, sourceFileName).then((result: any) => {
                this.foto = imageData;
                this.newPath = result.nativeURL;

            }, (err) => {
                let alert = this.alertCtrl.create({
                    title: 'Ooops!',
                    subTitle: 'Erro ao copiar o arquivo.',
                    buttons: ['OK']
                });
                alert.present();
            });

        }, (err) => {
            let alert = this.alertCtrl.create({
                title: 'Ooops!',
                subTitle: 'Erro ao bater a foto.',
                buttons: ['OK']
            });
            alert.present();
            console.log(JSON.stringify(err));
        });
    }

    getImagem(imagem) {
        return this.sn.bypassSecurityTrustResourceUrl(imagem);
    }

    cancelarClick() {
        this.navCtrl.pop();
    }

}
