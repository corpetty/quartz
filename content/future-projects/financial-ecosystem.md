---
draft: true
---
## General Notes
- 9 employees

## Users
- customers
	- they get Orion portal

## Requirements
- onboarding pulls forms from Schwab, checks for duplications within CRM

## Data Sources
- Hubspot has API
- Schwab/fidelity has API
- Orion doesn't connect to hubspot, pulls from schwab
	- has an API, needs connection
- Pantera does feed into Orion

## Tools used
- Slack - communications
- Office365 - office tools
	- oneDrive for data
- Hubspot - CRM
	- uses marketing hub
	- uses sales hub
- Orion - wealthmanagement software
- Schwab/Fidelity - custodians
- Pantera - 3rd party management of retail retirement plans
- n8n - automations
- eMoney - financial planning software - monte carlo simulations for forecasting
- ellevate - VOIP
	- keeps records but isn't connected to anything


## Abreviations
- RTQ - risk tolerance questionaire
- CAA - customer advisory agreement

## Problems
- onboarding is a manual process to get forms and get customers into software ecosystem
	- Schwab must use docusign -> to their security specs
		- update forms all the time
	- CRM doesn't connect to ORION or Schwab/Fidelity
- data privacy is a must
	- associated data management regulation
- CRM can't see documents in OneDrive
- text/phone isn't connected into anything
	- captured correspondence for audit purposes

## desired solution replaces (similar to Odoo for wealthManagement) - competitor for Orion
- slack
- orion
- hubspot