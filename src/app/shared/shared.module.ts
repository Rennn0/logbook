import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PipeModule } from '../core/pipes/pipe.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './components/auth/auth.component';
import { ModalComponent } from './components/modal/modal.component';
import { IconModule } from './icon/icon.module';
import { SessionWindowComponent } from './components/session-window/session-window.component';
import { MessageBoxComponent } from './components/message-box/message-box.component';

import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';
import { StatisticsComponent } from './components/statistics/statistics.component';
import {
  PlanCourseComponent,
  FilterBoatsPipe,
} from './components/plan-course/plan-course.component';

const components = [
  HeaderComponent,
  AuthComponent,
  ModalComponent,
  SessionWindowComponent,
  MessageBoxComponent,
  StatisticsComponent,
  PlanCourseComponent,
  FilterBoatsPipe,
];

const modules = [
  FormsModule,
  IconModule,
  RouterModule,
  PipeModule,
  ReactiveFormsModule,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
];

@NgModule({
  declarations: [components],
  providers: [{ provide: OWL_DATE_TIME_LOCALE, useValue: 'de' }],
  imports: [CommonModule, modules],
  exports: [components, modules],
})
export class SharedModule {}
