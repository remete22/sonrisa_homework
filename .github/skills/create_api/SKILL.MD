----
name: create_api
description: Create a Nitro server API endpoint for the Nuxt application
---

Whenever the user asks to create a new API endpoint, follow these strict guidelines:

1. **Location & Naming:**
   - Examine the `server/api/v1/` folder and strictly follow the existing pattern.
   - Use the HTTP method as a suffix in the filename (e.g., `my-api.post.ts`, `my-api.get.ts`, `my-api.delete.ts`).

2. **Nitro Handler Pattern:**
   - Always wrap the endpoint handler in `defineEventHandler(async (event) => { ... })`.
   - Do NOT use old Express-style request/response objects or manual `res.send()` / `res.json()`.
   - To read the request body in POST/PUT requests, use `await readBody(event)`.
   - To read query parameters in GET requests, use `getQuery(event)`.

3. **Response & Error Handling:**
   - Return raw objects, arrays, or messages directly. Nitro will automatically parse them into the correct JSON response.
   - For error handling, use `createError({ statusCode: X, statusMessage: '...' })` and throw it.

4. **Context & Type Safety:**
   - Ensure inputs (like parsed bodies) are type-safe.
   - If Prisma is available globally or via a utility (e.g., `server/utils/prisma.ts`), use it to interact with the database inside the handler.

5. **Testing:**
   - Write a unit test using the create_test skill API paragraph for the new endpoint.

6. **Finishing Up:**
   - Ensure everything is still working by running the commands in the finish_feature skill.
