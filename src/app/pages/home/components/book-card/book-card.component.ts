import { NgIf } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'

import { noImageUrl } from '../../../../shared/constans/no-image-url'
import { Book } from '../../../../shared/interfaces/book.interface'

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, NgIf],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  protected readonly noImageUrl: string = noImageUrl
  @Input() book: Book | undefined
  @Output() editBook = new EventEmitter<Book>()
  @Output() removeBook = new EventEmitter<Book>()
}
