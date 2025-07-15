import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
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
        {
          name: "get_tool_usage_stats",
          description: "Get statistics about tool usage",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
        {
          name: "get_tool_usage_history",
          description: "Get recent tool usage history",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Number of records to return (default: 10)",
                default: 10,
              },
            },
            required: [],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

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

    if (name === "get_tool_usage_stats") {
      const startTime = Date.now();
      
      try {
        const stats = await ToolUsageDB.getToolUsageStats();
        const executionTime = Date.now() - startTime;
        
        const response = {
          content: [
            {
              type: "text",
              text: `Tool Usage Statistics:\n${stats.map(stat => 
                `${stat.tool_name}: ${stat.usage_count} uses, avg ${stat.avg_execution_time?.toFixed(2) || 0}ms`
              ).join('\n')}`,
            },
          ],
        };

        // Log this tool usage too
        await logToolUsage("get_tool_usage_stats", {}, { stats }, executionTime);

        return response;
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Database error: ${error.message}`);
      }
    }

    if (name === "get_tool_usage_history") {
      const startTime = Date.now();
      const { limit = 10 } = args;
      
      try {
        const history = await ToolUsageDB.getToolUsageHistory(limit);
        const executionTime = Date.now() - startTime;
        
        const response = {
          content: [
            {
              type: "text",
              text: `Recent Tool Usage History (last ${limit} records):\n${history.map(record => 
                `${record.timestamp} - ${record.tool_name}: ${record.arguments} → ${record.result} (${record.execution_time_ms}ms)`
              ).join('\n')}`,
            },
          ],
        };

        // Log this tool usage too
        await logToolUsage("get_tool_usage_history", { limit }, { count: history.length }, executionTime);

        return response;
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Database error: ${error.message}`);
      }
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  });
}