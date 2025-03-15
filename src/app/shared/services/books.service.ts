import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { Book } from '../interfaces/book.interface'

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private booksSubject = new BehaviorSubject<Book[]>([
    {
      id: 1,
      title: 'Кобзар',
      author: 'Тарас Шевченко',
      year: 1840,
      imageUrl:
        'https://vivat.com.ua/resize_3840x3840x80/storage/1.d/import/media/2/4215c4f4321b28193de00e189028fd42.webp',
      description: 'Збірка поезій великого українського поета Тараса Шевченка.',
    },
    {
      id: 2,
      title: 'Тигролови',
      author: 'Іван Багряний',
      year: 1944,
      imageUrl: 'https://readeat.com/storage/app/uploads/public/66f/fd1/f4a/thumb_116503_900_900_0_0_auto.jpg',
      description: 'Роман про боротьбу українських патріотів у часи нацистської окупації.',
    },
    { id: 3, title: 'Захар Беркут', author: 'Іван Франко', year: 1883 },
    { id: 4, title: 'Місто', author: 'Валер’ян Підмогильний', year: 1928 },
    { id: 5, title: 'Собор', author: 'Олесь Гончар', year: 1968 },
  ])

  getBooks() {
    return this.booksSubject.asObservable()
  }

  addBook(book: Omit<Book, 'id'>): void {
    const currentBooks = this.booksSubject.getValue()
    const newBook: Book = { ...book, id: this.generateUniqueId(currentBooks) }
    this.booksSubject.next([...currentBooks, newBook])
  }

  removeBook(id: number): void {
    const currentBooks = this.booksSubject.getValue()
    const updatedBooks = currentBooks.filter((book) => book.id !== id)
    this.booksSubject.next(updatedBooks)
  }

  updateBook(updatedBook: Book): void {
    const currentBooks = this.booksSubject.getValue()
    const updatedBooks = currentBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    this.booksSubject.next(updatedBooks)
  }

  private generateUniqueId(books: Book[]): number {
    return books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1
  }
}
