import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
const routes = [
    {
        path: '', component: LoginComponent
    },
];
let LoginRoutingModule = class LoginRoutingModule {
};
LoginRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], LoginRoutingModule);
export { LoginRoutingModule };
//# sourceMappingURL=login-routing.module.js.map