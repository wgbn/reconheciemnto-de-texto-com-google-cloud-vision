import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LivroPage} from "../pages/livro/livro";
import {GenericService} from "./generic.service";
import {LivroPageModule} from "../pages/livro/livro.module";
import {HttpClientModule} from "@angular/common/http";
import {AddLivroPageModule} from "../pages/add-livro/add-livro.module";
import {AddPaginaPageModule} from "../pages/add-pagina/add-pagina.module";
import {AddLivroPage} from "../pages/add-livro/add-livro";
import {AddPaginaPage} from "../pages/add-pagina/add-pagina";
import {FormsModule} from "@angular/forms";
import {Camera} from "@ionic-native/camera";

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        IonicModule.forRoot(MyApp),
        LivroPageModule,
        AddLivroPageModule,
        AddPaginaPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LivroPage,
        AddLivroPage,
        AddPaginaPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        GenericService
    ]
})
export class AppModule {}
