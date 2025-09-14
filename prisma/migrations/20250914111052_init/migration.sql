/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ProjectOwner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProjectOwner" DROP CONSTRAINT "_ProjectOwner_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectOwner" DROP CONSTRAINT "_ProjectOwner_B_fkey";

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name";

-- DropTable
DROP TABLE "public"."_ProjectOwner";

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
