# Indexer Module

This module provides a GraphQL proxy service to interact with the Envio indexer without exposing the indexer URL directly to the frontend.

## Environment Variables

Make sure to set the following environment variable:

```bash
ENVIO_INDEXER_URL=https://your-envio-indexer-url.com/graphql
```

## Endpoints

### POST /indexer/query

Execute a GraphQL query against the Envio indexer.

**Authentication Required:** Yes (Bearer token)
**Roles:** admin, user

#### Request Body

```json
{
  "query": "query GetUsers { users { id name email } }",
  "variables": {
    "limit": 10,
    "offset": 0
  },
  "operationName": "GetUsers"
}
```

#### Response

```json
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

#### Example Usage with curl

```bash
curl -X POST http://localhost:8008/indexer/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query { users { id name email } }"
  }'
```

### GET /indexer/health

Check the health status of the Envio indexer connection.

**Authentication Required:** Yes (Bearer token)
**Roles:** admin, user

#### Response

```json
{
  "status": "healthy",
  "indexerUrl": "https://your-envio-indexer-url.com/graphql"
}
```

## Error Handling

The service handles various error scenarios:

- **400 Bad Request**: Invalid GraphQL query format
- **401 Unauthorized**: Missing or invalid authentication token
- **500 Internal Server Error**: Connection issues with the indexer or unexpected errors

## Features

- ✅ GraphQL query validation
- ✅ Automatic error handling and logging
- ✅ Health check endpoint
- ✅ Role-based access control
- ✅ Comprehensive API documentation with Swagger
- ✅ Support for GraphQL variables and operation names
- ✅ Proper error responses for debugging

## Security

- All endpoints require authentication
- Both admin and user roles can access the indexer
- The actual indexer URL is hidden from the frontend
- Input validation prevents malformed requests
