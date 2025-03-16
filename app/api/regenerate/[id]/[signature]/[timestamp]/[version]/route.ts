import { NextRequest, NextResponse } from "next/server";
import { generateQRCodePayload } from "@/app/utils/payload";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; signature: string; timestamp: string; version: "QR1" | "QR2" } }
) {
  try {
    const { id, signature, timestamp, version } = params;

    if (!["QR1", "QR2"].includes(version)) {
      return NextResponse.json(
        { error: "Version invalide. Utilisez QR1 ou QR2" },
        { status: 400 }
      );
    }

    // Générer le QR code directement avec les données fournies
    const payload = {
      id,
      sg: signature,
      t: parseInt(timestamp),
      v: version
    };

    const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(payload), {
      type: 'png',
      width: 500,
      margin: 4,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Renvoyer directement l'image
    return new NextResponse(qrCodeBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 