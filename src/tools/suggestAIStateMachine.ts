import { z } from "zod";

export const SuggestAIStateMachineSchema = z.object({
  description: z
    .string()
    .describe("Natural language description of the character's behavior"),
});

export type SuggestAIStateMachineInput = z.infer<
  typeof SuggestAIStateMachineSchema
>;

export async function handleSuggestAIStateMachine(
  input: SuggestAIStateMachineInput
): Promise<string> {
  const { description } = input;
  const lines: string[] = [];

  lines.push("🧠 AI State Machine Suggestion\n");

  if (/patrol/i.test(description)) {
    lines.push("🔹 State: Patrol");
  }

  if (/see|detect|spot/i.test(description)) {
    lines.push("🔸 Transition: onPlayerSeen → Chase");
    lines.push("🔹 State: Chase");
  }

  if (/attack|shoot|hit/i.test(description)) {
    lines.push("🔸 Transition: onPlayerInRange → Attack");
    lines.push("🔹 State: Attack");
  }

  if (/lost|disappear|no longer see/i.test(description)) {
    lines.push("🔸 Transition: onPlayerLost → ReturnToPatrol");
    lines.push("🔹 State: ReturnToPatrol");
  }

  if (lines.length <= 1) {
    return "⚠️ Couldn't extract any behavior from the description. Try being more specific.";
  }

  return lines.join("\n");
}
