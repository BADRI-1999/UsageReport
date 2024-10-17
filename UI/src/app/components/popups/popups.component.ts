import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-popups',
  standalone: true,
  imports: [],
  templateUrl: './popups.component.html',
  styleUrl: './popups.component.css'
})
export class PopupsComponent {
  constructor(public dialogRef: MatDialogRef<PopupsComponent>,
    private apiService: ApiService
  ) {}




  closeDialog(): void {
    this.dialogRef.close();
  }

  getdownload (){
    // this.apiService.downloadTable(this.usageDetails);
  }
  



}
