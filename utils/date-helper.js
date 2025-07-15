const dateUtils = {
    getTodayTimestamp() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.getTime();
    },
    addDays(timestamp, days) {
        return timestamp + days * 24 * 60 * 60 * 1000;
    }
};

export default dateUtils;