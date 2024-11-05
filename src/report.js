const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function generateReport(outputPath, reportData, tags) {
    const header = [{ id: 'date', title: 'Report Date' }];
    tags.forEach((tag) => {
        header.push({ id: tag.name, title: tag.name });
    });

    const csvWriter = createCsvWriter({
        path: outputPath,
        header: header,
    });

    try {
        await csvWriter.writeRecords(reportData);
        console.log('Report generated at:', outputPath);
    } catch (e) {
        console.error('Error generating report:', e.message);
        process.exit(1);
    }
}

module.exports = { generateReport };
