import {Component, Input, EventEmitter, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog'

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  //Input() and Output() for component interation
  @Input() employee: Employee;
  @Output() editOperation: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() deleteOperation: EventEmitter<Object> = new EventEmitter<Object>();

  //Reports will store the employee objects
  reports: Employee[] = [];
  totalReports:number = 0;
  employeeService:EmployeeService;
  matDialog:MatDialog;

  constructor(employeeService:EmployeeService, public dialog:MatDialog) {
    this.employeeService = employeeService;
    this.matDialog = dialog;
  }

  ngOnInit(){
    this.getTotalReports();
  }

  //Function to get the total number of reports
  getTotalReports(){
    //Check if the employee has any direct reports
    if(this.employee.directReports){
      //Increment the number of total reports
      this.totalReports += this.employee.directReports.length;

      //Store the employees in the reports array and get the number of indirect reports
      this.employee.directReports.forEach((reportID)=>{
        this.employeeService.get(reportID).subscribe(emp =>{
          this.reports.push(emp);

          if(emp.directReports){
            this.totalReports += emp.directReports.length;
          }
       })
      })
    }
    this.employee.reports= this.reports;
  }
  //Function to emit the edited employee details
  editEmployee(id){
    //Get the id of the employee to edit
    this.employeeService.get(id).subscribe(employee => {
      //Open the dialog box
      let dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        data:{
          employee: employee,
          operation: 'edit'
        }
      })
      //Emit an event with the edited data
      dialogRef.afterClosed().subscribe(result => {
        this.editOperation.emit({
          op: 'edit',
          employee: result
        })
      });
    });
  }
  //Function to emit the deleted employee details
  deleteEmployee(id){
    //Get the id of the employee to delete
    this.employeeService.get(id).subscribe(employee=>{
      //Open the dialog box
      let dialogRef = this.dialog.open(DialogComponent,{
      width: '300px',
      data:{
        employee:employee,
        operation:'delete'
      }
      });
      //Emit an event with the deleted data
      dialogRef.afterClosed().subscribe(result => {
        this.deleteOperation.emit({
          op: 'delete',
          employee: result
       })
       //Update the number of reports
       this.totalReports = this.employee.reports.length;
      });
    });
  }
}
