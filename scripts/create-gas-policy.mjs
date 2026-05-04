/**
 * Creates a project-wide gas sponsorship policy on ZeroDev for Arbitrum Sepolia.
 *
 * Staging API base: https://staging-public-api.zerodev.app
 * Production API base: https://api.zerodev.app  (currently has a Cloudflare CNAME issue)
 * Auth: x-api-key header (staging) / Bearer token (production docs)
 *
 * Run with: node scripts/create-gas-policy.mjs
 */

const API_KEY = process.env.ZERODEV_API_KEY ?? "d05e26cd-0fbc-482e-8139-e4e4a6afa64f";
const PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID ?? "e86f23a6-4d21-495a-8f26-7a5523caae9e";
const CHAIN_ID = 421614; // Arbitrum Sepolia
const BASE = "https://staging-public-api.zerodev.app";

const headers = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
};

async function listPolicies() {
  const res = await fetch(`${BASE}/v2/projects/${PROJECT_ID}/chains/${CHAIN_ID}/policies`, { headers });
  const data = await res.json();
  return { status: res.status, data };
}

async function createPolicy() {
  const res = await fetch(`${BASE}/v2/projects/${PROJECT_ID}/chains/${CHAIN_ID}/policies`, {
    method: "POST",
    headers,
    body: JSON.stringify({ strategy: "pay_for_user", policyGroup: "project", rateLimits: [] }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

console.log("Checking existing policies...");
const { status, data: policies } = await listPolicies();

if (status !== 200) {
  console.error("Failed to list policies:", policies);
  process.exit(1);
}

const existing = policies.find((p) => p.policyGroup === "project" && p.strategy === "pay_for_user");
if (existing) {
  console.log("Project-wide pay_for_user policy already exists:", existing);
  process.exit(0);
}

console.log("Creating project-wide gas sponsorship policy...");
const { status: createStatus, data: created } = await createPolicy();

if (createStatus === 201 || createStatus === 200) {
  console.log("Policy created:", created);
} else {
  console.error(`Failed [${createStatus}]:`, created);
  process.exit(1);
}
