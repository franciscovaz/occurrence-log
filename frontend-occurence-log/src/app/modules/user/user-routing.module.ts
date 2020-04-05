import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OccurenceRegistrationComponent} from './occurence-registration/occurence-registration.component'
import { OccurencesListComponent } from './occurences-list/occurences-list.component';
import { UserManagementComponent } from './user-management/user-management.component';


const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
