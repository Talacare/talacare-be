/*
  Warnings:

  - Changed the type of `gameType` on the `GameHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('PUZZLE', 'JUMP_N_JUMP');

-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "gameType",
ADD COLUMN     "gameType" "GameType" NOT NULL;
