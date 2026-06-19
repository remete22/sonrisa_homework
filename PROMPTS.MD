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

Now go for the auth flow:
1. Config sidebase auth for credentials (email, password)
2. Create the catch all server/api/auth/[...].ts
3. Create a login page in pages/login with email password fields, a keep me logged in checkbox and a login button. Use shadcn for the components. This page isn't protected by auth use definePageMeta to setup this. Use sidebase auth middleware.

**Logic:**

The admin will need an authentication flow and the easiest way to set this up with a robust and battle tested library like @sidebase/nuxt-auth

**Answer 4:**

Created 4 todos:
1. Explore current project state
2. Configure sidebase auth with vredentials
3. Create auth catch-all API route
4. Create login page with shadcn components

Had to stop the running in the middle and revert all changes and modify teh prompt beacuse it started to generate server code into app folder adn started to create uneccessary config files.

----

**Prompt 5:**

Let's implement the Auth flow immediately, keeping in mind this is a strict Nuxt 4 application layer structure. 

Do NOT generate any configuration files, and do NOT use Shadcn CLI. Write pure, standard inline Tailwind CSS for the UI so it works out of the box.

Please generate the following files with these exact paths:

1. **`nuxt.config.ts` Update:**
Configure `@sidebase/nuxt-auth` to use the `local` provider with a credentials strategy. Ensure the module is properly registered.

2. **`server/api/auth/[...].ts` (Server Side):**
Create the catch-all auth handler using `NuxtAuthHandler`. Inside the `authorize` function, look up the user using `usePrisma()`, and verify their password against the seeded credentials using Node's native `crypto` module.

3. **`app/pages/login.vue` (Client Side):**
Create the login page inside the Nuxt 4 frontend directory (`app/pages/`). 
- Include email, password, a "Keep me logged in" checkbox, and a login button using standard HTML elements styled with inline Tailwind classes.
- Use `definePageMeta({ auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' } })` to set up the sidebase auth middleware behavior for this page.

Do not create a tailwind config just use the tailwind 4 Nuxt integration method

Give me the complete, production-ready code for these files now so we can test the `npm run dev` environment immediately.

**Logic:**

The more precise prompt should prevent bad folder and config creation

**Answer 5:**

Created 4 todos:
1. Update nuxt.config.ts with auth
2. Create catch-all handler
3. Create login page
4. Add AUTH_secret and fix app.vue

----

**Prompt 6:**

make the app redirect to login when auth fails

**Logic:**

Setting global middleware for unauthenticated users

**Answer 6:**

Made the requested change. Had to manually update nuxt.config it was faulty.

----

**Prompt 7:**

the login ran into an issue:
[@sidebase/nuxt-auth] Recursion detected at /session. Have you set the correct auth.baseURL?

The config seems to be correct but Nuxt doesn't seem to find the session

**Logic:**

Tried to check on the work by visiting the login page on the dev server but failed to do so. Checked the Nitro's console log and saw that sidebase wantod to visit /session instead /api/auth/session

**Answer 7:**

Tried to solve the issue but failed. I had to stop it after a while and put auth on hold.

----

**Prompt 8:**

Auth doesn't seem to work right now. Remove sidebase-auth from teh project entirely. Remove the login page we will focus on auth later just create a defaultLayout in /app/layouts and and index page in /pages with empty content

**Logic:**

Sidebase auth started to cause more problems than it solves. As i was running out of time and tokens i had to stop it and focus on teh real solution.

**Answer 8:**

created 5 todos:
1. Remove sidebase-auth
2. Clean nuxt.config.ts and auth config
3. Create deault layout
4. Create index page

Removed sidebase auth and all server routes. Deleted the packages and the login page. Created teh layout and the index page.

----

**Prompt 9:**

Now let's create the core of the feature. Check #file:TODO.MD for details and grill me if you have any questions. FOllow these steps:

Create a get API for new-channels under /server/api/v1/channels. This should retur all the channels
Create a get API under /server/api/v1/channels/[id]. This should a channel based on id
Create a put and patch API at /server/api/v1/channels. These should create or modify a channel based on id
Create a component: PageHeader: It should include a searchBar that filters through the existing channels and a create new channel button.
Create a modal that opens when the button is created. There the user can add all information about the channel. Use the #file:schema.prisma for fields.
Create a channelList component that lists all the channels. There should be a pencil icon and a trashcan icon on all of them. clicking the pencil opens the channel modal and prefills it with the data. clicking the trashcan opens a confirmation modal. If confirmed it soft deletes the channel. sets isActive to false.

**Logic:**

The main channel logic build up with the grill me skill to make it 100% as i want it.

**Answer 9:**

Asked a few questions and after answering those started to work.