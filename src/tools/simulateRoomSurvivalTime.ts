import { z } from "zod";

export const SimulateRoomSurvivalTimeSchema = z.object({
  player: z.object({
    hp: z.number(),
    damage: z.number(),
    attackSpeed: z.number(),
  }),
  enemies: z
    .array(
      z.object({
        hp: z.number(),
        damage: z.number(),
        attackSpeed: z.number(),
      })
    )
    .min(1),
});

export type SimulateRoomSurvivalTimeInput = z.infer<
  typeof SimulateRoomSurvivalTimeSchema
>;

export async function handleSimulateRoomSurvivalTime(
  input: SimulateRoomSurvivalTimeInput
): Promise<string> {
  const { player, enemies } = input;

  const playerDPS = player.damage * player.attackSpeed;
  const totalEnemyHP = enemies.reduce((sum, e) => sum + e.hp, 0);
  const roomClearTime = totalEnemyHP / playerDPS;

  const totalEnemyDPS = enemies.reduce(
    (sum, e) => sum + e.damage * e.attackSpeed,
    0
  );
  const playerSurvivalTime = player.hp / totalEnemyDPS;

  const risk =
    playerSurvivalTime < roomClearTime
      ? "🔴 HIGH risk — player may die before clearing the room."
      : playerSurvivalTime < roomClearTime * 1.2
      ? "🟠 MEDIUM risk — room is tough, but possible."
      : "🟢 LOW risk — player should clear the room comfortably.";

  return `🧠 Simulation Result:
- Player DPS: ${playerDPS.toFixed(2)}
- Total Enemy HP: ${totalEnemyHP}
- Estimated Time to Clear Room: ${roomClearTime.toFixed(2)}s
- Estimated Time to Die (under full pressure): ${playerSurvivalTime.toFixed(2)}s
- Risk Assessment: ${risk}`;
}
