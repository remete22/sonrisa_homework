# Sonrisa Homerwork

## Requirement

We want users to be able to set up alerts so they get notified when
something important happens in the world — like breaking news, market
movements, natural disasters, that kind of thing. Should work for both email
and Slack. Make it flexible enough that we can add more channels later.
We need an admin view too.

## Project setup

**Nuxt 4 and Vue:** A battle tested framework using Nitro to start a Node server. Will be needed to keep app secrets truly secret and manage slack and email services.

**Pinia:** A modern state management library that is most commonly used with Vue and Nuxt.

**Tailwind:** An industry standard styling solution. Whoever picks up the project to develop it further should be able to use this out of the box.

**shadcn:** A clean modern UI library that will make the admin feel slick while cutting down development time.

**@nuxt/icon:** The standard icon solution for Nuxt project. Will use in conjection with FontAwesome free tier for the MVP.

**esLint:** The industry standard for linting.

**vitest:** A testing library that is commonly coupled with Nuxt projects.

**@sidebase/nuxt-auth**: An authentication service that will protect the admin

**Prisma**: An ORM that will handle database schemas and make sql queries that looks and feels like

**SQLight**: A lightweight sql database that stores data locally. It's only for MVP, production should use sql database stored in cloud.

## Prepare AI tool

Write basic rules that the AI assistant should follow

## Create basic setup

Create the eslint rules, configure sidebase auth, create the local database based on the prisma schema below.

## Create the admin

The requirement calls for an admin site where the user can add, edit, disable, delete news channels. This should be protected by a username password handled by nuxt-auth.

**Database schemas:**

model Roles: {
id Int @id @default(autoincrement())
name String @unique // USER, ADMIN
users Users[]
}

model Users: {
userId Int @id @default(autoincrement())
email String @unique
password String
roleId: Int // Foreign key for Roles
role Roles @relation(fields: [roleId], references: [id])
subscription: Subscriptions @relation(fields: [subscriptionId], references: [subscriptionId])
logs Logs[]
isActive Boolean @default(true)
}

model NewsChannels: {
channelId: Int @id @default(autoincrement())
name: String
url: String
secret: String? // API key / token / password whichever is needed
username: String?
isActive Boolean @default(true)
createdAt DateTime @default(now())
subscriptions Subscriptions[],
logs Logs[]
}

model SubscriptionMethods: {
methodId Int @id @default(autoincrement())
methodName String @unique // EMAIL, SLACK
}

model Subscriptions: {
subscriptionId: Int @id @default(autoincrement())
userId Int @unique // Foregin key for Users
users Users @relation(fields: [userId], references: [userId])
channels NewsChannels[]
methodId Int
method SubscriptionMethods @relation(fields: [methodId], references: [methodId])
}

model Logs: {
logId Int @id @default(autoincrement())
userId Int // Foreign key for Users
user Users @relation(fields: [userId], references: [userId])
channelId Int // Foreign key for Channels
channel NewsChannels @relation(fields: [channelId], references: [channelId])
status String
error String?
createdAt DateTime @default(now())
}

## Create the notification service

A user should get a notification for the chosen topics vie the chosen method for all subscriptions whenever a new news arrives. For this a polling is needed. This isn't the best scaling soluition so strongly advised to replace it witha webhook solution later.
