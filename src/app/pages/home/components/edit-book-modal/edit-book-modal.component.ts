import { NgIf } from '@angular/common'
import { Component, Inject, signal, WritableSignal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { Book } from '../../../../shared/interfaces/book.interface'

@Component({
  selector: 'app-edit-book-modal',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-book-modal.component.html',
  styleUrl: './edit-book-modal.component.scss',
})
export class EditBookModalComponent {
  public bookForm: FormGroup
  public isEditing: WritableSignal<boolean> = signal(false)

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditBookModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book | null },
  ) {
    this.isEditing.set(!!data.book)

    this.bookForm = this.fb.group({
      title: [data.book?.title || '', [Validators.required]],
      author: [data.book?.author || '', [Validators.required]],
      year: [data.book?.year || new Date().getFullYear(), [Validators.required, Validators.min(1000)]],
      imageUrl: [data.book?.imageUrl || ''],
      description: [data.book?.description || ''],
    })
  }

  saveBook(): void {
    if (this.bookForm.valid) {
      const updatedBook: Book = {
        ...this.bookForm.value,
      }
      if (this.data.book?.id) {
        updatedBook.id = this.data.book.id
      }
      this.dialogRef.close(updatedBook as Book)
    }
  }

  deleteBook(): void {
    this.dialogRef.close('delete')
  }

  close(): void {
    this.dialogRef.close(null)
  }
}
