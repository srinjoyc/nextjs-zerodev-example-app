/**
 * Manages ZeroDev gas policies for the project.
 *
 * Usage:
 *   node scripts/set-gas-policy.mjs          # apply the policy defined below
 *   node scripts/set-gas-policy.mjs --list   # list current policies
 *   node scripts/set-gas-policy.mjs --clear  # delete all policies
 */

const API_KEY    = process.env.ZERODEV_API_KEY    ?? "d05e26cd-0fbc-482e-8139-e4e4a6afa64f";
const PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID ?? "e86f23a6-4d21-495a-8f26-7a5523caae9e";
const CHAIN_ID   = 421614; // Arbitrum Sepolia
const BASE       = "https://staging-public-api.zerodev.app";

const headers = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
};

const POLICY_URL = `${BASE}/v2/projects/${PROJECT_ID}/chains/${CHAIN_ID}/policies`;

// ─── Policy to apply ──────────────────────────────────────────────────────────
// 1 UserOp per 30 seconds, per wallet address (project-wide scope).
const TARGET_POLICY = {
  strategy: "pay_for_user",
  policyGroup: "project",
  rateLimits: [
    {
      rateLimitType: "limit_by_times",
      value: 1,
      interval: 30,         // seconds (API stores interval but drops intervalUnit in response)
      intervalUnit: "second",
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

async function listPolicies() {
  const res = await fetch(POLICY_URL, { headers });
  if (!res.ok) throw new Error(`GET failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function deletePolicy(id) {
  const res = await fetch(`${POLICY_URL}/${id}`, { method: "DELETE", headers });
  const text = await res.text();
  console.log(`  DELETE policy ${id} [${res.status}]: ${text}`);
}

async function createPolicy(body) {
  const res = await fetch(POLICY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(`  POST policy [${res.status}]:`, JSON.stringify(data, null, 2));
  return { status: res.status, data };
}

const args = process.argv.slice(2);

if (args.includes("--list")) {
  console.log("Current policies:");
  console.log(JSON.stringify(await listPolicies(), null, 2));
  process.exit(0);
}

if (args.includes("--clear")) {
  const policies = await listPolicies();
  if (!policies.length) { console.log("No policies to delete."); process.exit(0); }
  for (const p of policies) await deletePolicy(p.id);
  console.log("All policies deleted.");
  process.exit(0);
}

// Default: replace all policies with TARGET_POLICY
console.log("Fetching existing policies...");
const existing = await listPolicies();
console.log(`Found ${existing.length} existing policy(s).`);

for (const p of existing) await deletePolicy(p.id);

console.log("\nCreating new policy:");
console.log(JSON.stringify(TARGET_POLICY, null, 2));
await createPolicy(TARGET_POLICY);
