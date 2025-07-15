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

// Database tool definitions
export const databaseTools = [
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
];

// Database tool handlers
export async function handleDatabaseTool(name, args) {
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

  return null; // Tool not handled by this module
}