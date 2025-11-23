---
sidebar_position: 3
---

# API Versioning Strategy: URL Path Versioning

## Overview

As our API evolves, we need a way to introduce changes without breaking existing
client applications. **API versioning** allows us to do this by supporting
multiple versions of our API at the same time. This article explains our
approach to API versioning using **URL Path Versioning**, and highlights the
main challenges we face with mobile and web deployments.

---

## What is URL Path Versioning?

**URL Path Versioning** means including the version number directly in the URL
path of each API endpoint. For example:

- Version 1: `https://api.example.com/v1/users`
- Version 2: `https://api.example.com/v2/users`

This makes it clear which version of the API a client is using, and allows us to
change or improve endpoints in new versions without affecting existing users.

---

## Why Use URL Path Versioning?

- **Clarity:** The API version is visible in every request.
- **Simplicity:** Easy to route and manage in code.
- **Stability:** Old clients can continue using older versions while new clients
  adopt the latest.
- **Documentation:** Each version can have its own documentation and OpenAPI
  spec.

---

## Real-World Pain Points

### 1. **Coordinating Releases Across Platforms**

When we update an API endpoint that is used by both our mobile and web app, we need to ensure that both clients are ready to
handle the change. This is especially challenging because:

- **Mobile app releases are delayed by app store review:** We can't control
  exactly when users will get the new version.
- **Web app releases are instant:** We can deploy updates immediately, but users
  may still be using older versions of the mobile app.

### 2. **Supporting Multiple App Versions**

Even after releasing a new version of the app, not all users update immediately.
This means:

- **Older app versions may still call old API endpoints.**
- If we remove or change an endpoint that older apps rely on, those apps will
  break for users who haven't updated.

### 3. **Backwards Compatibility**

Historically, we've avoided these issues by making only **backwards compatible
changes** (e.g., adding new fields, not removing or changing existing ones).
However, as our product grows, we may need to make breaking changes, and our
current approach won't be enough.

---

## How URL Path Versioning Helps

By versioning our API in the URL, we can:

- **Deploy new API versions without breaking old clients.**
- **Support multiple versions of the app at the same time.**
- **Phase out old versions gradually,** giving users time to update.

---

## How We Structure Our Code

We organize our API code by version, only duplicating endpoints when their
contract (input, output, or side effects) changes. Shared code (like database
access or utility functions) lives in a common folder.

### Example Directory Structure

```
/api
  /v1
    users.ts
    posts.ts
  /v2
    users.ts   // Only if users endpoint changes in v2
  /shared
    db.ts
    utils.ts
  index.ts     // Main entry point
```

- **`/v1`**: Contains endpoints for version 1.
- **`/v2`**: Contains only endpoints that have changed in version 2.
- **`/shared`**: Contains code used by all versions.

---

## Example: Defining Versioned Endpoints

Suppose we have a `users` endpoint. In version 1, it returns a user's name and
email. In version 2, we add a new field, `phone`.

### Version 1 (`/v1/users`)

```typescript
// api/v1/users.ts
export const v1UsersHandler = (c) => {
  return c.json({
    name: "Alice",
    email: "alice@example.com",
  });
};
```

### Version 2 (`/v2/users`)

```typescript
// api/v2/users.ts
export const v2UsersHandler = (c) => {
  return c.json({
    name: "Alice",
    email: "alice@example.com",
    phone: "+1234567890",
  });
};
```

### Main API Entry Point

```typescript
// api/index.ts
import { Hono } from "hono";
import { v1UsersHandler } from "./v1/users";
import { v2UsersHandler } from "./v2/users";

const app = new Hono();

app.route("/v1/users", v1UsersHandler);
app.route("/v2/users", v2UsersHandler);

export default app;
```

---

## How to Add a New Version

1. **Create a new folder** (e.g., `/v2`).
2. **Copy and update** only the endpoints that are changing.
3. **Update the main router** to add the new versioned routes.
4. **Update the OpenAPI spec** and documentation for the new version.

---

## Best Practices

- **Only duplicate endpoints when their contract changes.** If only the
  implementation changes (e.g., performance improvements), keep the same
  version.
- **Deprecate old versions gracefully.** Notify clients before removing old
  versions.
- **Document each version separately.** Maintain a separate OpenAPI spec and
  documentation for each version.
- **Monitor usage of old versions.** Use analytics to see when it’s safe to
  remove support.

---

## Summary Table

| Version | Endpoint Path | Code Location     | OpenAPI Spec      |
| ------- | ------------- | ----------------- | ----------------- |
| v1      | `/v1/users`   | `api/v1/users.ts` | `openapi.v1.yaml` |
| v2      | `/v2/users`   | `api/v2/users.ts` | `openapi.v2.yaml` |

---

## FAQ

**Q: Do I need to copy all endpoints for each new version?**  
A: No. Only copy and update endpoints that change. Others can continue to use
the previous version’s code.

**Q: How do clients know which version to use?**  
A: Clients specify the version in the URL (e.g., `/v1/users` or `/v2/users`).

**Q: What if I need to fix a bug in an old version?**  
A: You can patch the code in the old version’s folder without affecting newer
versions.

**Q: What if a breaking change is needed in an endpoint used by both mobile and
web?**  
A: You must:

- Release the new API version.
- Update both clients to use the new version.
- Wait until the mobile app is approved and widely adopted before removing the
  old version.

---

## Conclusion

**URL Path Versioning** is a clear, maintainable way to manage changes in our
API. It helps us support multiple app versions, coordinate releases across
platforms, and evolve our API safely—even when app store delays and user update
habits make things tricky.

**Key Takeaway:**  
When making breaking changes, always support the old API version until all
clients have migrated. This is the only way to ensure a smooth transition,
especially for mobile apps where updates are not instant.
