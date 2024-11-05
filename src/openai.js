// src/openai.js
const axios = require('axios');

async function categorizeTicket(openaiConfig, promptConfig, ticket) {
    const prompt = createPrompt(promptConfig, ticket);

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: responseFormat,
            },
            {
                headers: {
                    Authorization: `Bearer ${openaiConfig.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return JSON.parse(response.data.choices[0].message.content);
    } catch (e) {
        console.error('Error with OpenAI API:', e.message);
        process.exit(1);
    }
}

function createPrompt(promptConfig, ticket) {
    const tagsDescrption = promptConfig.tags.map((tag) => `- ${tag.name}: ${tag.description}`).join('\n');

    return `${promptConfig.base}

${tagsDescrption}

TICKET:
Subject: ${ticket.raw_subject}
Description: ${ticket.description}

${promptConfig.footer}`;
}

const responseFormat = {
    type: 'json_schema',
    json_schema: {
        "name": "tags",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "tags": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "Tag name."
                    },
                }
            },
            "required": ["tags"],
            "additionalProperties": false
        }
    }
}

module.exports = { categorizeTicket };
