#!/bin/bash

# Test GraphQL endpoint with AllEvent query
curl -X POST https://indexer.dev.hyperindex.xyz/b859eb4/v1/graphql \
  -H 'Content-Type: application/json' \
  -d @query.json | jq
