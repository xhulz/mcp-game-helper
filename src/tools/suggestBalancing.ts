import { z } from "zod";

export const SuggestBalancingSchema = z.object({
  player: z.object({
    hp: z.number().describe("Player hit points / life of the character"),
    damage: z.number().describe("Player damage dealt per hit"),
  }),
  enemy: z.object({
    hp: z.number().describe("Enemy hit points / life of the character"),
    damage: z.number().describe("Enemy damage dealt per hit"),
  }),
});

export type SuggestBalancingInput = z.infer<typeof SuggestBalancingSchema>;

export async function handleSuggestBalancing(
  input: SuggestBalancingInput
): Promise<string> {
  const entries = Object.entries(input);
  if (entries.length < 2) {
    return "Please provide at least two entities to compare.";
  }

  const lines: string[] = [];

  for (let i = 0; i < entries.length; i++) {
    const [nameA, statsA] = entries[i];

    for (let j = i + 1; j < entries.length; j++) {
      const [nameB, statsB] = entries[j];

      const ratioA = statsA.damage / statsB.hp;
      const ratioB = statsB.damage / statsA.hp;

      let verdict = `${nameA} vs ${nameB}:\n`;
      verdict += `- ${nameA} TTK on ${nameB}: ${(1 / ratioA).toFixed(2)}s\n`;
      verdict += `- ${nameB} TTK on ${nameA}: ${(1 / ratioB).toFixed(2)}s\n`;

      if (ratioA > ratioB * 1.2) {
        verdict += `🟢 ${nameA} has an advantage. Consider nerfing damage or increasing ${nameB}'s HP.\n`;
      } else if (ratioB > ratioA * 1.2) {
        verdict += `🔴 ${nameB} has an advantage. Consider adjusting stats for balance.\n`;
      } else {
        verdict += `⚖️ This matchup seems balanced.\n`;
      }

      lines.push(verdict);
    }
  }

  return lines.join("\n");
}
