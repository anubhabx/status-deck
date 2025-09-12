-- AlterTable
ALTER TABLE "public"."Monitor" ALTER COLUMN "interval" SET DEFAULT '*/10 * * * *',
ALTER COLUMN "interval" SET DATA TYPE TEXT;
