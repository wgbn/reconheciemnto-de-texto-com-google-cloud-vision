import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private camera: Camera,
        private srv: GenericService,
        private sn: DomSanitizer,
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
            /*const formData = new FormData();
            formData.append("page", this.foto);
            formData.append('livroId', this.livro.id);
            formData.append('pagina', this.pagina.pagina);

            this.saveLoad = true;

            return this.srv.upload('pagina/uploadpagina', formData).subscribe(
                success => {
                    this.saveLoad = false;
                    this.foto = null;
                    this.navCtrl.pop();
                }, err => {
                    this.saveLoad = false;
                    alert('Erro ao conectar ao servidor');
                    console.log(JSON.stringify(err));
                }
            );*/

            this.saveLoad = true;
            this.srv.uploadFile('pagina/uploadpagina', {path: this.foto, newPath: this.newPath}, {livroId: this.livro.id, pagina: this.pagina.pagina}).subscribe(
                success => {

                    if (success.body.ok) {
                        this.srv.update(`pagina/${success.body.pagina.id}`, {texto: success.body.texto}).subscribe(
                            salvo => {
                                this.saveLoad = false;
                                this.foto = null;
                                this.pagina = {};
                                this.navCtrl.pop();
                            }, erro => {
                                this.saveLoad = false;
                                this.saveLoad = false;
                                alert('Erro ao conectar ao servidor');
                                console.log(JSON.stringify(erro));
                            }
                        );
                    } else {
                        this.saveLoad = false;
                        this.foto = null;
                        this.pagina = {};
                        alert('A imagem não pôde ser reconhecida\nTente outra melhor.');
                    }

                },err => {
                    this.saveLoad = false;
                    this.saveLoad = false;
                    alert('Erro ao conectar ao servidor');
                    console.log(JSON.stringify(err));
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
                alert(JSON.stringify(err));
            });

        }, (err) => {
            alert('Erro ao bater a foto');
            console.log(JSON.stringify(err));
        });
        /*this.srv.list('pagina/teste').subscribe(
            success => console.log(success), err => console.log(err)
        );*/
    }

    getImagem(imagem) {
        return this.sn.bypassSecurityTrustResourceUrl(imagem);
    }

    cancelarClick() {
        this.navCtrl.pop();
    }

}
