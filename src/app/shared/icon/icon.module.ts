import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconCloseComponent } from './icon-close/icon-close.component';
import { IconSignoutComponent } from './icon-signout/icon-signout.component';

const components = [IconCloseComponent, IconSignoutComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule],
  exports: [components],
})
export class IconModule { }
