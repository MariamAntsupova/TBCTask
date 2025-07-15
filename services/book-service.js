import { books } from '../mock-data/books.js';
import Book from '../models/book.js';
import UserService from './user-service.js';


class bookService {
    static findBookById(bookId) {
        const book = books.find((b) => b.id === bookId);
        if (!book) throw new Error("Book not found");
        return book;
    }
    static checkIfBookExistsByTitle(bookTitle) {
        return books.some((b) => b.title === bookTitle);
    }
    static addBook(title, author, genre, year) {
        const newBook = new Book(title, author, genre, year);
        books.push(newBook);
        return newBook;
    }
    static seeAllBooks() {
        return books;
    }
    static borrowBook(userName, bookId) {
        const user = UserService.findUserByUserName(userName);
        const book = bookService.findBookById(bookId);

        if (!book.isAvailable) {
            throw new Error("Book is already borrowed.");
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + 14);
        user.borrowedBooks.push({
            bookId: book.id,
            borrowDate: borrowDate.toISOString().split("T")[0],
            dueDate: dueDate.toISOString().split("T")[0],
        });
        book.isAvailable = false;
        book.borrowCount += 1;
    }
    static returnBook(userName, bookId) {
        const user = UserService.findUserByUserName(userName);

        const borrowedBookIndex = user.borrowedBooks.findIndex(
            (b) => b.bookId === bookId,
        );
        if (borrowedBookIndex === -1) {
            throw new Error("This user didn't borrow this book.");
        }

        const borrowedBook = user.borrowedBooks[borrowedBookIndex];

        const returnDate = new Date().toISOString().split("T")[0];
        const dueDate = borrowedBook.dueDate;
        let hasPenalty = returnDate > dueDate;
        if (hasPenalty) user.penaltyPoints += 1;

        const book = bookService.findBookById(bookId);
        book.isAvailable = true;

        user.borrowedBooks.splice(borrowedBookIndex, 1);
        return {hasPenalty: hasPenalty,user:user};
    }

    static searchBooksBy(param, value) {
        return books.filter((book) => {
            const bookValue = book[param];

            if (param === "author" || param === "genre") {
                return bookValue.toLowerCase().includes(value.toLowerCase());
            } else if (param === "rating") {
                return bookValue >= value;
            } else if (param === "year") {
                if (value.before !== undefined) {
                    return bookValue < value.before;
                }
                if (value.after !== undefined) {
                    return bookValue > value.after;
                }
                return bookValue === value;
            } else {
                return String(bookValue)
                    .toLowerCase()
                    .includes(String(value).toLowerCase());
            }
        });
    }
    
    static getTopRatedBooks(limit) {
        return books
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    static getMostPopularBooks(limit) {
        return books
            .slice()
            .sort((a, b) => b.borrowCount - a.borrowCount)
            .slice(0, limit);
    }
    static recommendBooks(userName) {
        const user = UserService.findUserByUserName(userName);

        const borrowedBookIds = user.borrowedBooks.map((book) => book.bookId);
        const borrowedGenres = books
            .filter((book) => borrowedBookIds.includes(book.id))
            .map((book) => book.genre);

        const recommendedBooks = books
            .filter(
                (book) =>
                    borrowedGenres.includes(book.genre) &&
                    !borrowedBookIds.includes(book.id),
            )
            .sort((a, b) => b.rating - a.rating);

        return recommendedBooks;
    }
    static removeBook(bookId) {
        const book = bookService.findBookById(bookId);
        if(!book.isAvailable){
            throw new Error("This book is borrowed and you can not delete it.");
        }
        const bookIndex = books.findIndex((b) => b.id === bookId);
        books.splice(bookIndex, 1);
    }
}

export default bookService;