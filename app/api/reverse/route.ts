import { NextRequest, NextResponse } from "next/server";
import { findNumberFromSignature } from "@/app/utils/payload";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, sg, t, v } = body;

    if (!id || !sg || !t || !v) {
      return NextResponse.json(
        { error: "Données manquantes. Format attendu: { id, sg, t, v }" },
        { status: 400 }
      );
    }

    if (!["QR1", "QR2"].includes(v)) {
      return NextResponse.json(
        { error: "Version invalide. Utilisez QR1 ou QR2" },
        { status: 400 }
      );
    }

    const number = findNumberFromSignature(
      sg,
      v as "QR1" | "QR2",
      id.toString(),
      t
    );

    if (!number) {
      return NextResponse.json(
        { error: "Impossible de retrouver le numéro original" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      number,
      originalData: {
        id,
        sg,
        t,
        v
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 