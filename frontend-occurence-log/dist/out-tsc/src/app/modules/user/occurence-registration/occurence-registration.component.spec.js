import { async, TestBed } from '@angular/core/testing';
import { OccurenceRegistrationComponent } from './occurence-registration.component';
describe('OccurenceRegistrationComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OccurenceRegistrationComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(OccurenceRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=occurence-registration.component.spec.js.map