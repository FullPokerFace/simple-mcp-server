import {
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";

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
    const { a, b } = args;

    // Validate inputs
    if (typeof a !== "number" || typeof b !== "number") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Both 'a' and 'b' must be numbers"
      );
    }

    const result = a + b;
    
    return {
      content: [
        {
          type: "text",
          text: `The result of ${a} + ${b} is ${result}`,
        },
      ],
    };
  }

  if (name === "subtract") {
    const { a, b } = args;

    // Validate inputs
    if (typeof a !== "number" || typeof b !== "number") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Both 'a' and 'b' must be numbers"
      );
    }

    const result = a - b;

    return {
      content: [
        {
          type: "text",
          text: `The result of ${a} - ${b} is ${result}`,
        },
      ],
    };
  }

  if (name === "multiply") {
    const { a, b } = args;

    // Validate inputs
    if (typeof a !== "number" || typeof b !== "number") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Both 'a' and 'b' must be numbers"
      );
    }

    const result = a * b;

    return {
      content: [
        {
          type: "text",
          text: `The result of ${a} * ${b} is ${result}`,
        },
      ],
    };
  }

  return null; // Tool not handled by this module
}