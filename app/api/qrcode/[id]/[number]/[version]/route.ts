import { NextRequest, NextResponse } from "next/server";
import { generateQRCodePayload, getEpochPlusOneMinute } from "@/app/utils/payload";
import QRCode from "qrcode";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; number: string; version: "QR1" | "QR2" } }
) {
  try {
    const { id, number, version } = params;
    
    if (!["QR1", "QR2"].includes(version)) {
      return NextResponse.json(
        { error: "Version invalide. Utilisez QR1 ou QR2" },
        { status: 400 }
      );
    }

    const payload = generateQRCodePayload(id, number, getEpochPlusOneMinute(), version as "QR1" | "QR2");
    const qrCodeBuffer = await QRCode.toBuffer(payload, {
      width: 205,
      margin: 2,
    });

    const publicDir = path.join(process.cwd(), "public");
    const fileName = `qrcode-${id}-${number}-${version}.png`;
    const filePath = path.join(publicDir, fileName);

    await writeFile(filePath, qrCodeBuffer);

    return NextResponse.json({
      success: true,
      path: `/qrcode-${id}-${number}-${version}.png`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 