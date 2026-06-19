----
name: create_component
description: Create a new Vue component for the Nuxt application
---

-

Whenever the user asks to create a new Vue component, follow these strict guidelines:

1. **Location & Naming:**
   - Examine the `components/` folder and strictly follow the existing pattern.
   - Use PascalCase for component names (e.g., `MyComponent.vue`).
   - Place the component in a subfolder if it is part of a specific feature or module.

2. **Component Structure:**
   - Use the `<script setup>` syntax for the script section.
   - Use the `<template>` section for the HTML structure.
   - Don't use `<style>` unless it's necessary for the component. If styles are needed, use Tailwind classes or scoped styles.
   - Don't import anything that can be automatically imported by Nuxt. Only import what is necessary for the component.
   - The order of the sections should be: `<script setup>`, `<template>`, and then `<style>` (if needed).

3. **Props & Emits:**
   - Use `defineEmits` to declare emitted events and their types.
   - Use `defineProps` to declare props and their types.
   - Use `withDefaults` to provide default values for props when necessary.
   - Use `defineModel` to create a two-way binding for props when necessary.
   - Use `useTemplateRefs` to create a reference to a DOM element when necessary.
   - Avoid prop drilling at all cost. If a prop is needed in a child component, consider using inject / provide pattern.
   - Only if a prop is needed across multiple features or modules, consider using a global store (e.g., Pinia) to manage the state.

4. **Testing:**
   - Write a unit test using the create_test skill API paragraph for the new component.
   - Ensure that the component is tested for its props, emits, and any other functionality it provides.
