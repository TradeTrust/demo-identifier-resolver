#!/usr/bin/env bash

mkdir -p ~/.aws

cat > ~/.aws/credentials << EOL
[default]
aws_access_key_id = ${STAGING_AWS_ACCESS_KEY_ID}
aws_secret_access_key = ${STAGING_AWS_SECRET_ACCESS_KEY}
EOL

cat > .env << EOL
SHEETS_API_KEY=${SHEETS_API_KEY}
SHEETS_ID=${SHEETS_ID}
SHEETS_RANGE=${SHEETS_RANGE}
EOL

npm run deploy -- --stage stg