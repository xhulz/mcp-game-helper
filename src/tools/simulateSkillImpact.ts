import { z } from "zod";

export const SimulateSkillImpactSchema = z.object({
  skill: z.object({
    damage: z.number().describe("Damage the skill deals"),
    cooldown: z.number().describe("Cooldown time in seconds"),
    area: z.number().describe("Number of enemies affected per use"),
  }),
  enemies: z
    .array(
      z.object({
        hp: z.number().describe("Enemy HP"),
      })
    )
    .min(1),
});

export type SimulateSkillImpactInput = z.infer<
  typeof SimulateSkillImpactSchema
>;

export async function handleSimulateSkillImpact(
  input: SimulateSkillImpactInput
): Promise<string> {
  const { skill, enemies } = input;

  const sortedEnemies = [...enemies].sort((a, b) => a.hp - b.hp);
  const targets = sortedEnemies.slice(0, skill.area);

  let killed = 0;
  targets.forEach((enemy) => {
    if (skill.damage >= enemy.hp) killed++;
  });

  const effectiveDPS = (skill.damage * skill.area) / skill.cooldown;

  return `🧠 Skill Impact Simulation:

- Skill Damage: ${skill.damage}
- Cooldown: ${skill.cooldown}s
- Affects up to ${skill.area} enemies
- Enemies hit: ${targets.length}
- Enemies killed: ${killed}
- Estimated Effective DPS: ${effectiveDPS.toFixed(2)}

${
  killed === targets.length
    ? "✅ High efficiency skill — wipes all targets in range."
    : killed === 0
    ? "⚠️ No kills — might need a buff."
    : "🟡 Partial efficiency — good but situational."
}`;
}
