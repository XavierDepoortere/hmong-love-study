import { createHash } from "crypto";

export function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "127.0.0.1";
}

export function validateAge(age: number): boolean {
  return age >= 13 && age <= 99;
}

export type FormData = {
  sexe: "HOMME" | "FEMME" | "AUTRE";
  age: number;
  ville?: string;
  q1_usage: "REGULIEREMENT" | "PARFOIS" | "RAREMENT" | "JAMAIS";
  q2_interet: "OUI" | "NON" | "PEUT_ETRE";
  q3_pourquoi?: string;
  q4_culture: "TRES_IMPORTANTE" | "ASSEZ_IMPORTANTE" | "PEU" | "PAS_DU_TOUT";
  q5_culture_features: string[];
  q6_features: string[];
  q7_fuir?: string;
  q8_rester?: string;
  q9_style: "MODERNE_FUN" | "TRADITIONNEL_ELEGANT" | "LES_DEUX";
  q10_accroche: "SERIEUSE" | "FUN" | "CULTURELLE" | "ROMANTIQUE";
  langue: string;
  hadLocal: boolean;
};
