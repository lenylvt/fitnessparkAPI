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

// Fonction améliorée pour trouver le "number" à partir d'une signature
export const findNumberFromSignature = (
  targetSignature: string,
  version: "QR1" | "QR2",
  id: string,
  timestamp: number,
  knownNumbers?: string[]
): string | null => {
  // Si nous avons une liste de numbers connus, les tester d'abord
  if (knownNumbers && knownNumbers.length > 0) {
    for (const knownNumber of knownNumbers) {
      if (verifySignature(targetSignature, version, id, timestamp, knownNumber)) {
        return knownNumber;
      }
    }
  }

  // Préparer le payload une seule fois
  const payload = `${version}+${timestamp}+${id}`;
  
  // Approche par dictionnaire avec des patterns connus
  // Si les "numbers" suivent un format particulier ou proviennent d'une source connue
  const commonPatterns = generateCommonPatterns();
  for (const pattern of commonPatterns) {
    if (verifySignature(targetSignature, version, id, timestamp, pattern)) {
      return pattern;
    }
  }

  // Approche par force brute avec plusieurs stratégies
  // 1. Essayer des valeurs complètement aléatoires
  const maxRandomAttempts = 100000;
  for (let i = 0; i < maxRandomAttempts; i++) {
    const randomNumber = crypto.randomBytes(16).toString('hex');
    if (verifySignature(targetSignature, version, id, timestamp, randomNumber)) {
      return randomNumber;
    }
  }

  // 2. Essayer des variantes de patterns connus
  const variantAttempts = 50000;
  for (let i = 0; i < variantAttempts; i++) {
    // Générer des variantes en mutant légèrement les patterns connus
    const basePattern = commonPatterns[i % commonPatterns.length];
    const variant = mutatePattern(basePattern);
    
    if (verifySignature(targetSignature, version, id, timestamp, variant)) {
      return variant;
    }
  }

  // Si on n'a pas trouvé après toutes ces tentatives
  return null;
};

// Fonction pour générer une liste de patterns communs que les "numbers" pourraient suivre
function generateCommonPatterns(): string[] {
  const patterns: string[] = [];
  
  // Exemple: des nombres de 32 caractères hexadécimaux répétitifs
  patterns.push("00000000000000000000000000000000");
  patterns.push("11111111111111111111111111111111");
  patterns.push("ffffffffffffffffffffffffffffffff");
  patterns.push("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  
  // Ajouter d'autres patterns connus ou susceptibles d'être utilisés
  // Par exemple, des valeurs par défaut ou des clés communes
  patterns.push("0123456789abcdef0123456789abcdef");
  patterns.push("abcdef0123456789abcdef0123456789");
  patterns.push("deadbeefdeadbeefdeadbeefdeadbeef");
  patterns.push("cafebabecafebabecafebabecafebabe");
  
  // Générer des hashs MD5 de valeurs communes
  const commonWords = ["password", "admin", "secret", "api", "key", "default", "test", "dev", "prod"];
  for (const word of commonWords) {
    patterns.push(crypto.createHash("md5").update(word).digest("hex"));
  }
  
  // Si vous avez accès à d'autres informations contextuelles, ajoutez des patterns basés sur ces informations
  // Par exemple, si les "numbers" sont générés à partir d'informations connues
  
  return patterns;
}

// Fonction pour muter un pattern existant (changer quelques caractères)
function mutatePattern(pattern: string): string {
  const chars = pattern.split('');
  const hexChars = '0123456789abcdef';
  
  // Modifier 1 à 4 caractères aléatoires
  const mutations = 1 + Math.floor(Math.random() * 4);
  for (let i = 0; i < mutations; i++) {
    const pos = Math.floor(Math.random() * chars.length);
    chars[pos] = hexChars[Math.floor(Math.random() * 16)];
  }
  
  return chars.join('');
}

// Fonction utilitaire pour tester plusieurs nombres connus
export const testKnownNumbers = (
  targetSignature: string,
  version: "QR1" | "QR2",
  id: string,
  timestamp: number,
  numbersFilePath: string
): string | null => {
  // Cette fonction pourrait lire un fichier de "numbers" connus
  // et les tester un par un
  // Note: Implémentation dépend du contexte d'exécution (Node.js, browser, etc.)
  
  // Pseudo-code:
  // const numbers = readNumbersFromFile(numbersFilePath);
  // return findNumberFromSignature(targetSignature, version, id, timestamp, numbers);
  
  return null; // À implémenter selon le contexte
};
