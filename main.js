import readline from 'readline';
import userService from './services/user-service.js';
import bookService from './services/book-service.js';
import Book from './models/book.js';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function main() {
    showMenu();
    rl.question("👉 Enter your choice: ", (choice) => {
        switch (choice.trim()) {
            case "1":
                const users = userService.seeAllUsers();
                for (const user of users) {
                    console.log(
                        `👤 User: ${user.userName} - Penalty Points: ${user.penaltyPoints} - BorrowedBooks: ${user.borrowedBooks.length}`,
                    );
                }
                main();
                break;
            case "2":
                rl.question("👤 Enter user name: ", (name) => {
                    try {
                        if (!name.trim())
                            throw new Error("⚠️  User name cannot be empty.");
                        userService.createUser(name.trim());
                        console.log("✅ User created successfully!\n");
                    } catch (err) {
                        console.error(`❌ ${err.message}\n`);
                    }
                    main();
                });
                break;
            case "3":
                rl.question(
                    "👤 Enter user name to view summary: ",
                    (userName) => {
                        try {
                            if (!userName.trim())
                                throw new Error(
                                    "⚠️  User name cannot be empty.",
                                );

                            const user = userService.findUserByUserName(
                                userName.trim(),
                            );
                            console.log(`\n📄 User Summary:`);
                            console.log(`👤 User: ${user.userName}`);
                            console.log(
                                `⚠️  Penalty Points: ${user.penaltyPoints}\n`,
                            );
                        } catch (err) {
                            console.error(`❌ ${err.message}\n`);
                        }
                        main();
                    },
                );
                break;
            case "4":
                const books = bookService.seeAllBooks();
                for (const book of books) {
                    console.log(
                        `📘 Book: ${book.title} - Author: ${book.author} - Genre: ${book.genre} - Year Published: ${book.year} - Rating: ${book.rating} - Available: ${book.isAvailable} - Borrow Count: ${book.borrowCount}`);
                }
                main();
                break;
            case "5":
                rl.question("📘 Enter book title: ", (title) => {
                    rl.question("✍️ Enter book author: ", (author) => {
                        rl.question("📚 Enter book genre: ", (genre) => {
                            rl.question("📅 Enter book year: ", (yearInput) => {
                                try {
                                    const year = Number(yearInput.trim());

                                    if (!title.trim() || !author.trim() || !genre.trim()) {
                                        throw new Error("⚠️  All fields are required.");
                                    }
                                    if (isNaN(year)) {
                                        throw new Error("🚫 Year must be a number.");
                                    }

                                    if (bookService.checkIfBookExistsByTitle(title.trim())) {
                                        throw new Error("⚠️  Book with this title already exists.");
                                    }

                                    bookService.addBook(
                                        title.trim(),
                                        author.trim(),
                                        genre.trim(),
                                        year
                                    );

                                    console.log("✅ Book added successfully!\n");
                                } catch (err) {
                                    console.error(`❌ ${err.message}\n`);
                                }

                                main();
                            });
                        });
                    });
                });
                break;

            case "6":
                rl.question(
                    "👤 Enter user name to borrow book: ",
                    (userName) => {
                        rl.question("🔢 Enter book ID: ", (bookId) => {
                            try {
                                const id = Number(bookId);
                                if (!userName.trim())
                                    throw new Error(
                                        "⚠️  User name cannot be empty.",
                                    );
                                if (isNaN(id))
                                    throw new Error(
                                        "🚫 Book ID must be a number.",
                                    );

                                bookService.borrowBook(userName.trim(), id);
                                console.log("✅ Book borrowed successfully!\n");
                            } catch (err) {
                                console.error(`❌ ${err.message}\n`);
                            }
                            main();
                        });
                    },
                );
                break;
            case "7":
                rl.question("👤 Enter user name to return book: ", (userName) => {
                    rl.question("🔢 Enter book ID: ", (bookId) => {
                        try {
                            const id = Number(bookId);
                            if (!userName.trim())
                                throw new Error("⚠️  User name cannot be empty.");
                            if (isNaN(id))
                                throw new Error("🚫 Book ID must be a number.");

                            const result = bookService.returnBook(userName.trim(), id);
                            console.log(`✅ Book returned successfully!`);
                            console.log(`👤 User: ${result.user.userName}`);
                            console.log(`⚠️ Penalty Points: ${result.user.penaltyPoints}`);

                            if (result.hasPenalty) {
                                console.log("⏰ Returned late, penalty applied!");
                            }

                            console.log(""); 
                        } catch (err) {
                            console.error(`❌ ${err.message}\n`);
                        }
                        main();
                    });
                });
                break;
            case "8":
                rl.question("🔢 Enter book ID to remove: ", (bookId) => {
                    try {
                        const id = Number(bookId);
                        if (isNaN(id))
                            throw new Error("🚫 Book ID must be a number.");

                        bookService.removeBook(id);
                        console.log("✅ Book removed successfully!\n");
                    } catch (err) {
                        console.error(`❌ ${err.message}\n`);
                    }
                    main();
                });
                break;
            case "9":
                console.log("👋 Exiting the system. Goodbye!");
                rl.close();
                break;
            default:
                console.error("❌ Invalid option. Please try again.");
                main();
                break;
        }
    });
}
function showMenu() {
    console.log("\n📚 Library Management Menu:");
    console.log("\nUsers");
    console.log("1  See All Users");
    console.log("2  Add User");
    console.log("3  View User Summary");
    console.log("\nBooks");
    console.log("4  See All Books");
    console.log("5  Add Book");
    console.log("6  Borrow Book");
    console.log("7  Return Book");
    console.log("8  Remove Book");
    console.log("9  Exit");
}
function parseBookDetails(input) {
    const parts = input.split(",");
    if (parts.length < 4) {
        throw new Error(
            "⚠️  Please enter all four fields: title, author, genre, and year.",
        );
    }

    const [rawTitle, rawAuthor, rawGenre, rawYear] = parts;
    const title = rawTitle.trim();
    const author = rawAuthor.trim();
    const genre = rawGenre.trim();
    const year = Number(rawYear.trim());

    if (isNaN(year)) {
        throw new Error("🚫 Year must be a valid number.");
    }

    return { title, author, genre, year };
}

main();