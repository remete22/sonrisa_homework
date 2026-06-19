----
name: finish_feature
description: FWhenever a feature is finished, run this skill to ensure everything is working as expected.
---

-

When a feature is finshed run teh following commands to ensure everything is working as expected:

```cmd
npm run typecheck
npm run lint
npm run vitest
```

If any of them fails, iterate until they pass.
