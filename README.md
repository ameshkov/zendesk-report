# Zendesk Report Tool

It is important for the customer support team to categorize tickets in order to
understand the types of issues that customers are facing. This tool is designed
to help the customer support team categorize tickets based on the content of the
ticket.

The tool uses OpenAI API to categorize tickets based on the content of the
ticket.

## Configuration

In order to configure you should create a configuration YAML file. Check out
the template file at [`./config.dist.yaml`] to see how to configure it.

Example of a config file:

```yaml
openai:
    token: OPENAI_TOKEN

zendesk:
    email: YOUR_ZENDESK_ACCOUNT_EMAIL
    domain: YOUR_ZENDESK_DOMAIN
    token: ZENDESK_TOKEN

prompt:
    # The base OpenAI prompt to use.
    base: |
        Please categorize the following TICKET using the following tags:

    # The tags to use for the prompt.
    tags:
        - name: Billing
          description: Ticket content is related to Billing questions.

        - name: Technical
          description: Ticket content is related to Technical questions.
```

Configure the list of tags in the `tags` section. The tool will use these tags
and their description for automatic detection.

## Pre-requisites

* [Install Node](https://nodejs.org/en/download/package-manager) 20 or newer.
* You need API tokens for OpenAI and ZenDesk.

## Output

The tool will generate a CSV file with the following columns:
Report Date, Tag1, Tag2, Tag3, ..., TagN

The CSV file will contain the number of tickets that were categorized under each
tag for every day that is in the configured date range.

## Usage

Install the dependencies before using the script for the first time:

```bash
npm install
```

Here's how to run the script:

```bash
CONFIG_FILE="PATH_TO_CONFIG_FILE" \
    START_DATE="2024-11-01" \
    END_DATE="2024-11-02" \
    OUTPUT="PATH_TO_OUTPUT_CSV" \
    node src/index.js
```

* `CONFIG_FILE`: Path to the configuration file.
* `START_DATE`: The start date for the report in the format `YYYY-MM-DD`.
* `END_DATE`: The end date for the report in the format `YYYY-MM-DD`.
* `OUTPUT`: Path to the output CSV file.
* `LIMIT`: (Optional) The maximum number of tickets to fetch from Zendesk.
