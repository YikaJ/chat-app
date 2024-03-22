import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const userChats = await prisma.chat.findMany({
    where: {
      userId: session?.user?.id
    },
    select: {
      id: true,
      title: true
    }
  })

  return NextResponse.json({
    Response: {
      Chats: userChats
    }
  })
}