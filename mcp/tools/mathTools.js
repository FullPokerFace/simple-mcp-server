import {
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolUsageDB } from "../database/toolUsageDB.js";

// Helper function to log tool usage
async function logToolUsage(toolName, args, result, executionTime) {
  try {
    await ToolUsageDB.logToolUsage(toolName, args, result, executionTime);
  } catch (error) {
    console.error('Failed to log tool usage:', error);
  }
}

// Math tool definitions
export const mathTools = [
  {
    name: "add",
    description: "Add two numbers together",
    inputSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number",
          description: "Second number",
        },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "subtract",
    description: "Subtract second number from first number",
    inputSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number (minuend)",
        },
        b: {
          type: "number",
          description: "Second number (subtrahend)",
        },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "multiply",
    description: "Multiply 2 numbers",
    inputSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number",
          description: "Second number",
        },
      },
      required: ["a", "b"],
    },
  },
];

// Math tool handlers
export async function handleMathTool(name, args) {
  if (name === "add") {
    const startTime = Date.now();
    const { a, b } = args;

    // Validate inputs
    if (typeof a !== "number" || typeof b !== "number") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Both 'a' and 'b' must be numbers"
      );
    }

    const result = a + b;
    const executionTime = Date.now() - startTime;
    
    const response = {
      content: [
        {
          type: "text",
          text: `The result of ${a} + ${b} is ${result}`,
        },
      ],
    };

    // Log tool usage to database
    await logToolUsage("add", { a, b }, { result }, executionTime);

    return response;
  }

  if (name === "subtract") {
    const startTime = Date.now();
    const { a, b } = args;

    // Validate inputs
    if (typeof a !== "number" || typeof b !== "number") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Both 'a' and 'b' must be numbers"
      );
    }

    const result = a - b;
    const executionTime = Date.now() - startTime;

    const response = {
      content: [
        {
          type: "text",
          text: `The result of ${a} - ${b} is ${result}`,
        },
      ],
    };

    // Log tool usage to database
    await logToolUsage("subtract", { a, b }, { result }, executionTime);

    return response;
  }

  if (name === "multiply") {
    const startTime = Date.now();
    const { a, b } = args;

    // Validate inputs
    if (typeof a !== "number" || typeof b !== "number") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Both 'a' and 'b' must be numbers"
      );
    }

    const result = a * b;
    const executionTime = Date.now() - startTime;

    const response = {
      content: [
        {
          type: "text",
          text: `The result of ${a} * ${b} is ${result}`,
        },
      ],
    };

    // Log tool usage to database
    await logToolUsage("multiply", { a, b }, { result }, executionTime);

    return response;
  }

  return null; // Tool not handled by this module
}