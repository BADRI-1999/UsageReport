import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-popups',
  standalone: true,
  imports: [],
  templateUrl: './popups.component.html',
  styleUrl: './popups.component.css'
})
export class PopupsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopupsComponent>,
    private apiService: ApiService
  ) {}




  closeDialog(): void {
    this.dialogRef.close();
  }

  getdownload (){
    // this.apiService.downloadTable(this.usageDetails);
  }
  



}
