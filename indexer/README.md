# Envio Indexer

## GraphQL Endpoints

**GraphQL API Endpoint:**
```
https://indexer.dev.hyperindex.xyz/b859eb4/v1/graphql
```

**GraphQL Playground:**
```
https://envio.dev/app/everalabs/pure-liquidity/25e502e/playground
```

## Testing GraphQL Queries

### Quick Test (using included files)

```bash
# Make script executable
chmod +x test-query.sh

# Run query
./test-query.sh
```

### Manual curl Test

```bash
curl -X POST https://indexer.dev.hyperindex.xyz/b859eb4/v1/graphql \
  -H 'Content-Type: application/json' \
  -d @query.json | jq
```

### One-liner Test

```bash
curl -X POST https://indexer.dev.hyperindex.xyz/b859eb4/v1/graphql -H 'Content-Type: application/json' -d '{"query":"query AllEvent { PositionManagerRouter_NFTMinted { id owner tokenId } PositionManagerRouter_MintedPosition { fee id owner pool token0 token1 tokenId } PositionManagerRouter_Initialized { id version } PositionManagerRouter_PositionCreated { amount0 amount1 owner id tokenId } }"}' | jq
```

---

## Development

*Please refer to the [documentation website](https://docs.envio.dev) for a thorough guide on all [Envio](https://envio.dev) indexer features*

### Run Locally

```bash
pnpm dev
```

Visit http://localhost:8080 to see the GraphQL Playground, local password is `testing`.

### Generate files from `config.yaml` or `schema.graphql`

```bash
pnpm codegen
```

### Pre-requisites

- [Node.js (use v18 or newer)](https://nodejs.org/en/download/current)
- [pnpm (use v8 or newer)](https://pnpm.io/installation)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)
