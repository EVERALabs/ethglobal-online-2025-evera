/*
  Warnings:

  - You are about to drop the column `googleId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `privyDid` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `simple_note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lastNonce` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `walletAddress` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."simple_note" DROP CONSTRAINT "simple_note_userId_fkey";

-- DropIndex
DROP INDEX "public"."user_googleId_key";

-- DropIndex
DROP INDEX "public"."user_privyDid_key";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "googleId",
DROP COLUMN "password",
DROP COLUMN "privyDid",
ADD COLUMN     "lastNonce" TEXT NOT NULL,
ALTER COLUMN "walletAddress" SET NOT NULL;

-- DropTable
DROP TABLE "public"."simple_note";

-- CreateTable
CREATE TABLE "public"."ReservedWallet" (
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "tags" TEXT[],
    "notes" TEXT NOT NULL,

    CONSTRAINT "ReservedWallet_pkey" PRIMARY KEY ("publicKey")
);

-- CreateTable
CREATE TABLE "public"."reserved_wallet_user_access" (
    "userId" TEXT NOT NULL,
    "reservedWalletPublicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reserved_wallet_user_access_pkey" PRIMARY KEY ("userId","reservedWalletPublicKey")
);

-- AddForeignKey
ALTER TABLE "public"."reserved_wallet_user_access" ADD CONSTRAINT "reserved_wallet_user_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reserved_wallet_user_access" ADD CONSTRAINT "reserved_wallet_user_access_reservedWalletPublicKey_fkey" FOREIGN KEY ("reservedWalletPublicKey") REFERENCES "public"."ReservedWallet"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
