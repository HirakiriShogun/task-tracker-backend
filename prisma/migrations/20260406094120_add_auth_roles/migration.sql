-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "WorkspaceMember" ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER';

UPDATE "User"
SET "passwordHash" = ''
WHERE "passwordHash" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "passwordHash" SET NOT NULL;

WITH ranked_members AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "workspaceId"
            ORDER BY "joinedAt" ASC, "id" ASC
        ) AS row_number
    FROM "WorkspaceMember"
)
UPDATE "WorkspaceMember" AS wm
SET "role" = 'OWNER'
FROM ranked_members rm
WHERE wm."id" = rm."id"
  AND rm.row_number = 1;
