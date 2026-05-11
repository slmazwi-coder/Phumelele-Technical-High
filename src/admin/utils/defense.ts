export interface SafetyResult {
  safe: boolean;
  reason?: string;
}

const FORBIDDEN_KEYWORDS = [
  'fuck', 'shit', 'porn', 'adult', 'sex', 'nude', 'xxx',
  '<script', 'javascript:', 'onerror=', 'onclick=', 'eval(',
  'password:', 'secret:', 'private key',
];

export const checkTextSafety = (text: string): SafetyResult => {
  const lowerText = text.toLowerCase();
  for (const word of FORBIDDEN_KEYWORDS) {
    if (lowerText.includes(word)) {
      return { safe: false, reason: `Inappropriate or malicious content detected: "${word}"` };
    }
  }
  return { safe: true };
};

export const runFullDefenseScan = async (data: any, _context: string): Promise<SafetyResult> => {
  for (const key in data) {
    if (typeof data[key] === 'string') {
      const result = checkTextSafety(data[key]);
      if (!result.safe) return result;
    }
  }
  return { safe: true };
};
