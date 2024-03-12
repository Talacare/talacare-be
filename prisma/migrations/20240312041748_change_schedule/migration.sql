/*
  Warnings:

  - You are about to drop the column `remindTime` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `hour` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minute` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "remindTime",
ADD COLUMN     "hour" INTEGER NOT NULL,
ADD COLUMN     "minute" INTEGER NOT NULL;
