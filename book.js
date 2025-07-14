class Book {
    static nextId = 11;

    constructor(title, author, genre, year) {
        this.id = Book.nextId++;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.isAvailable = true;
        this.rating = 0;
        this.borrowCount = 0;
    }
}

export default Book;