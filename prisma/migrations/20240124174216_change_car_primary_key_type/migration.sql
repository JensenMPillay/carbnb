/*
  Warnings:

  - The primary key for the `Car` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_carId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "carId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Car" DROP CONSTRAINT "Car_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Car_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Car_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
