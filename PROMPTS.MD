# AI Prompt History & Course Correction Log

AI tool:
GitHub Copilot - Claude 4.6 Sonnet 

## Log

**Prompt 1:**

check if all and every dependencies are installed and configured correctly from #file:TODO.MD
Prisma is in the wrong place. Move it from lib to server/utils and remove the lib library

**Logic:**

Nuxt auto installer placed the prisma.ts file in the wrong place and i wanted to be sure that every other config is right

**Answer 1:**

Created 4 todos:
1. Audit installed dependencies
2. Check configuration files
3. Move Prisma to server/api/utils
4. Remove lib directory

----

**Prompt 2:**

now initialize the prisma client with the scheme from #file:TODO.MD and create a local sqlight database. Seed it with a test user:
email: test@user.com
password: test123
role: admin

no subscription and log yet

**Logic:**

Dev server won't start until prisma is initializes so i cannot check any progress

**Answer 2:**

Created 4 todos:
1. Update Prisma schema with TODO.MD models
2. Fix Prisma cleint import path
3. Create seed file with admin user
4. Run migration and seed database

Did all the tasks layed out after a bit of thinking and iterating.

----

**Prompt 3:**

Why did you need dotenv in a Nuxt app? use Runtimeconfig

**Logic:**

After checking the config realized AI added dotenv while Nuxt provides access to env variables vis runtimeConfig

**Answer 3:**

Found the prisma files using dotenv and fixed the issue. I had to remove dotenv manually.


----

**Prompt 4:**


**Logic:**


**Answer 3:**


