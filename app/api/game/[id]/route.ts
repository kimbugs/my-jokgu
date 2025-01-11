import { NextResponse } from "next/server";
import prisma from "../../../../lib/db"; // Prisma 클라이언트를 사용하는 경우 경로 설정

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 해당 게임 결과 조회
    const gameResult = await prisma.gameResult.findUnique({
      where: { id },
      select: {
        winPlayerIds: true,
        lossPlayerIds: true,
        date: true,
      },
    });

    if (!gameResult) {
      return NextResponse.json(
        { message: "Game result not found" },
        { status: 404 }
      );
    }

    const year = gameResult.date.getFullYear();
    const winPlayerIds = gameResult.winPlayerIds;
    const lossPlayerIds = gameResult.lossPlayerIds;

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

    // 게임 결과 삭제
    await prisma.gameResult.delete({
      where: { id },
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
            (winsByYear[year] || 0) -
            (winPlayerIds.includes(player.id) ? 1 : 0),
        };

        const updatedLossesByYear = {
          ...lossesByYear,
          [year]:
            (lossesByYear[year] || 0) -
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

    return NextResponse.json(
      { message: "Game result deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting game result:", error);
    return NextResponse.json(
      { error: "Failed to delete game result" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { date, winPlayerIds, lossPlayerIds } = await req.json();
    if (
      !date ||
      !Array.isArray(winPlayerIds) ||
      !Array.isArray(lossPlayerIds)
    ) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }
    // 해당 게임 결과 조회
    const gameResult = await prisma.gameResult.findUnique({
      where: { id },
      select: {
        winPlayerIds: true,
        lossPlayerIds: true,
        date: true,
      },
    });

    if (!gameResult) {
      return NextResponse.json(
        { message: "Game result not found" },
        { status: 404 }
      );
    }

    // 기존 승리/패배 팀 플레이어 ID
    const oldWinPlayerIds = gameResult.winPlayerIds;
    const oldLossPlayerIds = gameResult.lossPlayerIds;

    const year = gameResult.date.getFullYear();

    // 전체 플레이어를 가져옵니다.
    const players = await prisma.player.findMany({
      where: {
        id: {
          in: [...oldWinPlayerIds, ...oldLossPlayerIds], // 승패에 연관된 플레이어만 가져옵니다.
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
            (winsByYear[year] || 0) -
            (oldWinPlayerIds.includes(player.id) ? 1 : 0),
        };

        const updatedLossesByYear = {
          ...lossesByYear,
          [year]:
            (lossesByYear[year] || 0) -
            (oldLossPlayerIds.includes(player.id) ? 1 : 0),
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

    // 게임 결과 업데이트
    const updatedGame = await prisma.gameResult.update({
      where: { id },
      data: {
        date: new Date(date),
        winPlayerIds: {
          set: winPlayerIds,
        },
        lossPlayerIds: {
          set: lossPlayerIds,
        },
      },
    });

    // 전체 플레이어를 가져옵니다.
    const newPlayers = await prisma.player.findMany({
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
      ...newPlayers.map((player) => {
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

    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error) {
    console.error("Error updating game result:", error);
    return NextResponse.json(
      { error: "Failed to update game result" },
      { status: 500 }
    );
  }
}
