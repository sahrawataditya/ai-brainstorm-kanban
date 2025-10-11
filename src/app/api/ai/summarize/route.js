import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Card from "@/models/Card";
import { authenticateRequest } from "@/lib/auth";
import { summarizeBoard } from "@/lib/gemini";

export async function POST(request) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { boardId } = await request.json();

    const cards = await Card.find({ boardId });

    if (cards.length === 0) {
      return NextResponse.json({
        themes: [],
        topIdeas: [],
        nextSteps: ["Add some cards to get started"],
      });
    }

    const summary = await summarizeBoard(cards);

    await Board.findByIdAndUpdate(boardId, {
      aiSummary: {
        ...summary,
        generatedAt: new Date(),
      },
      updatedAt: new Date(),
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error summarizing board:", error);
    return NextResponse.json(
      { error: "Failed to summarize board" },
      { status: 500 }
    );
  }
}
