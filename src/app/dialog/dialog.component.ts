import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Employee } from '../employee';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent{
  employee: Employee;
  operation: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { operation: string, employee: Employee },
    public dialogRef: MatDialogRef<DialogComponent>) {
      this.employee = data.employee;
      this.operation = data.operation;
    }

  closeDialog() :void {
    this.dialogRef.close();
  }
}
