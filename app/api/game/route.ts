import { NextResponse } from "next/server";
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
      ...winPlayerIds.map((id: any) =>
        prisma.player.update({
          where: { id },
          data: { win: { increment: 1 } },
        })
      ),
      ...lossPlayerIds.map((id: any) =>
        prisma.player.update({
          where: { id },
          data: { loss: { increment: 1 } },
        })
      ),
    ]);
    return NextResponse.json(gameResult, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save game result" },
      { status: 500 }
    );
  }
}
