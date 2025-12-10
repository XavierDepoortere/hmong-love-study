import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIP, getClientIP } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    const existing = await prisma.response.findFirst({
      where: { ipHash },
    });

    return NextResponse.json({
      alreadyAnswered: !!existing,
    });
  } catch (error) {
    console.error("Check IP error:", error);
    return NextResponse.json({ alreadyAnswered: false }, { status: 500 });
  }
}
