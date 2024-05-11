-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ServiceName" AS ENUM ('CLEAN', 'REPAINT', 'REPAIR');

-- CreateEnum
CREATE TYPE "Statuses" AS ENUM ('PENDING_PICK_UP', 'IN_PROGRESS', 'BEING_DELIVERED', 'READY_FOR_COLLECTION', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ServiceMode" AS ENUM ('REGULAR', 'PICK_UP_ONLY', 'DELIVERY_ONLY', 'PICK_UP_AND_DELIVERY');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'E_WALLET');

-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "photoProfile" VARCHAR(300),
    "whatsapp" VARCHAR(20),
    "address" VARCHAR(500),
    "refreshToken" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "otp" (
    "email" VARCHAR(100) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "orders" (
    "orderId" SERIAL NOT NULL,
    "customerName" VARCHAR(100) NOT NULL,
    "userId" INTEGER,
    "itemName" VARCHAR(100) NOT NULL,
    "serviceName" "ServiceName" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "serviceMode" "ServiceMode" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "whatsapp" VARCHAR(20),
    "address" VARCHAR(500) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "statuses" (
    "statusId" SERIAL NOT NULL,
    "statusName" "Statuses" NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "isCurrentStatus" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3),
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("statusId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_refreshToken_key" ON "users"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "otp_email_key" ON "otp"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
