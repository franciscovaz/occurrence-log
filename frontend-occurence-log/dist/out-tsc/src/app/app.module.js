import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule, AngularFireStorage } from "@angular/fire/storage";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from "../environments/environment";
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    NgModule({
        declarations: [
            AppComponent,
            HeaderComponent,
            FooterComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            MatIconModule,
            MatToolbarModule,
            MatSidenavModule,
            MatListModule,
            MatButtonModule,
            FlexLayoutModule,
            BrowserAnimationsModule,
            ReactiveFormsModule,
            FontAwesomeModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFireStorageModule,
            HttpClientModule,
            HttpModule,
        ],
        exports: [
            MatToolbarModule,
            MatCardModule,
            MatInputModule,
            MatFormFieldModule,
            MatButtonModule
        ],
        providers: [AngularFireStorage],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map