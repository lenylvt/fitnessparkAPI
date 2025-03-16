import { NextRequest, NextResponse } from "next/server";
import { findNumberFromSignature } from "@/app/utils/payload";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; signature: string; timestamp: string; version: string } }
) {
  try {
    const { id, signature, timestamp, version } = params;

    if (!["QR1", "QR2"].includes(version)) {
      return NextResponse.json(
        { error: "Version invalide. Utilisez QR1 ou QR2" },
        { status: 400 }
      );
    }

    const number = findNumberFromSignature(
      signature,
      version as "QR1" | "QR2",
      id,
      parseInt(timestamp)
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
        sg: signature,
        t: parseInt(timestamp),
        v: version
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 