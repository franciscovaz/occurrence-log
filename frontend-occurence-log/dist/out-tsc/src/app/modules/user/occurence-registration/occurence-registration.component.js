import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { finalize } from "rxjs/operators";
import * as moment from 'moment';
let OccurenceRegistrationComponent = class OccurenceRegistrationComponent {
    constructor(formBuilder, mapsAPILoader, ngZone, storage, router, restApi) {
        this.formBuilder = formBuilder;
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.storage = storage;
        this.router = router;
        this.restApi = restApi;
        this.submitted = false;
        this.people = [];
        this.imgSrc = '/assets/img/select-image.png';
        this.showPreviewDiv = false;
        this.selectedImage = null;
        this.panelOpenState = false;
        this.latitude = 40.6442700;
        this.longitude = -8.6455400;
        this.zoom = 11;
        this.rua_ocorrencia = '';
    }
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
        // TODO pass ID from session storage 
        this.restApi.getInformacaoPessoal(3).subscribe(response => {
            console.log('Informação Pessoal: ', response);
            this.nome = response[0].nome_utilizador;
            this.email = response[0].email_utilizador;
            this.contacto = response[0].telemovel_utilizador;
            this.id_utilizador = response[0].id_utilizador;
            console.log('Nome: ', this.nome);
            console.log('Email: ', this.email);
            console.log('Telemovel: ', this.contacto);
            this.registerForm.setValue({ occurenceTitle: '', occurenceDescription: '', imageUploader: '', name: this.nome, email: this.email, phone_number: this.contacto });
        });
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
                    let place = autocomplete.getPlace();
                    //verify Result
                    if (place.geometry === undefined || place.geometry === null) {
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
    onChooseLocation(evento) {
        console.log('Evento mapa: ', evento);
        this.latitude = evento.coords.lat;
        this.longitude = evento.coords.lng;
    }
    // GET Current Location Coordinates
    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Localização: ', position);
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 15;
            });
        }
    }
    markerDragEnd(event) {
        console.log("marker drag event: ", event);
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }
    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log('Resultados getAddress: ', results);
            this.rua_ocorrencia = results[0].formatted_address;
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 18;
                    this.address = results[0].formatted_address;
                }
                else {
                    window.alert('Sem Resultados');
                }
            }
            else {
                window.alert('Geocoder falhou devido a: ' + status);
            }
        });
    }
    showPreview(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => this.imgSrc = e.target.result;
            this.showPreviewDiv = true;
            //para fazer o trigger do onload
            reader.readAsDataURL(event.target.files[0]);
            this.selectedImage = event.target.files[0];
        }
        else {
            this.imgSrc = '/assets/img/select-image.png';
            this.selectedImage = null;
            this.showPreviewDiv = false;
        }
    }
    onSubmit(formValue) {
        this.submitted = true;
        console.log('Latitude: ', this.latitude);
        console.log('Longitude: ', this.longitude);
        console.log('Rua ocorrencia: ', this.rua_ocorrencia);
        if (this.registerForm.valid) {
            //upload image to firebase cloud storage
            var filePath = `imagens/${this.selectedImage.name}_${new Date().getTime()}`;
            //inject firebase class
            const fileRef = this.storage.ref(filePath);
            this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(finalize(() => {
                //retrieve the url of image
                fileRef.getDownloadURL().subscribe((url) => {
                    formValue['imageUploader'] = url;
                    this.urlFotografiaEscolhida = url;
                    // POST Fotografia
                    this.restApi.addFotografia(this.urlFotografiaEscolhida).subscribe(idFotografia => {
                        this.idFoto = idFotografia;
                        console.log('Fotografia inserida com o ID: ', this.idFoto);
                        // POST Ocorrencia
                        this.restApi.addOcorrencia(formValue.occurenceTitle, formValue.occurenceDescription, moment(new Date).format('DD-MM-YYYY HH:mm'), this.latitude, this.longitude, this.rua_ocorrencia, this.idFoto, this.id_utilizador).subscribe(respOcorrencia => {
                            console.log('Adicionou-se? ', respOcorrencia);
                            this.router.navigate(['op/lista']);
                        });
                    });
                });
            })).subscribe();
        }
        else {
            return;
        }
        alert('sucesso!');
    }
    resetForm() {
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
};
tslib_1.__decorate([
    ViewChild('search', { static: false })
], OccurenceRegistrationComponent.prototype, "searchElementRef", void 0);
OccurenceRegistrationComponent = tslib_1.__decorate([
    Component({
        selector: 'app-occurence-registration',
        templateUrl: './occurence-registration.component.html',
        styleUrls: ['./occurence-registration.component.scss']
    })
], OccurenceRegistrationComponent);
export { OccurenceRegistrationComponent };
//# sourceMappingURL=occurence-registration.component.js.map