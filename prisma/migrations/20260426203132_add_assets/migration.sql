-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestNo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Requestor Saved',
    "salesType" TEXT,
    "companyCode" TEXT,
    "assetCategory" TEXT,
    "categoryOfUnits" TEXT,
    "entityName" TEXT,
    "assetLocation" TEXT,
    "grossValue" TEXT,
    "wdv" TEXT,
    "costCenter" TEXT,
    "salesValue" TEXT,
    "consignerName" TEXT,
    "consignerAddress" TEXT,
    "consignerPinCode" TEXT,
    "consignerLocation" TEXT,
    "plantCode" TEXT,
    "consignerGSTIN" TEXT,
    "consigneeName" TEXT,
    "consigneeAddress" TEXT,
    "consigneePinCode" TEXT,
    "consigneeLocation" TEXT,
    "consigneeGSTIN" TEXT,
    "consigneeCategoryOfUnits" TEXT,
    "shipToName" TEXT,
    "shipToAddress" TEXT,
    "shipToGSTIN" TEXT,
    "type" TEXT,
    "documentType" TEXT,
    "taxType" TEXT,
    "consigneePlantCode" TEXT,
    "consigneeCostCenter" TEXT,
    "comments" TEXT,
    "farDocuments" TEXT,
    "otherDocuments" TEXT,
    "sourcingApproval" TEXT,
    "dc" TEXT,
    "paymentConfirmation" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sNo" INTEGER NOT NULL,
    "description" TEXT,
    "uqc" TEXT,
    "quantity" TEXT,
    "rate" TEXT,
    "amount" TEXT,
    "hsnCode" TEXT,
    "assetId" TEXT NOT NULL,
    CONSTRAINT "LineItem_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_requestNo_key" ON "Asset"("requestNo");
