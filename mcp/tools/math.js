import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";

export function registerMathTools(server) {
  // Register the add tool
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
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
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

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

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  });
}