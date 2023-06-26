import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../core/pipes/pipe.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';


@NgModule({
  declarations: [HomeComponent, SigninComponent],
  imports: [CommonModule, PipeModule, SharedModule],
})
export class PageModule { }
