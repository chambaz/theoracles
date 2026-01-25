import { NextResponse } from "next/server";
import { getMarket } from "@/lib/storage/markets";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const market = await getMarket(id);

    if (!market) {
      return NextResponse.json(
        { error: "Market not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ market });
  } catch (error) {
    console.error("Error fetching market:", error);
    return NextResponse.json(
      { error: "Failed to fetch market" },
      { status: 500 }
    );
  }
}
