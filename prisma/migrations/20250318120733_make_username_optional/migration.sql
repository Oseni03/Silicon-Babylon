-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL;
