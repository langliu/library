-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avatar" TEXT,
    "xUrl" TEXT,
    "instagramUrl" TEXT,
    "weiboUrl" TEXT,
    "patreonUrl" TEXT,
    "youtubeUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);
