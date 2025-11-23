---
id: response-codes
title: Understanding HTTP Response Codes in API Routes
sidebar_label: Response Codes
sidebar_position: 2
---

When designing APIs, it's important to communicate the outcome of each request
clearly. HTTP response codes are standardized numbers that indicate the result
of a client's request to the server. This article explains the most common
response codes, what they mean, and when to use them—especially in the context
of route definitions like those created with `@hono/zod-openapi`.

---

## What Are HTTP Response Codes?

HTTP response codes are three-digit numbers returned by the server in response
to a client's request. They are grouped into categories based on the first
digit:

- **1xx**: Informational responses
- **2xx**: Success
- **3xx**: Redirection
- **4xx**: Client errors
- **5xx**: Server errors

---

## Common Response Codes and Their Usage

### 200 OK

- **Meaning**: The request was successful, and the server is returning the
  requested data.
- **When to Use**: For successful `GET`, `PUT`, or `DELETE` requests where the
  response contains the requested resource or a confirmation.
- **Example**:

  ```typescript
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema.array(),
        },
      },
      description: 'All user documents from the users collection',
    },
  }
  ```

### 201 Created

- **Meaning**: The request was successful, and a new resource was created.
- **When to Use**: For successful `POST` requests that result in the creation of
  a new resource.
- **Example**:

  ```typescript
  responses: {
    201: {
      content: {
        'application/json': {
          schema: newResourceSchema,
        },
      },
      description: 'The newly created resource',
    },
  }
  ```

### 204 No Content

- **Meaning**: The request was successful, but there is no content to return.
- **When to Use**: For successful `DELETE` or `PUT` requests when no response
  body is needed.
- **Example**:

  ```typescript
  responses: {
    204: {
      description: 'Resource deleted successfully',
    },
  }
  ```

### 400 Bad Request

- **Meaning**: The server could not understand the request due to invalid
  syntax.
- **When to Use**: When the client sends invalid data or parameters.
- **Example**:

  ```typescript
  responses: {
    400: {
      description: 'Invalid request parameters',
    },
  }
  ```

### 401 Unauthorized

- **Meaning**: The client must authenticate itself to get the requested
  response.
- **When to Use**: When authentication is required and has failed or not been
  provided.
- **Example**:

  ```typescript
  responses: {
    401: {
      description: 'Authentication required',
    },
  }
  ```

### 403 Forbidden

- **Meaning**: The client does not have access rights to the content.
- **When to Use**: When the user is authenticated but does not have permission
  to perform the action.
- **Example**:

  ```typescript
  responses: {
    403: {
      description: 'You do not have permission to access this resource',
    },
  }
  ```

### 404 Not Found

- **Meaning**: The server cannot find the requested resource.
- **When to Use**: When a resource does not exist.
- **Example**:

  ```typescript
  responses: {
    404: {
      description: 'Resource not found',
    },
  }
  ```

### 500 Internal Server Error

- **Meaning**: The server encountered an unexpected condition that prevented it
  from fulfilling the request.
- **When to Use**: For unexpected errors on the server side.
- **Example**:

  ```typescript
  responses: {
    500: {
      description: 'An unexpected error occurred',
    },
  }
  ```

---

## Example: Defining Responses in a Route

Here’s how you might define a route with a 200 response using
`@hono/zod-openapi`:

```typescript
import { createRoute } from "@hono/zod-openapi";
import { userSchema } from "@repo/core";

export const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: userSchema.array(),
        },
      },
      description: "All user documents from the user collection",
    },
  },
});
```

---

## Best Practices

- **Always use the most specific and accurate response code.**
- **Document each response code with a clear description.**
- **Include error responses (4xx, 5xx) to help clients handle failures
  gracefully.**
- **Use schemas to define the structure of response bodies for each code.**

---

## Summary Table

| Code | Name                  | When to Use                         |
| ---- | --------------------- | ----------------------------------- |
| 200  | OK                    | Successful GET/PUT/DELETE with data |
| 201  | Created               | Resource created (POST)             |
| 204  | No Content            | Success, no response body           |
| 400  | Bad Request           | Invalid client request              |
| 401  | Unauthorized          | Authentication required             |
| 403  | Forbidden             | No permission                       |
| 404  | Not Found             | Resource does not exist             |
| 500  | Internal Server Error | Unexpected server error             |

---

By using the correct response codes and documenting them in your API routes, you
make your API more predictable, robust, and easier to use.