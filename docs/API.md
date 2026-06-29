# API Documentation

This document describes the API endpoints for Luma, including authentication, data operations, and error handling.

## Overview

Luma uses Next.js API routes for server-side logic and Supabase for database operations. The API follows RESTful conventions where appropriate.

## Authentication

### Authentication Method

Luma uses Supabase Auth for authentication. Sessions are managed via HTTP-only cookies.

### Session Management

**Session Storage:** HTTP-only cookies

**Session Validation:** Middleware checks session on protected routes

**Token Refresh:** Automatic token refresh via Supabase

**Protected Routes:** All API routes require valid session

### Authentication Flow

1. User signs in via Supabase Auth
2. Session token stored in HTTP-only cookie
3. Middleware validates session on each request
4. Invalid sessions redirect to login
5. Sessions refresh automatically

## API Endpoints

### Accounts API

#### Get All Accounts

**Endpoint:** `GET /api/accounts`

**Authentication:** Required

**Response:**
```json
{
  "accounts": [
    {
      "id": "uuid",
      "name": "Checking Account",
      "type": "checking",
      "balance": 1000.00,
      "currency": "USD",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Account by ID

**Endpoint:** `GET /api/accounts/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Account UUID

**Response:**
```json
{
  "account": {
    "id": "uuid",
    "name": "Checking Account",
    "type": "checking",
    "balance": 1000.00,
    "currency": "USD",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Create Account

**Endpoint:** `POST /api/accounts`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Checking Account",
  "type": "checking",
  "balance": 1000.00,
  "currency": "USD"
}
```

**Response:**
```json
{
  "account": {
    "id": "uuid",
    "name": "Checking Account",
    "type": "checking",
    "balance": 1000.00,
    "currency": "USD",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Account

**Endpoint:** `PUT /api/accounts/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Account UUID

**Request Body:**
```json
{
  "name": "Updated Account Name",
  "balance": 1500.00
}
```

**Response:**
```json
{
  "account": {
    "id": "uuid",
    "name": "Updated Account Name",
    "type": "checking",
    "balance": 1500.00,
    "currency": "USD",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Account

**Endpoint:** `DELETE /api/accounts/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Account UUID

**Response:**
```json
{
  "success": true
}
```

### Balance API

#### Get Balance

**Endpoint:** `GET /api/balance`

**Authentication:** Required

**Response:**
```json
{
  "balance": 1000.00,
  "currency": "USD"
}
```

#### Update Balance

**Endpoint:** `POST /api/balance`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 1500.00,
  "account_id": "uuid"
}
```

**Response:**
```json
{
  "balance": 1500.00,
  "currency": "USD"
}
```

### Categories API

#### Get All Categories

**Endpoint:** `GET /api/categories`

**Authentication:** Required

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Food",
      "type": "expense",
      "color": "#FF6B6B",
      "icon": "utensils",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Category

**Endpoint:** `POST /api/categories`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Food",
  "type": "expense",
  "color": "#FF6B6B",
  "icon": "utensils"
}
```

