import readline from "readline";
import bookService from './book-service.js';
import userService from './userService.js'; 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function showMenu() {
    console.log("\n📚 Library Management Menu:");
    console.log("\nUsers");
    console.log("1  See All Users");
    console.log("2  Add User");
    console.log("3  View User Summary");
    console.log("4  Check Overdue Users");
    console.log("\nBooks");
    console.log("5  See All Books");
    console.log("6  Search Books by word");    
    console.log("7  Get top rated books");
    console.log("8  Get most popular books");
    console.log("9  Recommend Books");
    console.log("10 Add Book");
    console.log("11 Borrow Book");
    console.log("12 Return Book");
    console.log("13 Remove Book");
    console.log("14  Exit");
}

function main() {
    console.log("-------------------------------------------");
    showMenu();
    rl.question("\n👉 Enter your choice: ", (choice) => {
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
                rl.question("\n👤 Enter user name: ", (name) => {
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
                    "\n👤 Enter user name to view summary: ",
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
                try {
                    const overdueUsers = userService.checkOverdueUsers();
                    if (overdueUsers.length === 0) {
                        console.log("\n✅ No overdue users!\n");
                    } else {
                        console.log("\n⏰ Overdue Users:");
                        overdueUsers.forEach(overdue => {
                            console.log(`👤 ${overdue.userName} - 📘 Book ID: ${overdue.bookId} - Overdue Days: ${overdue.overdueDays}`);
                        });
                    }
                } catch (err) {
                    console.error(`❌ ${err.message}\n`);
                }
                main();
                break;
            case "5":
                const books = bookService.seeAllBooks();
                for (const book of books) {
                    console.log(
                        `📘 Book: ${book.title} - Author: ${book.author} - Genre: ${book.genre} - Year Published: ${book.year} - Rating: ${book.rating} - Available: ${book.isAvailable} - Borrow Count: ${book.borrowCount}`,
                    );
                }
                main();
                break;
            case "6":
                rl.question("\n🔍 Enter search parameter (title, author, genre, rating, year): ", (param) => {
                    rl.question("\n🔎 Enter value to search: ", (value) => {
                        try {
                            let searchValue = value.trim();

                            if (["rating", "year"].includes(param)) {
                                const num = Number(searchValue);
                                if (isNaN(num)) throw new Error(`🚫 ${param} must be a number.`);
                                searchValue = num;
                            }

                            const results = bookService.searchBooksBy(param, searchValue);

                            for (const book of results) {
                                console.log(
                                    `📘 Book: ${book.title} - Author: ${book.author} - Genre: ${book.genre} - Year: ${book.year} - Rating: ${book.rating}`
                                );
                            }

                            if (results.length === 0) {
                                console.log("❌ No matching books found.");
                            }
                        } catch (err) {
                            console.error(`❌ ${err.message}\n`);
                        }
                        main();
                    });
                });
                break;
            case "7":
                rl.question("\n🔢 How many top-rated books do you want to see: ", (input) => {
                    try {
                        const limit = Number(input.trim());
                        if (isNaN(limit) || limit <= 0) {
                            throw new Error("🚫 Please enter a valid positive number.");
                        }

                        const topBooks = bookService.getTopRatedBooks(limit);
                        if (topBooks.length === 0) {
                            console.log("❌ No books available.");
                        } else {
                            console.log(`\n🌟 Top ${limit} Rated Books:`);
                            for (const book of topBooks) {
                                console.log(`📘 ${book.title} - Rating: ${book.rating}`);
                            }
                        }
                    } catch (err) {
                        console.error(`❌ ${err.message}\n`);
                    }
                    main();
                });
                break;
            case "8":
                rl.question("\n🔢 How many most popular books do you want to see? ", (input) => {
                    try {
                        const limit = Number(input.trim());
                        if (isNaN(limit) || limit <= 0) {
                            throw new Error("🚫 Please enter a valid positive number.");
                        }

                        const popularBooks = bookService.getMostPopularBooks(limit);
                        if (popularBooks.length === 0) {
                            console.log("❌ No books available.");
                        } else {
                            console.log(`\n🔥 Top ${limit} Most Popular Books:`);
                            for (const book of popularBooks) {
                                console.log(`📘 ${book.title} - Borrowed: ${book.borrowCount} times`);
                            }
                        }
                    } catch (err) {
                        console.error(`❌ ${err.message}\n`);
                    }
                    main();
                });
                break;
            case "9":
                rl.question("\n👤 Enter user name to get book recommendations: ", (userName) => {
                    try {
                        if (!userName.trim())
                            throw new Error("⚠️  User name cannot be empty.");

                        const recommendations = bookService.recommendBooks(userName.trim());
                        if (recommendations.length === 0) {
                            console.log("🤷 No recommendations available for this user.");
                        } else {
                            console.log(`\n📚 Recommended Books for ${userName.trim()}:`);
                            for (const book of recommendations) {
                                console.log(`📘 ${book.title} - Genre: ${book.genre} - Rating: ${book.rating}`);
                            }
                        }
                    } catch (err) {
                        console.error(`❌ ${err.message}\n`);
                    }
                    main();
                });
                break;
            case "10":
                rl.question("\n📘 Enter book title: ", (title) => {
                    rl.question("✍️ Enter author name: ", (author) => {
                        rl.question("🏷️ Enter genre: ", (genre) => {
                            rl.question("📅 Enter year published: ", (yearInput) => {
                                try {
                                    const year = Number(yearInput.trim());
                                    if (!title.trim() || !author.trim() || !genre.trim()) {
                                        throw new Error("⚠️ All fields must be filled.");
                                    }
                                    if (isNaN(year)) {
                                        throw new Error("🚫 Year must be a valid number.");
                                    }

                                    if (bookService.checkIfBookExistsByTitle(title.trim())) {
                                        throw new Error("⚠️ A book with this title already exists.");
                                    }

                                    const newBook = bookService.addBook(
                                        title.trim(),
                                        author.trim(),
                                        genre.trim(),
                                        year
                                    );

                                    console.log(`✅ Book "${newBook.title}" added successfully!\n`);
                                } catch (err) {
                                    console.error(`❌ ${err.message}\n`);
                                }
                                main();
                            });
                        });
                    });
                });
                break;

            case "11":
                rl.question(
                    "\n👤 Enter user name to borrow book: ",
                    (userName) => {
                        rl.question("\n🔢 Enter book ID: ", (bookId) => {
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
            case "12":
                rl.question(
                    "\n👤 Enter user name to return book: ",
                    (userName) => {
                        rl.question("\n🔢 Enter book ID: ", (bookId) => {
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
                                let result = bookService.returnBook(userName.trim(), id);
                                if (result.hasPenalty) console.log(`your penalty points are: ${result.user.penaltyPoints}`)
                                console.log("✅ Book returned successfully!\n");
                            } catch (err) {
                                console.error(`❌ ${err.message}\n`);
                            }
                            main();
                        });
                    },
                );
                break;

            case "13":
                rl.question("\n🔢 Enter book ID to remove: ", (bookId) => {
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
                
            case "14":
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

main();





