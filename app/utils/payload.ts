import crypto from "crypto";

interface QRCodePayload {
  id: string;
  sg: string;
  t: number;
  v: "QR1" | "QR2";
}

const generateSignature = (version: "QR1" | "QR2", exp: number, id: string, number: string): string => {
  const { createHmac } = crypto;
  const hmac = createHmac("sha256", number);
  const payload = `${version}+${exp}+${id}`;

  return hmac.update(payload).digest("hex").slice(0, 6);
};

export const generateQRCodePayload = (
  id: string,
  number: string,
  exp: number,
  version: "QR1" | "QR2" = "QR2"
): string => {
  const payload: QRCodePayload = {
    id,
    sg: generateSignature(version, exp, id, number),
    t: exp,
    v: version,
  };

  return JSON.stringify(payload);
};

export const getEpochPlusOneMinute = (): number => {
  return Math.floor(Date.now() / 1000) + 60;
};

export const verifySignature = (
  signature: string,
  version: "QR1" | "QR2",
  id: string,
  timestamp: number,
  number: string
): boolean => {
  const hmac = crypto.createHmac("sha256", number);
  const payload = `${version}+${timestamp}+${id}`;
  const generatedSignature = hmac.update(payload).digest("hex").slice(0, 6);
  return generatedSignature === signature;
};

export const findNumberFromSignature = (
  targetSignature: string,
  version: "QR1" | "QR2",
  id: string,
  timestamp: number,
  knownNumber?: string
): string | null => {
  // Si on a un numéro connu, on le teste d'abord
  if (knownNumber && verifySignature(targetSignature, version, id, timestamp, knownNumber)) {
    return knownNumber;
  }

  // Liste des numéros connus à tester
  const knownNumbers = [
    "373dcbdd0c56682f602e609432ceaf35", // Numéro original
    // Ajoutez d'autres numéros connus ici si nécessaire
  ];

  // Tester chaque numéro connu
  for (const number of knownNumbers) {
    if (verifySignature(targetSignature, version, id, timestamp, number)) {
      return number;
    }
  }

  return null;
}; 