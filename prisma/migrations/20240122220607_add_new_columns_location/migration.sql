/*
  Warnings:

  - Added the required column `postalCode` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
