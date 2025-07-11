import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { NutritionComponent } from './nutrition/nutrition.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
  { path: 'chat', component: NutritionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }