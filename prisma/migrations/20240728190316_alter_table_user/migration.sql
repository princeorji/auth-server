-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPwdExp" TIMESTAMP(3),
ADD COLUMN     "resetPwdToken" TEXT;
