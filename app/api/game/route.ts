import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../lib/db";

export async function POST(req: Request) {
  const { winPlayerIds, lossPlayerIds } = await req.json();

  if (!winPlayerIds || !lossPlayerIds) {
    return NextResponse.json(
      { message: "Missing winPlayerIds or lossPlayerIds" },
      { status: 400 }
    );
  }

  try {
    // GameResult 저장
    const gameResult = await prisma.gameResult.create({
      data: {
        winPlayerIds,
        lossPlayerIds,
      },
    });
    await prisma.$transaction([
      // 승리한 플레이어들의 win 증가, 패배한 플레이어들의 loss 증가
      ...winPlayerIds.map((id: string) =>
        prisma.player.update({
          where: { id },
          data: { win: { increment: 1 } },
        })
      ),
      ...lossPlayerIds.map((id: string) =>
        prisma.player.update({
          where: { id },
          data: { loss: { increment: 1 } },
        })
      ),
    ]);
    return NextResponse.json(gameResult, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to save game result" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  try {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    // 1. 모든 플레이어 정보를 가져옵니다.
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // 2. 게임 결과를 가져옵니다.
    const results = await prisma.gameResult.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // 3. 플레이어 ID를 이름으로 매핑합니다.
    const playerMap = new Map(
      players.map((player) => [player.id, player.name])
    );

    const formattedResults = results.map((result) => ({
      id: result.id,
      date: result.date.toISOString(),
      winPlayers: result.winPlayerIds.map((id) => ({
        id,
        name: playerMap.get(id) || "Unknown",
      })),
      lossPlayers: result.lossPlayerIds.map((id) => ({
        id,
        name: playerMap.get(id) || "Unknown",
      })),
    }));

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching game results:", error);
    return NextResponse.json(
      { error: "Failed to fetch game results" },
      { status: 500 }
    );
  }
}
