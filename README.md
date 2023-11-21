# Demo Identifier Resolver

Identifier resolution framework to resolve etheruem addresses to identifiable names using Google Sheets (third party resolution service). Read more about our Architectural Decision Records (ADR) [here](https://github.com/Open-Attestation/adr/blob/master/identifier_resolution_framework.md).

### Setup

_Prerequisite: [Google sheets API](https://developers.google.com/sheets/api/reference/rest)._

- Go to [Google Console](https://console.cloud.google.com/apis/library) and create a new project.
- Enable Google Sheets API. Once enabled, it should be added to the enabled API list.
- Create an API key.
- Create and populate a Google Sheet with columns of:
  - `identifier` (The ethereum address of the company)
  - `name` (The name of the company)
  - `source`. (_Optional:The source of the information_)
- Set Google Sheet to public.
- Setup the third party resolution service by configuring it to access Google Sheets with the API key gotten from step 1.
  - Fork this [reference implementation](https://github.com/TradeTrust/demo-identifier-resolver).
  - Define these environment variables in github repo secrets:
    - SHEETS_API_KEY = Your created API key from Google Console.
    - SHEETS_ID = Your google sheet ID.
    - SHEETS_RANGE = Your google sheet cell range.
    - STAGING_AWS_ACCESS_KEY_ID = Your AWS access key id.
    - STAGING_AWS_SECRET_ACCESS_KEY = Your AWS access key secret.
  - Spin up this service up by pushing to master, github actions will automate the deployment.
  - Go to API Gateway in your AWS account. Create a custom domain name of your preference. Take note of API Gateway domain name.
  - Click API mappings and configure it by selecting `stg-demo-identifier-resolver` from dropdown list.
  - Go to Route53 and create a new CNAME record. The value is your API Gateway domain name.
  - Once set, wait for a few minutes and your API endpoint will be accessible in the custom domain name that you've created. This will be what we call the third party resolution service endpoint.

