import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  //
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter();

  //
  @Output() modalSucceedEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  //
  closeModal(): void {
    console.log('close');
    this.closeModalEvent.emit();
  }

  //
  emitEvent(): void {
    console.log('-***************************** emit event from modal');
    this.modalSucceedEvent.emit();
  }
}
