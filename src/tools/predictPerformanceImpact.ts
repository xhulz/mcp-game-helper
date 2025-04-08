import { z } from "zod";

export const PredictPerformanceImpactSchema = z.object({
  code: z.string().describe("A code snippet to analyze for performance issues"),
});

export type PredictPerformanceImpactInput = z.infer<
  typeof PredictPerformanceImpactSchema
>;

export async function handlePredictPerformanceImpact(
  input: PredictPerformanceImpactInput
): Promise<string> {
  const { code } = input;
  const issues: string[] = [];

  if (/for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*([0-9]+)/.test(code)) {
    const match = code.match(/for\s*\(.*<\s*([0-9]+)\s*;.*\)/);
    const iterations = match ? parseInt(match[1]) : 0;
    if (iterations > 1000) {
      issues.push(
        `⚠️ Detected loop with ${iterations} iterations — may cause frame drops.`
      );
    }
  }

  if (/setTimeout|setInterval/.test(code)) {
    issues.push(
      "⚠️ Usage of setTimeout or setInterval — may introduce performance instability if not cleaned up."
    );
  }

  if (/spawn|add/.test(code) && /for\s*\(.*\)/.test(code)) {
    issues.push(
      "⚠️ Detected object spawning inside a loop — may lead to memory spikes."
    );
  }

  if (/Math\.random/.test(code)) {
    issues.push(
      "⚠️ Math.random detected — randomness inside hot loops can slow down simulations."
    );
  }

  if (issues.length === 0) {
    return "✅ No obvious performance issues detected in the provided snippet.";
  }

  return issues.join("\n");
}
