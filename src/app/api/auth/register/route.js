import { generateToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Board from "@/models/Board";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    await Board.create({
      userId: user._id,
      title: `${username}'s Board`,
      columns: [
        { id: "ideas", title: "Ideas", cardIds: [], color: "#3B82F6" },
        {
          id: "in-progress",
          title: "In Progress",
          cardIds: [],
          color: "#F59E0B",
        },
        { id: "completed", title: "Completed", cardIds: [], color: "#10B981" },
      ],
    });

    const token = generateToken(user._id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
