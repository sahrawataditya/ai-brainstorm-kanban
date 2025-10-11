import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Card from "@/models/Card";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const board = await Board.findOne({ userId });
    const cards = await Card.find({ boardId: board._id });

    return NextResponse.json({ board, cards });
  } catch (error) {
    console.error("Error fetching board:", error);
    return NextResponse.json(
      { error: "Failed to fetch board" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { columns } = await request.json();

    const board = await Board.findOneAndUpdate(
      { userId },
      { columns, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json({ board });
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { error: "Failed to update board" },
      { status: 500 }
    );
  }
}
