----
name: create_function
description: Create a new utility or composable for the Nuxt application
---

-

Whenever the user asks to create a new utility or composable, follow these strict guidelines:

1. **Location & Naming:**
   - Consider if teh function is a utility or a composable and place it in the appropriate folder (`composables/` or `utils/`). If you are unsure, ask the user for clarification.
   - Examine the `composables/` or `utils/` folder and strictly follow the existing pattern.
   - Use camelCase for utility names (e.g., `myUtility.ts`, `myComposable.ts`).
   - Place the utility in a subfolder if it is part of a specific feature or module.

2. **Function Structure:**
   - Use TypeScript for all utilities and composables.
   - Ensure that the function is well-typed and follows best practices for TypeScript.

3. **Testing:**
   - Write a unit test using the create_test skill API paragraph for the new utility or composable.
