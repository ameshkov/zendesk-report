// src/index.js
const { loadConfig } = require('./config');
const { fetchTickets } = require('./zendesk');
const { categorizeTicket } = require('./openai');
const { generateReport } = require('./report');

const CONFIG_FILE = process.env.CONFIG_FILE;
const START_DATE = process.env.START_DATE;
const END_DATE = process.env.END_DATE;
const OUTPUT = process.env.OUTPUT;
const LIMIT = !!process.env.LIMIT ? parseInt(process.env.LIMIT) : 0;

if (!CONFIG_FILE || !START_DATE || !END_DATE || !OUTPUT) {
    console.error('Please set CONFIG_FILE, START_DATE, END_DATE, and OUTPUT environment variables.');
    process.exit(1);
}

(async () => {
    const config = loadConfig(CONFIG_FILE);
    const tickets = await fetchTickets(config.zendesk, START_DATE, END_DATE);

    console.log(`Fetched ${tickets.length} tickets.`);

    if (LIMIT > 0) {
        tickets.length = Math.min(tickets.length, LIMIT);

        console.log(`Limiting to ${tickets.length} tickets.`);
    }

    const reportData = {};
    const tagNames = config.prompt.tags.map((tag) => tag.name);

    for (const ticket of tickets) {
        console.log(`Categorizing ticket ${ticket.id}...`);

        const response = await categorizeTicket(config.openai, config.prompt, ticket);

        const date = ticket.created_at.split('T')[0];

        if (!reportData[date]) {
            reportData[date] = { date };
            tagNames.forEach((tag) => {
                reportData[date][tag] = 0;
            });
        }

        response.tags.forEach((tagName) => {
            if (tagNames.includes(tagName)) {
                reportData[date][tagName] += 1;
            }
        });
    }

    const reportArray = Object.values(reportData);

    await generateReport(OUTPUT, reportArray, config.prompt.tags);
})();
