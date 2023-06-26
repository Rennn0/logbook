import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe-pipe.pipe';

const component = [SafePipe];

@NgModule({
  declarations: [component],
  imports: [CommonModule],
  exports: [component],
})
export class PipeModule {}
