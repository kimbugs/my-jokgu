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
    // 승/패 업데이트할 연도 추출
    const year = new Date().getFullYear();

    // 전체 플레이어를 가져옵니다.
    const players = await prisma.player.findMany({
      where: {
        id: {
          in: [...winPlayerIds, ...lossPlayerIds], // 승패에 연관된 플레이어만 가져옵니다.
        },
      },
      select: {
        id: true,
        winsByYear: true,
        lossesByYear: true,
      },
    });

    // 각 플레이어의 데이터를 업데이트
    await prisma.$transaction([
      ...players.map((player) => {
        // winsByYear와 lossesByYear는 JSON 객체로 저장되어 있으므로, 타입을 명시적으로 캐스팅합니다.
        const winsByYear = player.winsByYear as { [key: number]: number };
        const lossesByYear = player.lossesByYear as { [key: number]: number };

        // 해당 연도의 승리와 패배를 업데이트
        const updatedWinsByYear = {
          ...winsByYear,
          [year]:
            (winsByYear[year] || 0) +
            (winPlayerIds.includes(player.id) ? 1 : 0),
        };

        const updatedLossesByYear = {
          ...lossesByYear,
          [year]:
            (lossesByYear[year] || 0) +
            (lossPlayerIds.includes(player.id) ? 1 : 0),
        };

        return prisma.player.update({
          where: { id: player.id },
          data: {
            winsByYear: updatedWinsByYear,
            lossesByYear: updatedLossesByYear,
          },
        });
      }),
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
