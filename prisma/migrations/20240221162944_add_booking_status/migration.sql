/*
  Warnings:

  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REFUSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PaymentStatus" ADD VALUE 'VALIDATED';
ALTER TYPE "public"."PaymentStatus" ADD VALUE 'WAITING';

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "status" "public"."BookingStatus" NOT NULL;
