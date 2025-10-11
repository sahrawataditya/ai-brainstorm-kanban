import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";
import { authenticateRequest } from "@/lib/auth";
import { clusterCards } from "@/lib/gemini";

export async function POST(request) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { boardId } = await request.json();

    const cards = await Card.find({ boardId });

    if (cards.length < 2) {
      return NextResponse.json({
        clusters: [],
        message: "Need at least 2 cards to cluster",
      });
    }

    const clusters = await clusterCards(cards);

    for (const cluster of clusters.clusters) {
      await Card.updateMany(
        { _id: { $in: cluster.cardIds } },
        {
          clusterId: cluster.name,
          color: cluster.color,
          updatedAt: new Date(),
        }
      );
    }

    return NextResponse.json(clusters);
  } catch (error) {
    console.error("Error clustering cards:", error);
    return NextResponse.json(
      { error: "Failed to cluster cards" },
      { status: 500 }
    );
  }
}