**Response:**
```json
{
  "category": {
    "id": "uuid",
    "name": "Food",
    "type": "expense",
    "color": "#FF6B6B",
    "icon": "utensils",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Category

**Endpoint:** `PUT /api/categories/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Category UUID

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "color": "#4ECDC4"
}
```

**Response:**
```json
{
  "category": {
    "id": "uuid",
    "name": "Updated Category Name",
    "type": "expense",
    "color": "#4ECDC4",
    "icon": "utensils",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Category

**Endpoint:** `DELETE /api/categories/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Category UUID

**Response:**
```json
{
  "success": true
}
```

### Expenses API

#### Get All Expenses

**Endpoint:** `GET /api/expenses`

**Authentication:** Required

**Query Parameters:**
- `limit` (optional) - Number of results to return
- `offset` (optional) - Number of results to skip
- `category_id` (optional) - Filter by category
- `start_date` (optional) - Filter by start date
- `end_date` (optional) - Filter by end date

**Response:**
```json
{
  "expenses": [
    {
      "id": "uuid",
      "amount": 50.00,
      "type": "expense",
      "description": "Lunch",
      "date": "2024-01-01",
      "category_id": "uuid",
      "account_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

#### Create Expense

**Endpoint:** `POST /api/expenses`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 50.00,
  "type": "expense",
  "description": "Lunch",
  "date": "2024-01-01",
  "category_id": "uuid",
  "account_id": "uuid"
}
```

**Response:**
```json
{
  "expense": {
    "id": "uuid",
    "amount": 50.00,
    "type": "expense",
    "description": "Lunch",
    "date": "2024-01-01",
    "category_id": "uuid",
    "account_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Expense

**Endpoint:** `PUT /api/expenses/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Expense UUID

**Request Body:**
```json
{
  "amount": 60.00,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "expense": {
    "id": "uuid",
    "amount": 60.00,
    "type": "expense",
    "description": "Updated description",
    "date": "2024-01-01",
    "category_id": "uuid",
    "account_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Expense

**Endpoint:** `DELETE /api/expenses/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Expense UUID

**Response:**
```json
{
  "success": true
}
```

### Goals API

#### Get All Goals

**Endpoint:** `GET /api/goals`

**Authentication:** Required

**Response:**
```json
{
  "goals": [
    {
      "id": "uuid",
      "name": "Emergency Fund",
      "description": "Build emergency fund",
      "target_amount": 10000.00,
      "current_amount": 5000.00,
      "currency": "USD",
      "deadline": "2024-12-31",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Goal

**Endpoint:** `POST /api/goals`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "description": "Build emergency fund",
  "target_amount": 10000.00,
  "currency": "USD",
  "deadline": "2024-12-31"
}
```

**Response:**
```json
{
  "goal": {
    "id": "uuid",
    "name": "Emergency Fund",
    "description": "Build emergency fund",
    "target_amount": 10000.00,
    "current_amount": 0.00,
    "currency": "USD",
    "deadline": "2024-12-31",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Goal

**Endpoint:** `PUT /api/goals/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Goal UUID

**Request Body:**
```json
{
  "current_amount": 6000.00,
  "status": "active"
}
```

**Response:**
```json
{
  "goal": {
    "id": "uuid",
    "name": "Emergency Fund",
    "description": "Build emergency fund",
    "target_amount": 10000.00,
    "current_amount": 6000.00,
    "currency": "USD",
    "deadline": "2024-12-31",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Goal

**Endpoint:** `DELETE /api/goals/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Goal UUID

**Response:**
```json
{
  "success": true
}
```

### Recurring Transactions API

#### Get All Recurring Transactions

**Endpoint:** `GET /api/recurring`

**Authentication:** Required

**Response:**
```json
{
  "recurring_transactions": [
    {
      "id": "uuid",
      "amount": 100.00,
      "type": "expense",
      "description": "Netflix",
      "frequency": "monthly",
      "interval": 1,
      "next_date": "2024-02-01",
      "active": true,
      "category_id": "uuid",
      "account_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Recurring Transaction

**Endpoint:** `POST /api/recurring`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 100.00,
  "type": "expense",
  "description": "Netflix",
  "frequency": "monthly",
  "interval": 1,
  "next_date": "2024-02-01",
  "category_id": "uuid",
  "account_id": "uuid"
}
```

**Response:**
```json
{
  "recurring_transaction": {
    "id": "uuid",
    "amount": 100.00,
    "type": "expense",
    "description": "Netflix",
    "frequency": "monthly",
    "interval": 1,
    "next_date": "2024-02-01",
    "active": true,
    "category_id": "uuid",
    "account_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Recurring Transaction

**Endpoint:** `PUT /api/recurring/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Recurring transaction UUID

**Request Body:**
```json
{
  "amount": 120.00,
  "active": true
}
```

**Response:**
```json
{
  "recurring_transaction": {
    "id": "uuid",
    "amount": 120.00,
    "type": "expense",
    "description": "Netflix",
    "frequency": "monthly",
    "interval": 1,
    "next_date": "2024-02-01",
    "active": true,
    "category_id": "uuid",
    "account_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### Delete Recurring Transaction

**Endpoint:** `DELETE /api/recurring/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Recurring transaction UUID

**Response:**
```json
{
  "success": true
}
```

### Tasks API

#### Get All Tasks

**Endpoint:** `GET /api/tasks`

**Authentication:** Required

**Query Parameters:**
- `status` (optional) - Filter by status
- `priority` (optional) - Filter by priority
- `goal_id` (optional) - Filter by goal

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish the project",
      "priority": "high",
      "status": "pending",
      "due_date": "2024-01-15",
      "goal_id": "uuid",
      "completed_at": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Task

**Endpoint:** `POST /api/tasks`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the project",
  "priority": "high",
  "due_date": "2024-01-15",
  "goal_id": "uuid"
}
```

**Response:**
```json
{
  "task": {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the project",
    "priority": "high",
    "status": "pending",
    "due_date": "2024-01-15",
    "goal_id": "uuid",
    "completed_at": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Task

**Endpoint:** `PUT /api/tasks/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Task UUID

**Request Body:**
```json
{
  "status": "completed",
  "completed_at": "2024-01-10T00:00:00Z"
}
```

**Response:**
```json
{
  "task": {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the project",
    "priority": "high",
    "status": "completed",
    "due_date": "2024-01-15",
    "goal_id": "uuid",
    "completed_at": "2024-01-10T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
}
```

#### Delete Task

**Endpoint:** `DELETE /api/tasks/[id]`

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Task UUID

**Response:**
```json
{
  "success": true
}
```

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - User lacks permission
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Common Error Codes

- `AUTH_REQUIRED` - Authentication required
- `INVALID_CREDENTIALS` - Invalid authentication credentials
- `INVALID_PARAMETERS` - Invalid request parameters
- `RESOURCE_NOT_FOUND` - Resource not found
- `DUPLICATE_RESOURCE` - Resource already exists
- `DATABASE_ERROR` - Database operation failed
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded

## Rate Limiting

Rate limiting is implemented to prevent abuse:

- **Limit:** 100 requests per minute per user
- **Headers:**
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Pagination

Pagination is supported for list endpoints:

**Query Parameters:**
- `limit` - Number of results per page (default: 20, max: 100)
- `offset` - Number of results to skip (default: 0)

**Response Headers:**
- `X-Total-Count`: Total number of results
- `X-Page-Count`: Total number of pages

## Data Validation

All requests are validated using Zod schemas:

- Required fields are enforced
- Data types are validated
- Value ranges are checked
- Business rules are applied

## Security

### Authentication

- All endpoints require valid session
- Sessions stored in HTTP-only cookies
- Automatic token refresh
- Session expiration handling

### Authorization

- Row-level security (RLS) in database
- User can only access their own data
- API routes enforce user ownership

### Data Encryption

- HTTPS for all requests
- Data encrypted at rest (Supabase)
- Sensitive data never logged

## Related Documentation

- **Data Model**: `docs/DATA_MODEL.md` - Database schema and relationships
- **Architecture**: `docs/ARCHITECTURE.md` - System architecture
- **Security**: `docs/SECURITY.md` - Security practices

---

**Note:** This API documentation is a living document. It will be updated as new endpoints are added or existing endpoints are modified.
