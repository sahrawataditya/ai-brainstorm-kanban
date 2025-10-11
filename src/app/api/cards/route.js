import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Card from "@/models/Card";
import { authenticateRequest } from "@/lib/auth";
import { generateIdeas, generateEmbedding, analyzeMood } from "@/lib/gemini";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");
    const userId = await authenticateRequest(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { content, columnId } = await request.json();

    const board = await Board.findOne({ userId });
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const [suggestions, embedding, mood] = await Promise.all([
      generateIdeas(content),
      generateEmbedding(content),
      analyzeMood(content),
    ]);

    const card = await Card.create({
      boardId: board._id,
      content,
      columnId,
      suggestions,
      embedding,
      mood,
      createdBy: userId,
    });

    const updatedColumns = board.columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col.toObject(),
          cardIds: [...col.cardIds, card._id.toString()],
        };
      }
      return col;
    });

    await Board.findByIdAndUpdate(board._id, {
      columns: updatedColumns,
      updatedAt: new Date(),
    });

    return NextResponse.json({ card });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");
    const userId = await authenticateRequest(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { cardId, content } = await request.json();

    const card = await Card.findByIdAndUpdate(
      cardId,
      { content, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json({ card });
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");
    const userId = await authenticateRequest(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("cardId");

    const card = await Card.findById(cardId);
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const board = await Board.findById(card.boardId);
    const updatedColumns = board.columns.map((col) => ({
      ...col.toObject(),
      cardIds: col.cardIds.filter((id) => id !== cardId),
    }));

    await Board.findByIdAndUpdate(board._id, {
      columns: updatedColumns,
      updatedAt: new Date(),
    });

    await Card.findByIdAndDelete(cardId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}
