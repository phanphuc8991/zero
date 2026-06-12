-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "skills_gained" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "target_audience" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "description" TEXT;
