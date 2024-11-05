const axios = require('axios');

async function fetchTickets(zendeskConfig, startDate, endDate) {
    const auth = Buffer.from(`${zendeskConfig.email}/token:${zendeskConfig.token}`).toString('base64');
    const tickets = [];
    let url = `https://${zendeskConfig.domain}/api/v2/search.json?query=type:ticket created>=${startDate} created<${endDate}`;

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

        return tickets;
    } catch (e) {
        console.error('Error fetching tickets:', e.message);
        process.exit(1);
    }
}

module.exports = { fetchTickets };
