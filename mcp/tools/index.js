import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolUsageDB } from "../database/toolUsageDB.js";

// Import all tool modules
import { mathTools, handleMathTool } from "./mathTools.js";
import { apiTools, handleApiTool } from "./apiTools.js";
import { databaseTools, handleDatabaseTool } from "./databaseTools.js";

// Wrapper function to automatically log tool usage
async function withLogging(toolName, args, toolHandler) {
  const startTime = Date.now();
  
  try {
    // Execute the tool
    const result = await toolHandler(toolName, args);
    const executionTime = Date.now() - startTime;
    
    // Log successful execution
    try {
      await ToolUsageDB.logToolUsage(toolName, args, { 
        success: true,
        content: result.content?.[0]?.text || JSON.stringify(result)
      }, executionTime);
    } catch (logError) {
      console.error('Failed to log tool usage:', logError);
    }
    
    return result;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    // Log failed execution
    try {
      await ToolUsageDB.logToolUsage(toolName, args, { 
        success: false,
        error: error.message 
      }, executionTime);
    } catch (logError) {
      console.error('Failed to log tool usage:', logError);
    }
    
    // Re-throw the original error
    throw error;
  }
}

// Combine all tools
const allTools = [
  ...mathTools,
  ...apiTools,
  ...databaseTools,
];

// Combine all handlers
const toolHandlers = {
  math: handleMathTool,
  api: handleApiTool,
  database: handleDatabaseTool,
};

// Tool name to handler mapping
const toolToHandlerMap = {
  // Math tools
  add: 'math',
  subtract: 'math',
  multiply: 'math',
  // API tools
  get_posts: 'api',
  // Database tools
  get_tool_usage_stats: 'database',
  get_tool_usage_history: 'database',
};

export function registerAllTools(server) {
  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools,
    };
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Find the appropriate handler for the tool
    const handlerType = toolToHandlerMap[name];
    
    if (!handlerType) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    const handler = toolHandlers[handlerType];
    
    if (!handler) {
      throw new McpError(ErrorCode.InternalError, `Handler not found for tool type: ${handlerType}`);
    }

    // Call the appropriate handler with automatic logging
    const result = await withLogging(name, args, handler);
    
    if (result === null) {
      throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not implemented in handler ${handlerType}`);
    }

    return result;
  });
}

// Export individual modules for potential direct use
export { mathTools, handleMathTool } from "./mathTools.js";
export { apiTools, handleApiTool } from "./apiTools.js";
export { databaseTools, handleDatabaseTool } from "./databaseTools.js";