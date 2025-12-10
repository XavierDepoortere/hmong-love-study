import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;

  if (!password || authHeader !== `Bearer ${password}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const responses = await prisma.response.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sexe: true,
        age: true,
        ville: true,
        q1_usage: true,
        q2_interet: true,
        q3_pourquoi: true,
        q4_culture: true,
        q5_culture_features: true,
        q6_features: true,
        q7_fuir: true,
        q8_rester: true,
        q9_style: true,
        q10_accroche: true,
        langue: true,
        createdAt: true,
      },
    });

    const totalResponses = responses.length;

    const sexeStats = {
      HOMME: responses.filter(r => r.sexe === 'HOMME').length,
      FEMME: responses.filter(r => r.sexe === 'FEMME').length,
      AUTRE: responses.filter(r => r.sexe === 'AUTRE').length,
    };

    const q1Stats = {
      REGULIEREMENT: responses.filter(r => r.q1_usage === 'REGULIEREMENT').length,
      PARFOIS: responses.filter(r => r.q1_usage === 'PARFOIS').length,
      RAREMENT: responses.filter(r => r.q1_usage === 'RAREMENT').length,
      JAMAIS: responses.filter(r => r.q1_usage === 'JAMAIS').length,
    };

    const q2Stats = {
      OUI: responses.filter(r => r.q2_interet === 'OUI').length,
      NON: responses.filter(r => r.q2_interet === 'NON').length,
      PEUT_ETRE: responses.filter(r => r.q2_interet === 'PEUT_ETRE').length,
    };

    const q4Stats = {
      TRES_IMPORTANTE: responses.filter(r => r.q4_culture === 'TRES_IMPORTANTE').length,
      ASSEZ_IMPORTANTE: responses.filter(r => r.q4_culture === 'ASSEZ_IMPORTANTE').length,
      PEU: responses.filter(r => r.q4_culture === 'PEU').length,
      PAS_DU_TOUT: responses.filter(r => r.q4_culture === 'PAS_DU_TOUT').length,
    };

    const q5Counts: Record<string, number> = {};
    responses.forEach(r => {
      r.q5_culture_features.forEach(f => {
        q5Counts[f] = (q5Counts[f] || 0) + 1;
      });
    });

    const q6Counts: Record<string, number> = {};
    responses.forEach(r => {
      r.q6_features.forEach(f => {
        q6Counts[f] = (q6Counts[f] || 0) + 1;
      });
    });

    const q9Stats = {
      MODERNE_FUN: responses.filter(r => r.q9_style === 'MODERNE_FUN').length,
      TRADITIONNEL_ELEGANT: responses.filter(r => r.q9_style === 'TRADITIONNEL_ELEGANT').length,
      LES_DEUX: responses.filter(r => r.q9_style === 'LES_DEUX').length,
    };

    const q10Stats = {
      SERIEUSE: responses.filter(r => r.q10_accroche === 'SERIEUSE').length,
      FUN: responses.filter(r => r.q10_accroche === 'FUN').length,
      CULTURELLE: responses.filter(r => r.q10_accroche === 'CULTURELLE').length,
      ROMANTIQUE: responses.filter(r => r.q10_accroche === 'ROMANTIQUE').length,
    };

    const openResponses = {
      q3: responses.filter(r => r.q3_pourquoi).map(r => ({ id: r.id, text: r.q3_pourquoi, date: r.createdAt })),
      q7: responses.filter(r => r.q7_fuir).map(r => ({ id: r.id, text: r.q7_fuir, date: r.createdAt })),
      q8: responses.filter(r => r.q8_rester).map(r => ({ id: r.id, text: r.q8_rester, date: r.createdAt })),
    };

    const averageAge = responses.length > 0
      ? Math.round(responses.reduce((sum, r) => sum + r.age, 0) / responses.length)
      : 0;

    return NextResponse.json({
      totalResponses,
      averageAge,
      sexeStats,
      q1Stats,
      q2Stats,
      q4Stats,
      q5Counts,
      q6Counts,
      q9Stats,
      q10Stats,
      openResponses,
      rawData: responses,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
