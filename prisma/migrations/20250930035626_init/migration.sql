-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'RECYCLER', 'ARTISAN', 'MANUFACTURER');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PLASTIC', 'ORGANIC', 'CONSTRUCTION', 'EWASTE');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('KG', 'TONNES', 'PIECES', 'LITERS', 'BAGS');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AVAILABLE', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "materialType" "MaterialType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" "Unit" NOT NULL,
    "location" TEXT NOT NULL,
    "images" TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "views" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Listing_userId_idx" ON "Listing"("userId");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_materialType_idx" ON "Listing"("materialType");

-- CreateIndex
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
