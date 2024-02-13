/*
  Warnings:

  - You are about to drop the column `address_formatted` on the `Location` table. All the data in the column will be lost.
  - Added the required column `formatted_address` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Location" DROP COLUMN "address_formatted",
ADD COLUMN     "formatted_address" TEXT NOT NULL;
