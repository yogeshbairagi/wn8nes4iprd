import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

// Import the Http Module and our Data Service
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AdddashboardComponent } from './adddashboard/adddashboard.component';
import { ApprovedashboardComponent } from './approvedashboard/approvedashboard.component';
import { AdduserComponent } from './adduser/adduser.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';
import { UpdatedashboardComponent } from './updatedashboard/updatedashboard.component';
import { AddcategoryComponent } from './addcategory/addcategory.component';
import { AddlinksComponent } from './addlinks/addlinks.component';
import { UpdatelinksComponent } from './updatelinks/updatelinks.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddtrainingComponent } from './addtraining/addtraining.component';
import { AddMaterialComponent } from './add-material/add-material.component';
import { UserComponent } from './user/user.component';
import { DeletecategoryComponent } from './deletecategory/deletecategory.component';
import { ApprovelinksComponent } from './approvelinks/approvelinks.component';
import { ApprovetrainingComponent } from './approvetraining/approvetraining.component';
import { ApprovematerialComponent } from './approvematerial/approvematerial.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminComponent,
    children: [
      {
        path: 'approvedashboard',
        component: ApprovedashboardComponent
      },
      {
        path: 'adddashboard',
        component: AdddashboardComponent
      },
      {
        path: 'updatedashboard',
        component: UpdatedashboardComponent
      },
      {
        path: 'adduser',
        component: AdduserComponent
      },
      {
        path: 'updateuser',
        component: UpdateuserComponent
      },
      {
        path: 'addcategory',
        component: AddcategoryComponent
      },
      {
        path: 'deletecategory',
        component: DeletecategoryComponent
      },
      {
        path: 'addlinks',
        component: AddlinksComponent
      },
      {
        path: 'updatelinks',
        component: UpdatelinksComponent
      },
      {
        path: 'approvelinks',
        component: ApprovelinksComponent
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      },
      {
        path: 'addtraining',
        component: AddtrainingComponent
      },
      {
        path: 'addmaterial',
        component: AddMaterialComponent
      },
      {
        path: 'approvetraining',
        component: ApprovetrainingComponent
      },
      {
        path: 'approvematerial',
        component: ApprovematerialComponent
      }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: UserComponent,
    children: [
      {
        path: 'adddashboard',
        component: AdddashboardComponent
      },
      {
        path: 'addlinks',
        component: AddlinksComponent
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      },
      {
        path: 'addtraining',
        component: AddtrainingComponent
      },
      {
        path: 'addmaterial',
        component: AddMaterialComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    AdminComponent,
    AdddashboardComponent,
    ApprovedashboardComponent,
    AdduserComponent,
    UpdateuserComponent,
    UpdatedashboardComponent,
    AddcategoryComponent,
    AddlinksComponent,
    UpdatelinksComponent,
    ChangePasswordComponent,
    AddtrainingComponent,
    AddMaterialComponent,
    UserComponent,
    DeletecategoryComponent,
    ApprovelinksComponent,
    ApprovetrainingComponent,
    ApprovematerialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DataService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
