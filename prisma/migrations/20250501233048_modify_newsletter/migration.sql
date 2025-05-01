-- AlterTable
ALTER TABLE "Newsletter" ADD COLUMN     "emailPreferences" JSONB,
ADD COLUMN     "lastEmailSent" TIMESTAMP(3),
ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false;
