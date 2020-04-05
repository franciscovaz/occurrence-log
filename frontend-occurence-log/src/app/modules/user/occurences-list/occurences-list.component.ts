import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ApiRequestsService } from 'src/app/shared/api-requests.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FilterPipe } from './filter.pipe';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface DialogData {
  imgUrl: string;
}

@Component({
  selector: 'app-occurences-list',
  templateUrl: './occurences-list.component.html',
  styleUrls: ['./occurences-list.component.scss'],
  providers: [FilterPipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OccurencesListComponent implements OnInit {

  displayedColumns;
  isResponsable = sessionStorage.getItem('tipo_utilizador');

  dataSource;
  ocorrencias;
  ocorrenciasFiltradas:any = [];
  haveOccurences;
  noOccurrences;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private restService: ApiRequestsService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService){
  }

  ngOnInit() {

    if(this.isResponsable === '2' || this.isResponsable === '3'){ // Admin
      this.displayedColumns = ['id_ocorrencia', 'nome_utilizador', 'titulo_ocorrencia', 'data_ocorrencia', 'descricao_estado', 'actions'];

      this.ocorrencias = this.restService.getOcorrencias().subscribe(resp => {
        if(resp === []){
          // nao ha ocorrencias
          this.noOccurrences = true;
        }else {
          this.noOccurrences = false;
          this.dataSource = new MatTableDataSource(resp as {id_ocorrencia: number, nome_utilizador: string, titulo_ocorrencia: string, descricao_ocorrencia: string, data_ocorrencia: string, url_fotografia: string, descricao_estado: string, actions: any}[]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(Object.keys(resp).length === 0){
            this.haveOccurences = false;
          }else{
            this.ocorrenciasFiltradas = resp;
            this.haveOccurences = true;
          }
        }
      },
      error =>{
        this.toastr.error('Sessão expirada!');
        this.router.navigate(['/']);
      }
      );


    }else {
      this.displayedColumns = ['id_ocorrencia', 'nome_utilizador', 'titulo_ocorrencia', 'data_ocorrencia', 'descricao_estado'];

      this.ocorrencias = this.restService.getOcorrenciaByUser(sessionStorage.getItem('id_utilizador')).subscribe(resp => {
        if(resp === []){
          // nao ha ocorrencias
          this.noOccurrences = true;
        }else {
          this.noOccurrences = false;
          this.dataSource = new MatTableDataSource(resp as {id_ocorrencia: number, nome_utilizador: string, titulo_ocorrencia: string, descricao_ocorrencia: string, data_ocorrencia: string, url_fotografia: string, descricao_estado: string, actions: any}[]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(Object.keys(resp).length === 0){
            this.haveOccurences = false;
          }else{
            this.ocorrenciasFiltradas = resp;
            this.haveOccurences = true;
          }
        }
      },
      error =>{
        this.toastr.error('Sessão expirada!');
        this.router.navigate(['/']);
      }
      );
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openDialog(img){
    const dialogRef = this.dialog.open(DialogOccurencePhoto, {
      width: '550px',
      data: {imgUrl: img}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Fechei a foto!');
    });
  }


  selectPost(post) {
  }

  onSelectStatus(estado){
    this.ocorrencias = this.restService.getOcorrenciasByState(estado, sessionStorage.getItem('id_utilizador')).subscribe(resp => {
      if(Object.keys(resp).length === 0){
        this.haveOccurences = false;
      }else{
        this.ocorrenciasFiltradas = resp;
        this.haveOccurences = true;
      }
    },
    error => {
      this.toastr.error('','Sessão expirada!');
      this.router.navigate(['/']);
    }
    );
  }




  editarEstado(evento){

    const dialogRef = this.dialog.open(DialogEditOccurence, {
      width: '550px',
      data: {
        estado_atual: evento.descricao_estado,
        comentario: '',
        id: evento.id_ocorrencia
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      result = evento;
    });
  }


}

@Component({
  selector: 'dialog-occurence-photo',
  templateUrl: '../../../shared/dialogs/showFotoDialog.html',
})
export class DialogOccurencePhoto {
  constructor(
    public dialogRef: MatDialogRef<DialogOccurencePhoto>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onCloseClick() {
      this.dialogRef.close();
    }

}


@Component({
  selector: 'dialog-edit-occurence',
  templateUrl: '../../../shared/dialogs/editOccurrence.html',
})
export class DialogEditOccurence {
  constructor(
    public dialogRef: MatDialogRef<DialogEditOccurence>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private restApi: ApiRequestsService,
    private toastr: ToastrService,
    private router: Router) {}

    estadoAReceber;

    onCloseClick(textarea_value, id) {

      this.restApi.updateOcorrencia(id, textarea_value, this.estadoAReceber).subscribe( response => {
        //console.log('Resposta: ', response);

        this.sendEmail(this.estadoAReceber, textarea_value);

        this.toastr.success('', 'Atualizado com sucesso!');

      },
      error => {
        this.toastr.error('', 'Não foi possível atualizar o estado da ocorrência!');
      }
      )
      this.dialogRef.close();
      window.location.reload();

    }

    onSelectStatus(valor){
      this.estadoAReceber = valor;
    }


    sendEmail(estado_escolhido, comentario){
      let ocorrencia = {
        name: sessionStorage.getItem('nome_utilizador'),
        email: 'ftomasvaz@gmail.com',
        estado: estado_escolhido,
        comentario: comentario
      }

      this.restApi.sendEmailUpdate(ocorrencia).subscribe(
        data => {
          let res:any = data;
          console.log(`${ocorrencia.name} enviou um email!`);
        },
        err => {
          console.log(err);
        },() => {
        }
      );
    }
}


