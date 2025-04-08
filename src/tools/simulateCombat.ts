import { z } from "zod";

export const SimulateCombatSchema = z.object({
  player: z.object({
    hp: z.number(),
    damage: z.number(),
    attackSpeed: z.number(),
  }),
  enemy: z.object({
    hp: z.number(),
    damage: z.number(),
    attackSpeed: z.number(),
  }),
});

export type SimulateCombatInput = z.infer<typeof SimulateCombatSchema>;

export async function handleSimulateCombat(
  input: SimulateCombatInput
): Promise<string> {
  const entities = Object.entries(input);
  if (entities.length < 2) {
    return (
      "⚠️ Provide at least two entities to simulate combat." +
      JSON.stringify(entities)
    );
  }

  const lines: string[] = [];

  for (let i = 0; i < entities.length; i++) {
    const [nameA, statsA] = entities[i];

    for (let j = i + 1; j < entities.length; j++) {
      const [nameB, statsB] = entities[j];

      const timeToKillB = statsB.hp / (statsA.damage * statsA.attackSpeed);
      const timeToKillA = statsA.hp / (statsB.damage * statsB.attackSpeed);

      lines.push(`⚔️ Simulating combat: ${nameA} vs ${nameB}`);
      lines.push(
        `- ${nameA} kills ${nameB} in ~${timeToKillB.toFixed(2)} seconds`
      );
      lines.push(
        `- ${nameB} kills ${nameA} in ~${timeToKillA.toFixed(2)} seconds`
      );

      if (timeToKillB < timeToKillA * 0.8) {
        lines.push(`🟢 ${nameA} has a clear advantage.`);
      } else if (timeToKillA < timeToKillB * 0.8) {
        lines.push(`🔴 ${nameB} has a clear advantage.`);
      } else {
        lines.push(`⚖️ Fairly balanced fight.`);
      }

      lines.push(""); // linha vazia
    }
  }

  return lines.join("\n");
}
