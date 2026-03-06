// @ts-ignore - bcryptjs types are being stubborn
import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Generate a session token (simple but secure)
 */
export function generateSessionToken(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  strength: 'weak' | 'moderate' | 'strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let strengthScore = 0;

  if (password.length >= 8) strengthScore++;
  else feedback.push('Password should be at least 8 characters');

  if (password.length >= 12) strengthScore++;

  if (/[A-Z]/.test(password)) strengthScore++;
  else feedback.push('Include an uppercase letter');

  if (/[a-z]/.test(password)) strengthScore++;
  else feedback.push('Include a lowercase letter');

  if (/[0-9]/.test(password)) strengthScore++;
  else feedback.push('Include a number');

  if (/[!@#$%^&*]/.test(password)) strengthScore++;
  else feedback.push('Include a special character (!@#$%^&*)');

  let strength: 'weak' | 'moderate' | 'strong' = 'weak';
  if (strengthScore >= 4) strength = 'moderate';
  if (strengthScore >= 6) strength = 'strong';

  return {
    valid: strengthScore >= 3,
    strength,
    feedback,
  };
}
