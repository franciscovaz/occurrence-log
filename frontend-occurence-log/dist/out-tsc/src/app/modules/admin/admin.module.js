import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { OccurrencesComponent } from './occurrences/occurrences.component';
let AdminModule = class AdminModule {
};
AdminModule = tslib_1.__decorate([
    NgModule({
        declarations: [OccurrencesComponent],
        imports: [
            CommonModule,
            AdminRoutingModule
        ]
    })
], AdminModule);
export { AdminModule };
//# sourceMappingURL=admin.module.js.map