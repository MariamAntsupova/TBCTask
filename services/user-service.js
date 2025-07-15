import { users } from '../mocks/users.js';
import User from '../models/user.js';

import dateHelper from '../utils/date-helper.js';

class userService {
    static findUserByUserName(userName) {
        const user = users.find((u) => u.userName === userName);
        if (!user) throw new Error("User not found");
        return user;
    }

    static createUser(userName) {
        if (!userName || userName.trim() === "")
            throw new Error("Username cannot be empty.");
        if (users.some((u) => u.userName === userName))
            throw new Error(
                `User with this username: ${userName} already exists.`,
            );

        const user = new User(userName);
        users.push(user);
    }

    static seeAllUsers() {
        return users;
    }

    static checkOverdueUsers() {
        let overdueUsers = [];
        const today = dateHelper.getTodayTimestamp();

        users.forEach((user) => {
            user.borrowedBooks.forEach((borrowedBook) => {
                const dueDateMs = Date.parse(borrowedBook.dueDate);

                if (today > dueDateMs) {
                    const overdueDays = Math.floor(
                        (today - dueDateMs) / (1000 * 60 * 60 * 24),
                    );
                    overdueUsers.push({
                        userName: user.userName, 
                        overdueDays: overdueDays,
                        bookId: borrowedBook.bookId,
                    });
                }
            });
        });

        return overdueUsers;
    }
}

export default userService;