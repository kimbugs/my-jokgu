import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export async function POST(req: Request) {
  const { name } = await req.json(); // request body에서 name을 가져옵니다.

  if (!name) {
    return NextResponse.json(
      { message: "Player name is required" },
      { status: 400 }
    );
  }

  try {
    const player = await prisma.player.create({
      data: { name },
    });
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating player" },
      { status: 500 }
    );
  }
}

// GET 메서드 (Player 목록 가져오기)
export async function GET() {
  try {
    const players = await prisma.player.findMany(); // 모든 player를 가져옵니다.
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching players" },
      { status: 500 }
    );
  }
}
