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
  // If we have a known number, test it first
  if (knownNumber && verifySignature(targetSignature, version, id, timestamp, knownNumber)) {
    return knownNumber;
  }

  // The signature is the first 6 characters of the HMAC-SHA256 digest
  // We know the payload format: ${version}+${timestamp}+${id}
  const payload = `${version}+${timestamp}+${id}`;
  
  // Since we know the signature is 6 characters, we can try to find a number that generates this signature
  // We'll use a brute force approach with a reasonable range of numbers
  const maxAttempts = 1000000; // Limit the number of attempts to prevent infinite loops
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Generate a random number (32 bytes = 64 hex characters)
    const number = crypto.randomBytes(32).toString('hex');
    
    if (verifySignature(targetSignature, version, id, timestamp, number)) {
      return number;
    }
    
    attempts++;
  }

  return null;
}; 
