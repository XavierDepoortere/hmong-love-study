import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIP, getClientIP, validateAge, FormData } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    // Validation de l'âge
    if (!validateAge(body.age)) {
      return NextResponse.json(
        { status: "error", message: "Invalid age" },
        { status: 400 }
      );
    }

    // Hash de l'IP
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    // Enregistrement de la réponse
    await prisma.response.create({
      data: {
        ipHash,
        sexe: body.sexe,
        age: body.age,
        ville: body.ville || "",
        q1_usage: body.q1_usage,
        q2_interet: body.q2_interet,
        q3_pourquoi: body.q3_pourquoi || null,
        q4_culture: body.q4_culture,
        q5_culture_features: body.q5_culture_features,
        q6_features: body.q6_features,
        q7_fuir: body.q7_fuir || null,
        q8_rester: body.q8_rester || null,
        q9_style: body.q9_style,
        q10_accroche: body.q10_accroche,
        langue: body.langue,
      },
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
