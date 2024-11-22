import { NextResponse } from "next/server";
import prisma from "../../../../lib/db"; // Prisma 클라이언트를 사용하는 경우 경로 설정

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    // 해당 게임 결과 조회
    const gameResult = await prisma.gameResult.findUnique({
      where: { id },
      select: {
        winPlayerIds: true,
        lossPlayerIds: true,
      },
    });

    if (!gameResult) {
      return NextResponse.json(
        { message: "Game result not found" },
        { status: 404 }
      );
    }

    // 게임 결과 삭제
    await prisma.gameResult.delete({
      where: { id },
    });

    // 승리한 플레이어들의 win 감소, 패배한 플레이어들의 loss 감소
    await prisma.$transaction([
      ...gameResult.winPlayerIds.map((id) =>
        prisma.player.update({
          where: { id: id },
          data: { win: { decrement: 1 } },
        })
      ),
      ...gameResult.lossPlayerIds.map((id) =>
        prisma.player.update({
          where: { id: id },
          data: { loss: { decrement: 1 } },
        })
      ),
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

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

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

    // 통계 갱신: 기존 팀의 승/패 감소
    await prisma.$transaction([
      ...oldWinPlayerIds.map((playerId) =>
        prisma.player.update({
          where: { id: playerId },
          data: { win: { decrement: 1 } },
        })
      ),
      ...oldLossPlayerIds.map((playerId) =>
        prisma.player.update({
          where: { id: playerId },
          data: { loss: { decrement: 1 } },
        })
      ),
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

    // 통계 갱신: 새로운 팀의 승/패 증가
    await prisma.$transaction([
      ...winPlayerIds.map((playerId) =>
        prisma.player.update({
          where: { id: playerId },
          data: { win: { increment: 1 } },
        })
      ),
      ...lossPlayerIds.map((playerId) =>
        prisma.player.update({
          where: { id: playerId },
          data: { loss: { increment: 1 } },
        })
      ),
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
