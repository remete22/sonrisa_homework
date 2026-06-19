----
name: create_test
description: Create a test for a new file or update an existing test for a file that has been modified.
---

-

Whenever the user asks to create or update a test using vitest, follow these strict guidelines:

## Component Tests

- Check existing tests and follow existing patterns for the component being tested.
- Always use the `nuxt-test-utils` package to mount components and test them.
- Use `describe` blocks to group related tests and `it` blocks for individual test cases.
- Always use mocked API responses for components that make API calls. Do not make real API calls in tests.

## API Tests

- When creating a new API test, place it in the `server/api/v1/__tests__/` folder and follow the existing pattern.
- Use `describe` blocks to group related tests and `it` blocks for individual test cases.
- Always use mocked database responses for API tests. Do not make real database calls in tests.

## Other Tests

- For other types of tests, follow the existing patterns in the project and ensure that tests are isolated and do not depend on external services or state.
- Use `describe` blocks to group related tests and `it` blocks for individual test cases.
- Always use mocked API responses for components that make API calls. Do not make real API calls in tests.

When a test is written always run it and ensure it passes before committing the code. If a test fails, fix the code or the test until it passes.
