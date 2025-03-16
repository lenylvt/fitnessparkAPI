import { NextRequest, NextResponse } from "next/server";
import { generateQRCodePayload, getEpochPlusOneMinute, verifySignature } from "@/app/utils/payload";
import QRCode from "qrcode";
import { writeFile } from "fs/promises";
import path from "path";
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
      width: 205,
      margin: 2,
    });

    const publicDir = path.join(process.cwd(), "public");
    const fileName = `qrcode-${id}-${targetNumber}-${version}.png`;
    const filePath = path.join(publicDir, fileName);

    await writeFile(filePath, qrCodeBuffer);

    return NextResponse.json({
      success: true,
      path: `/${fileName}`,
      number: targetNumber,
      originalSignature: signature,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 