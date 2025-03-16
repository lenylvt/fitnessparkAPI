import { NextRequest, NextResponse } from "next/server";
import { generateQRCodePayload, getEpochPlusOneMinute, verifySignature } from "@/app/utils/payload";
import QRCode from "qrcode";
import { config } from "@/app/utils/config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; signature: string; timestamp: string; version: "QR1" | "QR2" } }
) {
  try {
    const { id, signature, timestamp, version } = params;
    const targetNumber = config.originalNumber;

    if (!["QR1", "QR2"].includes(version)) {
      return NextResponse.json(
        { error: "Version invalide. Utilisez QR1 ou QR2" },
        { status: 400 }
      );
    }

    if (!targetNumber) {
      return NextResponse.json(
        { error: "Numéro original non configuré" },
        { status: 500 }
      );
    }

    const isValid = verifySignature(
      signature,
      version as "QR1" | "QR2",
      id,
      parseInt(timestamp),
      targetNumber
    );

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "La signature ne correspond pas au number attendu",
      });
    }

    // Générer un nouveau QR code
    const newTimestamp = getEpochPlusOneMinute();
    const newPayload = generateQRCodePayload(id, targetNumber, newTimestamp, version as "QR1" | "QR2");
    
    const qrCodeBuffer = await QRCode.toBuffer(newPayload, {
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