import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {GenericService} from "../../app/generic.service";
import {DomSanitizer} from "@angular/platform-browser";

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
    saveLoad: boolean = false;

    constructor(private navCtrl: NavController, private navParams: NavParams, private camera: Camera, private srv: GenericService, private sn: DomSanitizer) {
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
            const formData = new FormData();
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
            );
        } else {
            return null;
        }
    }

    baterFoto() {
        this.camera.getPicture(this.options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            this.foto = imageData;
        }, (err) => {
            alert('Erro ao bater a foto');
            console.log(JSON.stringify(err));
        });
    }

    getImagem() {
        return this.sn.bypassSecurityTrustResourceUrl(this.foto);
    }

}
