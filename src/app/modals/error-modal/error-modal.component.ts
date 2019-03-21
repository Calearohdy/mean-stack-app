import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
  message = 'An unknown error occured';

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string} ) { }

  ngOnInit() {
  }

}
