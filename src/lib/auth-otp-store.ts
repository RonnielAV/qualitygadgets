export interface OtpEntry {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  email: string;
}

// Global server-side singleton map for OTP validation
declare global {
  var __qg_otp_store__: Map<string, OtpEntry> | undefined;
}

export const otpStore: Map<string, OtpEntry> =
  global.__qg_otp_store__ || (global.__qg_otp_store__ = new Map<string, OtpEntry>());
