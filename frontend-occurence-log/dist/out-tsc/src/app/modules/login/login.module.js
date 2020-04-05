import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule, MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
let LoginModule = class LoginModule {
};
LoginModule = tslib_1.__decorate([
    NgModule({
        declarations: [LoginComponent],
        imports: [
            CommonModule,
            LoginRoutingModule,
            ReactiveFormsModule,
            MatToolbarModule,
            MatCardModule,
            MatInputModule,
            MatFormFieldModule,
            MatButtonModule,
            FontAwesomeModule
        ]
    })
], LoginModule);
export { LoginModule };
//# sourceMappingURL=login.module.js.map