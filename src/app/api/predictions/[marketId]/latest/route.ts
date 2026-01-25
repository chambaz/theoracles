import { NextResponse } from "next/server";
import { getLatestPrediction } from "@/lib/storage/predictions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params;
    const prediction = await getLatestPrediction(marketId);

    if (!prediction) {
      return NextResponse.json(
        { error: "No predictions found for this market" },
        { status: 404 }
      );
    }

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return NextResponse.json(
      { error: "Failed to fetch prediction" },
      { status: 500 }
    );
  }
}
