import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { Router } from '@angular/router';
import { ApiRequestsService } from 'src/app/shared/api-requests.service';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-occurence-registration',
  templateUrl: './occurence-registration.component.html',
  styleUrls: ['./occurence-registration.component.scss']
})

export class OccurenceRegistrationComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  people: any = [];
  imgSrc: string = '/assets/img/select-image.png';
  showPreviewDiv = false;
  selectedImage: any = null;
  panelOpenState = false;

  latitude = 40.6442700;
  longitude = -8.6455400;
  zoom = 11;
  address: string;
  private geoCoder: any;
  nome;
  email;
  contacto;
  id_utilizador;
  rua_ocorrencia = '';

  idFoto;
  urlFotografiaEscolhida;


  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private storage: AngularFireStorage,
    private router: Router,
    private restApi: ApiRequestsService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.setCurrentLocation();
    this.registerForm = this.formBuilder.group({
      occurenceTitle: ['', Validators.required],
      occurenceDescription: ['', Validators.required],
      imageUploader: [''],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required]
    });

    this.restApi.getInformacaoPessoal(sessionStorage.getItem('id_utilizador')).subscribe(
      response => {
      // console.log('Informação Pessoal: ', response);
      this.nome = response[0].nome_utilizador;
      this.email = response[0].email_utilizador;
      this.contacto = response[0].telemovel_utilizador;
      this.id_utilizador = response[0].id_utilizador;
      this.registerForm.setValue({occurenceTitle: '', occurenceDescription: '', imageUploader:'', name: this.nome, email: this.email, phone_number: this.contacto});
      },
      error => {
        this.toastr.error('', error.error.message);
        this.router.navigate(['/']);
      }
   );


    //load Places AutoComplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify Result
          if(place.geometry === undefined || place.geometry === null ){
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 18;
        });
      });
    });
  }

  get f() { return this.registerForm.controls; }

  onChooseLocation(evento){
    this.latitude = evento.coords.lat;
    this.longitude = evento.coords.lng;
  }

  // GET Current Location Coordinates
  private setCurrentLocation(){
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  markerDragEnd(event) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': {lat: latitude, lng: longitude } }, (results, status) => {
      this.rua_ocorrencia = results[0].formatted_address;
      if( status === 'OK' ) {
        if( results[0] ) {
          this.zoom = 18;
          this.address = results[0].formatted_address;
        }else {
          this.toastr.error('', 'Sem resultados de morada!');
        }
      }else {
        this.toastr.error('', 'Geocoder falhou devido a: ' + status);
      }
    });
  }

showPreview(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      this.showPreviewDiv = true;
      //para fazer o trigger do onload
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      
      
    }else{
      this.imgSrc = '/assets/img/select-image.png';
      this.selectedImage = null;
      this.showPreviewDiv = false;
    }
  }


  onSubmit(formValue){
    this.submitted = true;
      if(this.registerForm.valid){
      //upload image to firebase cloud storage
      var filePath = `imagens/${this.selectedImage.name}_${moment(new Date()).format('DD-MM-YYYY hh:ss')}`;
      //inject firebase class
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          //retrieve the url of image
          fileRef.getDownloadURL().subscribe((url)=>{
            formValue['imageUploader']=url;
            this.urlFotografiaEscolhida = url;
        
            // POST Fotografia

            this.restApi.addFotografia(this.urlFotografiaEscolhida).subscribe( idFotografia => {
              this.idFoto = idFotografia;

            // POST Ocorrencia
            this.restApi.addOcorrencia(formValue.occurenceTitle, formValue.occurenceDescription, moment(new Date).format('DD-MM-YYYY HH:mm'), this.latitude, this.longitude, this.rua_ocorrencia, this.idFoto, this.id_utilizador).subscribe( respOcorrencia => {

            this.toastr.success('', 'Ocorrência inserida com sucesso!'); 
            this.router.navigate(['op/lista']);  

            // Enviar email
            this.sendEmail(formValue.occurenceTitle, formValue.occurenceDescription, moment(new Date).format('DD-MM-YYYY HH:mm'), this.latitude, this.longitude, this.rua_ocorrencia);
            
            },error => {
              this.toastr.error('', 'Não foi possível registar a ocorrência!');
            })
            });
          })
        })
      ).subscribe();  
    }else{
      return;
    } 
  }

  resetForm(){
    this.registerForm.reset();
    this.registerForm.setValue({
      occurenceTitle: '',
      occurenceDescription: '',
      imageUploader: ''
    });
    this.imgSrc = '/assets/img/select-image.png';
    this.selectedImage = null;
    this.submitted = false;
  }


  sendEmail(title, descricao, data, lat, long, rua){
    let ocorrencia = {
      name: sessionStorage.getItem('nome_utilizador'),
      email: 'ftomasvaz@gmail.com',
      titulo: title,
      descricao: descricao, 
      data: data,
      latitude: lat,
      longitude: long,
      rua: rua
    }

    this.restApi.sendEmail(ocorrencia).subscribe(
      data => {
        let res:any = data;
        console.log(`${ocorrencia.name} enviou um email!`);
      },
      err => {
        this.toastr.error('','Erro ao enviar email!');
      },() => {
      }
    );
  }

}
