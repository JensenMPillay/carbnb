/*
  Warnings:

  - Added the required column `imageUrl` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `year` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Car" ADD COLUMN     "imageUrl" TEXT NOT NULL,
ALTER COLUMN "year" SET NOT NULL;
