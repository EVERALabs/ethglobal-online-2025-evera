/*
  Warnings:

  - You are about to drop the `SimpleNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SimpleNote" DROP CONSTRAINT "SimpleNote_userId_fkey";

-- DropTable
DROP TABLE "public"."SimpleNote";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "walletAddress" TEXT,
    "googleId" TEXT,
    "privyDid" TEXT,
    "role" "public"."UserRole" NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."simple_note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "simple_note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_walletAddress_key" ON "public"."user"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_key" ON "public"."user"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_privyDid_key" ON "public"."user"("privyDid");

-- AddForeignKey
ALTER TABLE "public"."simple_note" ADD CONSTRAINT "simple_note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
