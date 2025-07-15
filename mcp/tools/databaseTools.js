import {
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolUsageDB } from "../database/toolUsageDB.js";

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
    const stats = await ToolUsageDB.getToolUsageStats();
    
    return {
      content: [
        {
          type: "text",
          text: `Tool Usage Statistics:\n${stats.map(stat => 
            `${stat.tool_name}: ${stat.usage_count} uses, avg ${stat.avg_execution_time?.toFixed(2) || 0}ms`
          ).join('\n')}`,
        },
      ],
    };
  }

  if (name === "get_tool_usage_history") {
    const { limit = 10 } = args;
    
    const history = await ToolUsageDB.getToolUsageHistory(limit);
    
    return {
      content: [
        {
          type: "text",
          text: `Recent Tool Usage History (last ${limit} records):\n${history.map(record => 
            `${record.timestamp} - ${record.tool_name}: ${record.arguments} → ${record.result} (${record.execution_time_ms}ms)`
          ).join('\n')}`,
        },
      ],
    };
  }

  return null; // Tool not handled by this module
}