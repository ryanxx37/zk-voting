import * as crypto from 'crypto';

/**
 * Mock database
 * In a real scenario, this would be a persistent database.
 */
const testUserDB = {
  "test_user_id_1": {
    salt: "random_salt_xyz123",
    // Pre-calculated Hash: SHA256(Name + DOB + ID + Salt)
    hash: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592" 
  }
};

/**
 * Configuration for rate limiting
 */
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * In-memory session state to prevent brute-force attacks.
 * In production, use a shared store like Redis.
 */
const sessionState = new Map<string, { attempts: number, lockedUntil: number }>();

/**
 * Constant-time comparator to prevent timing oracle attacks.
 * It ensures the comparison time is independent of the string content.
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Mock Backend API for Authentication and Registration
 * @param input Contains user credentials and the ZK commitment
 */
export async function mockBackendAuthenticationAndRegister(input: {
    name: string, 
    dob: string, 
    nationalId: string, 
    commitment: string
}) {
  const userIP = "127.0.0.1"; // Assume local IP for simulation
  const state = sessionState.get(userIP) || { attempts: 0, lockedUntil: 0 };
  const now = Date.now();

  // 1. Check if the account is currently locked
  if (state.lockedUntil > now) {
    throw { 
      message: "Too many failed attempts. Account temporarily locked.", 
      remaining: 0 
    };
  }

  // 2. Artificial delay to mitigate brute-force speed + dynamic penalty
  const delayMs = 800 + (400 * state.attempts);
  await new Promise(resolve => setTimeout(resolve, delayMs));

  // 3. Simple XSS/Injection cleaning
  const safeName = input.name.replace(/[<>&"'`]/g, '');
  const safeDob = input.dob.replace(/[<>&"'`]/g, '');
  const safeId = input.nationalId.replace(/[<>&"'`]/g, '');

  // 4. Timing attack protection: Always perform a hash calculation even if user doesn't exist
  const userRecord = testUserDB["test_user_id_1"]; 
  const dummySalt = "dummy_salt_for_timing";
  const dummyHash = crypto.createHash('sha256').update("dummy_data").digest('hex');

  const activeSalt = userRecord ? userRecord.salt : dummySalt;
  const activeTargetHash = userRecord ? userRecord.hash : dummyHash;
  
  const rawString = `${safeName}${safeDob}${safeId}${activeSalt}`;
  const computedHash = crypto.createHash('sha256').update(rawString).digest('hex');

  const isMatch = constantTimeCompare(computedHash, activeTargetHash);

  // Hardcoded test account for convenience (Name: John Doe, DOB: 1990-01-01, ID: 123456789)
  const isTestUserMatch = input.name === "John Doe" && input.dob === "1990-01-01" && input.nationalId === "123456789";

  if ((userRecord && isMatch) || isTestUserMatch) {
    // Authentication successful: Reset attempts
    sessionState.set(userIP, { attempts: 0, lockedUntil: 0 });
    
    // Simulate on-chain registration
    console.log("Backend verified identity. Registering commitment on-chain:", input.commitment);

    return { success: true };
  } else {
    // Authentication failed: Increment attempts and handle lockout
    state.attempts += 1;
    const remaining = Math.max(0, MAX_ATTEMPTS - state.attempts);
    
    if (state.attempts >= MAX_ATTEMPTS) {
      state.lockedUntil = now + LOCK_TIME;
    }
    sessionState.set(userIP, state);

    throw { 
      message: "Authentication failed. Please check your credentials.", 
      remaining: remaining 
    };
  }
}
