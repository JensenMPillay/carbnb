/*
  Warnings:

  - Added the required column `trueColor` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `brand` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Brand" AS ENUM ('ACURA', 'ALFA_ROMEO', 'ALPINE', 'ASTON_MARTIN', 'AUSTIN', 'BYD', 'BENTLEY', 'BUICK', 'BUGATTI', 'BMW', 'CHEVROLET', 'CITROEN', 'DACIA', 'DATSUN', 'DELOREAN', 'FERRARI', 'FIAT', 'FORD', 'GENESIS', 'GMC', 'HONDA', 'HUMMER', 'HYUNDAI', 'HUDSON', 'INFINITI', 'ISUZU', 'IVECO', 'JAGUAR', 'JEEP', 'KIA', 'LADA', 'LAMBORGHINI', 'LAND_ROVER', 'LANCIA', 'LOTUS', 'MASERATI', 'MAYBACH', 'MAZDA', 'MCLAREN', 'MERCEDES_BENZ', 'MERCURY', 'MINI', 'MITSUBISHI', 'NISSAN', 'OPEL', 'PEUGEOT', 'PLYMOUTH', 'PONTIAC', 'PORSCHE', 'RENAULT', 'ROLLS_ROYCE', 'SAAB', 'SATURN', 'SEAT', 'SKODA', 'SMART', 'SUBARU', 'SUZUKI', 'TESLA', 'TOYOTA', 'TRIUMPH', 'VAUXHALL', 'VOLKSWAGEN', 'VOLVO');

-- CreateEnum
CREATE TYPE "public"."Color" AS ENUM ('AQUA', 'BEIGE', 'BLACK', 'BLUE', 'BROWN', 'FUCHSIA', 'GREEN', 'GREY', 'LIME', 'MAROON', 'NAVY', 'OLIVE', 'ORANGE', 'PINK', 'PURPLE', 'RED', 'SILVER', 'TEAL', 'VIOLET', 'WHITE', 'YELLOW');

-- AlterTable
ALTER TABLE "public"."Car" ADD COLUMN     "primaryColor" "public"."Color" NOT NULL DEFAULT 'SILVER',
ADD COLUMN     "trueColor" TEXT NOT NULL,
DROP COLUMN "brand",
ADD COLUMN     "brand" "public"."Brand" NOT NULL;
