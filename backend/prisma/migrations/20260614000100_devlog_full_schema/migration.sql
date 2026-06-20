CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "IssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

UPDATE "Project"
SET "status" = CASE
  WHEN upper("status") IN ('ACTIVE', 'PAUSED', 'COMPLETED') THEN upper("status")
  ELSE 'ACTIVE'
END;

ALTER TABLE "Project"
  ALTER COLUMN "status" TYPE "ProjectStatus" USING "status"::"ProjectStatus",
  ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

CREATE TABLE "Issue" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" "IssueSeverity" NOT NULL,
  "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
  "projectId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CodingSession" (
  "id" SERIAL NOT NULL,
  "projectId" INTEGER NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "hours" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,

  CONSTRAINT "CodingSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Issue_projectId_idx" ON "Issue"("projectId");
CREATE INDEX "Issue_status_idx" ON "Issue"("status");
CREATE INDEX "Issue_severity_idx" ON "Issue"("severity");
CREATE INDEX "CodingSession_projectId_idx" ON "CodingSession"("projectId");
CREATE INDEX "CodingSession_date_idx" ON "CodingSession"("date");

ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CodingSession" ADD CONSTRAINT "CodingSession_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
