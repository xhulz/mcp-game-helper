import { z } from "zod";

export const SuggestDifficultyRampSchema = z.object({
  levels: z
    .array(
      z.object({
        name: z.string().describe("Name of the level"),
        enemyHp: z.number().describe("Average enemy HP in the level"),
      })
    )
    .min(2),
  player: z.object({
    damage: z.number().describe("Player's damage per attack"),
    attackSpeed: z.number().describe("Attacks per second"),
  }),
});

export type SuggestDifficultyRampInput = z.infer<
  typeof SuggestDifficultyRampSchema
>;

export async function handleSuggestDifficultyRamp(
  input: SuggestDifficultyRampInput
): Promise<string> {
  const { levels, player } = input;
  const playerDPS = player.damage * player.attackSpeed;

  const lines: string[] = [];
  lines.push("📈 Difficulty Ramp Analysis:\n");

  let previousTTK: number | null = null;

  levels.forEach((level, i) => {
    const ttk = level.enemyHp / playerDPS;
    let verdict = "";

    if (previousTTK !== null) {
      const delta = ttk - previousTTK;
      if (delta > 1) {
        verdict = "⬆️ Steep increase";
      } else if (delta < -1) {
        verdict = "⬇️ Sudden drop (might feel too easy)";
      } else {
        verdict = "➡️ Smooth transition";
      }
    }

    lines.push(
      `- ${level.name}: Avg Enemy HP = ${level.enemyHp}, TTK = ${ttk.toFixed(
        2
      )}s ${verdict}`
    );

    previousTTK = ttk;
  });

  return lines.join("\n");
}
