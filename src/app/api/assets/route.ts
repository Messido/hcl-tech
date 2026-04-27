import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAssets, createAsset } from "@/lib/assets";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const page = parseInt(params.get("page") || "1", 10);
  const filters = {
    fromDate: params.get("fromDate") || undefined,
    toDate: params.get("toDate") || undefined,
    requestNo: params.get("requestNo") || undefined,
  };

  const result = await getAssets(session.user.id, page, filters);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const asset = await createAsset(session.user.id, data);
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create asset";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
