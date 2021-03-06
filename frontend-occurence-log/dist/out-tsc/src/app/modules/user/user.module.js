import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { OccurencesListComponent, DialogOccurencePhoto } from './occurences-list/occurences-list.component';
import { OccurenceRegistrationComponent } from './occurence-registration/occurence-registration.component';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterPipe } from './occurences-list/filter.pipe';
import { UserManagementComponent } from './user-management/user-management.component';
let UserModule = class UserModule {
};
UserModule = tslib_1.__decorate([
    NgModule({
        declarations: [OccurencesListComponent, OccurenceRegistrationComponent, DialogOccurencePhoto, FilterPipe, UserManagementComponent],
        imports: [
            CommonModule,
            UserRoutingModule,
            MatCardModule,
            ReactiveFormsModule,
            AgmCoreModule.forRoot({
                apiKey: 'AIzaSyDlCN2eIb0nLR7Ayq3vv9Dr34QKkiMObsc',
                libraries: ['geometry', 'places']
            }),
            MatTableModule,
            MatPaginatorModule,
            MatSortModule,
            MatFormFieldModule,
            MatInputModule,
            MatExpansionModule,
            MatDialogModule,
            MatButtonModule,
            MatToolbarModule,
            FormsModule,
            MatSelectModule
        ],
        entryComponents: [
            DialogOccurencePhoto
        ]
    })
], UserModule);
export { UserModule };
//# sourceMappingURL=user.module.js.map