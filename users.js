const users = [
    {
        userName: "User1",
        borrowedBooks: [
            {
                bookId: 1,
                borrowDate: "2025-07-01",
                dueDate: "2025-07-15",
            },
        ],
        penaltyPoints: 0,
    },
    {
        userName: "User2",
        borrowedBooks: [
            {
                bookId: 9,
                borrowDate: "2025-06-01",
                dueDate: "2025-06-15",
            },
            {
                bookId: 5,
                borrowDate: "2025-07-01",
                dueDate: "2025-07-15",
            },
        ],
        penaltyPoints: 1,
    },
];
export { users };
