import { z } from "zod";

export const SuggestWaveTimingSchema = z.object({
  player: z.object({
    damage: z.number().describe("Player damage per hit"),
    attackSpeed: z.number().describe("Attacks per second"),
  }),
  enemyHp: z.number().describe("Average HP per enemy"),
  enemiesPerWave: z.number().describe("Number of enemies per wave"),
});

export type SuggestWaveTimingInput = z.infer<typeof SuggestWaveTimingSchema>;

export async function handleSuggestWaveTiming(
  input: SuggestWaveTimingInput
): Promise<string> {
  const { player, enemyHp, enemiesPerWave } = input;
  const playerDPS = player.damage * player.attackSpeed;
  const totalWaveHP = enemyHp * enemiesPerWave;
  const timeToClearWave = totalWaveHP / playerDPS;

  let recommendation = "🧠 Suggested Wave Timing:\n";
  recommendation += `- Player DPS: ${playerDPS.toFixed(2)}\n`;
  recommendation += `- Total wave HP: ${totalWaveHP}\n`;
  recommendation += `- Time to clear: ~${timeToClearWave.toFixed(1)} seconds\n`;

  if (timeToClearWave < 5) {
    recommendation +=
      "⚠️ Too easy — consider increasing HP or number of enemies.";
  } else if (timeToClearWave > 15) {
    recommendation += "⚠️ Too hard — may frustrate players.";
  } else {
    recommendation += "✅ Balanced pacing for this wave.";
  }

  return recommendation;
}
