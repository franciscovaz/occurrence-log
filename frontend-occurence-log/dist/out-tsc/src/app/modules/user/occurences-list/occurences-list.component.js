import * as tslib_1 from "tslib";
import { Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterPipe } from './filter.pipe';
let OccurencesListComponent = class OccurencesListComponent {
    constructor(restService, dialog) {
        this.restService = restService;
        this.dialog = dialog;
        this.displayedColumns = ['id_ocorrencia', 'nome_utilizador', 'titulo_ocorrencia', 'data_ocorrencia', 'descricao_estado'];
        this.ocorrenciasFiltradas = [];
    }
    ngOnInit() {
        this.ocorrencias = this.restService.getOcorrencias().subscribe(resp => {
            console.log('Ocorrencias: ', resp);
            this.dataSource = new MatTableDataSource(resp);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            if (Object.keys(resp).length === 0) {
                console.log('Não ha ocorrencias');
                this.haveOccurences = false;
            }
            else {
                console.log('Aqui 1: ', this.ocorrenciasFiltradas);
                this.ocorrenciasFiltradas = resp;
                this.haveOccurences = true;
            }
        });
    }
    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    openDialog(img) {
        console.log('Imagem: ', img);
        const dialogRef = this.dialog.open(DialogOccurencePhoto, {
            width: '550px',
            data: { imgUrl: img }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('Fechei a foto!');
        });
    }
    selectPost(post) {
        console.log(`The selected post is:  ${post.title}`);
    }
    onSelectStatus(estado) {
        this.ocorrencias = this.restService.getOcorrenciasByState(estado).subscribe(resp => {
            console.log('Resposta: ');
            if (Object.keys(resp).length === 0) {
                console.log('Não ha ocorrencias2');
                this.haveOccurences = false;
            }
            else {
                this.ocorrenciasFiltradas = resp;
                this.haveOccurences = true;
            }
            console.log('Ocorrencias Filtradas: ', resp);
        });
    }
};
tslib_1.__decorate([
    ViewChild(MatPaginator, { static: true })
], OccurencesListComponent.prototype, "paginator", void 0);
tslib_1.__decorate([
    ViewChild(MatSort, { static: true })
], OccurencesListComponent.prototype, "sort", void 0);
OccurencesListComponent = tslib_1.__decorate([
    Component({
        selector: 'app-occurences-list',
        templateUrl: './occurences-list.component.html',
        styleUrls: ['./occurences-list.component.scss'],
        providers: [FilterPipe],
        animations: [
            trigger('detailExpand', [
                state('collapsed', style({ height: '0px', minHeight: '0' })),
                state('expanded', style({ height: '*' })),
                transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ],
    })
], OccurencesListComponent);
export { OccurencesListComponent };
let DialogOccurencePhoto = class DialogOccurencePhoto {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    onCloseClick() {
        this.dialogRef.close();
    }
};
DialogOccurencePhoto = tslib_1.__decorate([
    Component({
        selector: 'dialog-occurence-photo',
        templateUrl: '../../../shared/dialogs/showFotoDialog.html',
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA))
], DialogOccurencePhoto);
export { DialogOccurencePhoto };
//# sourceMappingURL=occurences-list.component.js.map