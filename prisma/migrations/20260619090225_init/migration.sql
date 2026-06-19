-- CreateTable
CREATE TABLE "Roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsChannels" (
    "channelId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT,
    "username" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SubscriptionMethods" (
    "methodId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "methodName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "subscriptionId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "methodId" INTEGER NOT NULL,
    CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscriptions_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "SubscriptionMethods" ("methodId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Logs" (
    "logId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Logs_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "NewsChannels" ("channelId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_NewsChannelsToSubscriptions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_NewsChannelsToSubscriptions_A_fkey" FOREIGN KEY ("A") REFERENCES "NewsChannels" ("channelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_NewsChannelsToSubscriptions_B_fkey" FOREIGN KEY ("B") REFERENCES "Subscriptions" ("subscriptionId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionMethods_methodName_key" ON "SubscriptionMethods"("methodName");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_userId_key" ON "Subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_NewsChannelsToSubscriptions_AB_unique" ON "_NewsChannelsToSubscriptions"("A", "B");

-- CreateIndex
CREATE INDEX "_NewsChannelsToSubscriptions_B_index" ON "_NewsChannelsToSubscriptions"("B");
