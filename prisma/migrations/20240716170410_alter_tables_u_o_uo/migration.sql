/*
  Warnings:

  - The primary key for the `UserOrganisation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organisationId` on the `UserOrganisation` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `UserOrganisation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOrganisation" DROP CONSTRAINT "UserOrganisation_organisationId_fkey";

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserOrganisation" DROP CONSTRAINT "UserOrganisation_pkey",
DROP COLUMN "organisationId",
ADD COLUMN     "orgId" TEXT NOT NULL,
ADD CONSTRAINT "UserOrganisation_pkey" PRIMARY KEY ("userId", "orgId");

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
