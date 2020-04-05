import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OccurenceRegistrationComponent } from './occurence-registration/occurence-registration.component';
import { OccurencesListComponent } from './occurences-list/occurences-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
const routes = [
    {
        path: 'registo', component: OccurenceRegistrationComponent
    },
    {
        path: 'lista', component: OccurencesListComponent
    },
    {
        path: 'management', component: UserManagementComponent
    }
];
let UserRoutingModule = class UserRoutingModule {
};
UserRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], UserRoutingModule);
export { UserRoutingModule };
//# sourceMappingURL=user-routing.module.js.map