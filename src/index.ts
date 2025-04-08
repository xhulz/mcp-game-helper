#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import zodToJsonSchema from "zod-to-json-schema";
import {
  handleSuggestBalancing,
  SuggestBalancingSchema,
} from "./tools/suggestBalancing.js";
import {
  handlePredictPerformanceImpact,
  PredictPerformanceImpactSchema,
} from "./tools/predictPerformanceImpact.js";
import {
  handleSuggestAIStateMachine,
  SuggestAIStateMachineSchema,
} from "./tools/suggestAIStateMachine.js";
import {
  handleSimulateCombat,
  SimulateCombatSchema,
} from "./tools/simulateCombat.js";
import {
  handleSimulateRoomSurvivalTime,
  SimulateRoomSurvivalTimeSchema,
} from "./tools/simulateRoomSurvivalTime.js";
import {
  handleSuggestWaveTiming,
  SuggestWaveTimingSchema,
} from "./tools/suggestWaveTiming.js";
import {
  handleSimulateSkillImpact,
  SimulateSkillImpactSchema,
} from "./tools/simulateSkillImpact.js";
import {
  handleSuggestDifficultyRamp,
  SuggestDifficultyRampSchema,
} from "./tools/suggestDifficultyRamp.js";

// Create server instance
const server = new Server(
  {
    name: "mcp-game-helper",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "suggest_balancing",
        description: "Analyze stats and suggest balancing adjustments",
        inputSchema: zodToJsonSchema(SuggestBalancingSchema),
      },
      {
        name: "predict_performance_impact",
        description:
          "Analyze a code snippet and warn about potential performance issues",
        inputSchema: zodToJsonSchema(PredictPerformanceImpactSchema),
      },
      {
        name: "suggest_ai_state_machine",
        description:
          "Generates an AI state machine from a behavior description",
        inputSchema: zodToJsonSchema(SuggestAIStateMachineSchema),
      },
      {
        name: "simulate_combat",
        description:
          "Simulate a fight between entities and calculate time to kill",
        inputSchema: zodToJsonSchema(SimulateCombatSchema),
      },
      {
        name: "simulate_room_survival_time",
        description:
          "Estimate how long the player survives vs a group of enemies",
        inputSchema: zodToJsonSchema(SimulateRoomSurvivalTimeSchema),
      },
      {
        name: "suggest_wave_timing",
        description: "Suggests time between enemy waves based on player DPS",
        inputSchema: zodToJsonSchema(SuggestWaveTimingSchema),
      },
      {
        name: "simulate_skill_impact",
        description:
          "Simulates how effective a skill is based on damage and enemy HP",
        inputSchema: zodToJsonSchema(SimulateSkillImpactSchema),
      },
      {
        name: "suggest_difficulty_ramp",
        description:
          "Analyzes if difficulty progression between levels is well balanced",
        inputSchema: zodToJsonSchema(SuggestDifficultyRampSchema),
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "suggest_balancing": {
        const parsed = SuggestBalancingSchema.parse(request.params.arguments);
        const result = await handleSuggestBalancing(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "predict_performance_impact": {
        const parsed = PredictPerformanceImpactSchema.parse(
          request.params.arguments
        );
        const result = await handlePredictPerformanceImpact(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "suggest_ai_state_machine": {
        const parsed = SuggestAIStateMachineSchema.parse(
          request.params.arguments
        );
        const result = await handleSuggestAIStateMachine(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "simulate_combat": {
        const parsed = SimulateCombatSchema.parse(request.params.arguments);
        const result = await handleSimulateCombat(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "simulate_room_survival_time": {
        const parsed = SimulateRoomSurvivalTimeSchema.parse(
          request.params.arguments
        );
        const result = await handleSimulateRoomSurvivalTime(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "suggest_wave_timing": {
        const parsed = SuggestWaveTimingSchema.parse(request.params.arguments);
        const result = await handleSuggestWaveTiming(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "simulate_skill_impact": {
        const parsed = SimulateSkillImpactSchema.parse(
          request.params.arguments
        );
        const result = await handleSimulateSkillImpact(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      case "suggest_difficulty_ramp": {
        const parsed = SuggestDifficultyRampSchema.parse(
          request.params.arguments
        );
        const result = await handleSuggestDifficultyRamp(parsed);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${error.message || "Something went wrong."}`,
        },
      ],
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Game Helper running...");
}

runServer().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
