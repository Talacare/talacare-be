/*
  Warnings:

  - The primary key for the `GameHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GameHistory" DROP CONSTRAINT "GameHistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GameHistory_id_seq";
