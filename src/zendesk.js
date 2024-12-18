const axios = require('axios');

/**
 * Increments a date string (YYYY-MM-DD) by one day.
 * @param {string} dateStr - The date string in YYYY-MM-DD format.
 * @returns {string} - The incremented date string in YYYY-MM-DD format.
 */
function addOneDay(dateStr) {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // zero-based
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    date.setDate(date.getDate() + 1);

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');

    return `${newYear}-${newMonth}-${newDay}`;
}

/**
 * Compares two date strings in YYYY-MM-DD format to see if the first is less than the second.
 * @param {string} date1 - The first date string.
 * @param {string} date2 - The second date string.
 * @returns {boolean} - True if date1 < date2, false otherwise.
 */
function isBefore(date1, date2) {
    return date1 < date2; 
}

async function fetchTickets(zendeskConfig, startDate, endDate) {
    const auth = Buffer.from(`${zendeskConfig.email}/token:${zendeskConfig.token}`).toString('base64');
    const tickets = [];

    let currentDate = startDate;

    while (isBefore(currentDate, endDate)) {
        const nextDate = addOneDay(currentDate);

        // If nextDate surpasses endDate, we only fetch up to endDate
        const queryEndDate = nextDate > endDate ? endDate : nextDate;

        let url = `https://${zendeskConfig.domain}/api/v2/search.json?query=type:ticket created>=${currentDate} created<${queryEndDate}`;

        try {
            while (url) {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/json',
                    },
                });
                tickets.push(...response.data.results);
                url = response.data.next_page;
            }
        } catch (e) {
            console.error('Error fetching tickets:', e.message);
            process.exit(1);
        }

        currentDate = nextDate;
    }

    return tickets;
}

module.exports = { fetchTickets };
