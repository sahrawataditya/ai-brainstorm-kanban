import BoardPage from "@/components/boards/BoardPage";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import Card from "@/models/Card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getBoard(userId) {
  await dbConnect();

  const board = await Board.findOne({ userId }).lean();
  const cards = await Card.find({ boardId: board._id }).lean();

  return {
    board: JSON.parse(JSON.stringify(board)),
    cards: JSON.parse(JSON.stringify(cards)),
  };
}

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token.value);
  if (!decoded) {
    redirect("/login");
  }

  const { board, cards } = await getBoard(decoded.userId);

  return <BoardPage initialBoard={board} initialCards={cards} />;
}
