import { prisma } from "./prisma";

interface AssetFilters {
  fromDate?: string;
  toDate?: string;
  requestNo?: string;
}

interface LineItemInput {
  sNo: number;
  description?: string;
  uqc?: string;
  quantity?: string;
  rate?: string;
  amount?: string;
  hsnCode?: string;
}

export interface AssetInput {
  salesType?: string;
  companyCode?: string;
  assetCategory?: string;
  categoryOfUnits?: string;
  entityName?: string;
  assetLocation?: string;
  grossValue?: string;
  wdv?: string;
  costCenter?: string;
  salesValue?: string;
  consignerName?: string;
  consignerAddress?: string;
  consignerPinCode?: string;
  consignerLocation?: string;
  plantCode?: string;
  consignerGSTIN?: string;
  consigneeName?: string;
  consigneeAddress?: string;
  consigneePinCode?: string;
  consigneeLocation?: string;
  consigneeGSTIN?: string;
  consigneeCategoryOfUnits?: string;
  shipToName?: string;
  shipToAddress?: string;
  shipToGSTIN?: string;
  type?: string;
  documentType?: string;
  taxType?: string;
  consigneePlantCode?: string;
  consigneeCostCenter?: string;
  comments?: string;
  farDocuments?: string;
  otherDocuments?: string;
  sourcingApproval?: string;
  dc?: string;
  paymentConfirmation?: string;
  lineItems?: LineItemInput[];
  status?: string;
}

const PAGE_SIZE = 5;

async function getNextRequestNo(): Promise<string> {
  const last = await prisma.asset.findFirst({
    orderBy: { requestNo: "desc" },
    select: { requestNo: true },
  });

  if (!last) return "ASSID008001";

  const num = parseInt(last.requestNo.replace("ASSID", ""), 10);
  return `ASSID${String(num + 1).padStart(6, "0")}`;
}

export async function getAssets(
  userId: string,
  page: number = 1,
  filters?: AssetFilters
) {
  const where: Record<string, unknown> = { userId };

  if (filters?.requestNo) {
    where.requestNo = { contains: filters.requestNo };
  }

  if (filters?.fromDate || filters?.toDate) {
    const createdAt: Record<string, Date> = {};
    if (filters.fromDate) createdAt.gte = new Date(filters.fromDate);
    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59, 999);
      createdAt.lte = to;
    }
    where.createdAt = createdAt;
  }

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { lineItems: true },
    }),
    prisma.asset.count({ where }),
  ]);

  return {
    assets,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getAssetById(id: string) {
  return prisma.asset.findUnique({
    where: { id },
    include: { lineItems: { orderBy: { sNo: "asc" } } },
  });
}

export async function createAsset(userId: string, data: AssetInput) {
  const requestNo = await getNextRequestNo();
  const { lineItems, ...assetData } = data;

  return prisma.asset.create({
    data: {
      ...assetData,
      requestNo,
      status: data.status || "Requestor Saved",
      userId,
      lineItems: lineItems?.length
        ? { create: lineItems }
        : undefined,
    },
    include: { lineItems: true },
  });
}

export async function updateAsset(id: string, data: AssetInput) {
  const { lineItems, ...assetData } = data;

  // Delete existing line items and re-create
  await prisma.lineItem.deleteMany({ where: { assetId: id } });

  return prisma.asset.update({
    where: { id },
    data: {
      ...assetData,
      lineItems: lineItems?.length
        ? { create: lineItems }
        : undefined,
    },
    include: { lineItems: true },
  });
}

export async function deleteAsset(id: string) {
  return prisma.asset.delete({ where: { id } });
}
