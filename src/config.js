const fs = require('fs');
const yaml = require('js-yaml');

function loadConfig(filePath) {
    try {
        const file = fs.readFileSync(filePath, 'utf8');
        const config = yaml.load(file);
        return config;
    } catch (e) {
        console.error('Error reading config file:', e.message);
        process.exit(1);
    }
}

module.exports = { loadConfig };
