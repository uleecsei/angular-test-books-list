import { Component, Inject } from '@angular/core'
import { MatButton } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'

@Component({
  selector: 'app-confirm-removal-modal',
  standalone: true,
  templateUrl: './confirm-removal-modal.component.html',
  imports: [MatDialogActions, MatButton, MatDialogContent, MatDialogTitle],
})
export class ConfirmRemovalModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmRemovalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
  ) {}

  onCancel(): void {
    this.dialogRef.close(false)
  }

  onConfirm(): void {
    this.dialogRef.close(true)
  }
}
