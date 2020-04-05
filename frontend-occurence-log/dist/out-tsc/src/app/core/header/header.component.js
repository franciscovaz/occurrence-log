import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
let HeaderComponent = class HeaderComponent {
    constructor() {
        this.navbarOpen = false;
        this.faUser = faUser;
    }
    ngOnInit() {
    }
    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }
};
HeaderComponent = tslib_1.__decorate([
    Component({
        selector: 'app-header',
        templateUrl: './header.component.html',
        styleUrls: ['./header.component.scss']
    })
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map