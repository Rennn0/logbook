import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoogleSigninService } from 'src/app/core/services/google-auth/google-signin.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  @Output() signIn: EventEmitter<void> = new EventEmitter<void>();
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();

  constructor(public googleSigninService: GoogleSigninService) { }

  ngOnInit(): void { }

  signIn_(): void {
    this.signIn.emit();
  }

  signOut_(): void {
    this.signOut.emit();
  }
}
