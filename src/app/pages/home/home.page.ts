import { animate, style, transition, trigger } from '@angular/animations'
import { NgFor } from '@angular/common'
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'

import { ConfirmRemovalModalComponent } from '../../shared/components/confirm-removal-modal/confirm-removal-modal.component'
import { noImageUrl } from '../../shared/constans/no-image-url'
import { Book } from '../../shared/interfaces/book.interface'
import { BooksService } from '../../shared/services/books.service'

import { BookCardComponent } from './components/book-card/book-card.component'
import { EditBookModalComponent } from './components/edit-book-modal/edit-book-modal.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, BookCardComponent, MatButton, MatFormField, FormsModule, MatInput, MatLabel],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms 0s', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms 0s', style({ opacity: 0 }))]),
    ]),
  ],
})
export default class HomePage implements OnInit {
  private destroyRef$: DestroyRef = inject(DestroyRef)
  private dialog: MatDialog = inject(MatDialog)
  private readonly booksService: BooksService = inject(BooksService)

  public books: WritableSignal<Book[]> = signal<Book[]>([])
  public filteredBooks: WritableSignal<Book[]> = signal<Book[]>([])
  public searchQuery = ''

  get isLeftAligned(): boolean {
    return this.filteredBooks().length <= 3
  }

  ngOnInit(): void {
    this.booksService
      .getBooks()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((books) => {
        this.books.set(books)
        this.filteredBooks.set(books)
      })
  }

  filterBooks(): void {
    const query = this.searchQuery.toLowerCase()
    this.filteredBooks.set(
      this.books().filter(
        (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
      ),
    )
  }

  addBook(): void {
    const dialogRef = this.dialog.open(EditBookModalComponent, {
      width: '400px',
      data: { book: null },
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((result: Book | null) => {
        if (result) {
          const newBook: Book = { ...result, imageUrl: result.imageUrl || noImageUrl }
          this.booksService.addBook(newBook)
        }
      })
  }

  editBook(book: Book): void {
    const dialogRef = this.dialog.open(EditBookModalComponent, {
      width: '400px',
      data: { book },
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((result: Book | 'delete' | null) => {
        if (result === 'delete') {
          this.removeBook(book)
        } else if (result) {
          const updatedBook: Book = { ...result, imageUrl: result.imageUrl || noImageUrl }
          this.booksService.updateBook(updatedBook)
        }
      })
  }

  removeBook(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmRemovalModalComponent, {
      width: '300px',
      data: { title: book.title },
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.booksService.removeBook(book.id)
        }
      })
  }
}
