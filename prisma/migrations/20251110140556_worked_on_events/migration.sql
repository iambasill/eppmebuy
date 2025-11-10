-- AlterTable
ALTER TABLE "events" ALTER COLUMN "is_online" SET DEFAULT 'false',
ALTER COLUMN "is_online" SET DATA TYPE TEXT,
ALTER COLUMN "latitude" SET DATA TYPE TEXT,
ALTER COLUMN "longitude" SET DATA TYPE TEXT,
ALTER COLUMN "total_capacity" SET DATA TYPE TEXT,
ALTER COLUMN "age_restriction" SET DATA TYPE TEXT,
ALTER COLUMN "vip_fee" SET DATA TYPE TEXT,
ALTER COLUMN "host_fee_fixed" SET DATA TYPE TEXT,
ALTER COLUMN "ticket_limit_per_order" DROP NOT NULL,
ALTER COLUMN "ticket_limit_per_order" SET DEFAULT '10',
ALTER COLUMN "ticket_limit_per_order" SET DATA TYPE TEXT;
