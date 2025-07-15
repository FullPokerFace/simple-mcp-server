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

// API tool definitions
export const apiTools = [
  {
    name: "get_posts",
    description: "Fetch JSON posts from JSONPlaceholder API",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of posts to return (default: 10)",
          default: 10,
        },
      },
      required: [],
    },
  },
];

// API tool handlers
export async function handleApiTool(name, args) {
  if (name === "get_posts") {
    const startTime = Date.now();
    const { limit = 10 } = args;
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      const limitedPosts = posts.slice(0, limit);
      const executionTime = Date.now() - startTime;
      
      const result = {
        content: [
          {
            type: "text",
            text: `Successfully fetched ${limitedPosts.length} posts:\n\n${limitedPosts.map(post => 
              `ID: ${post.id}\nTitle: ${post.title}\nBody: ${post.body.substring(0, 100)}...\n`
            ).join('\n')}`,
          },
        ],
      };

      // Log tool usage to database
      await logToolUsage("get_posts", { limit }, { 
        posts_count: limitedPosts.length,
        api_status: response.status 
      }, executionTime);

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Log failed tool usage too
      await logToolUsage("get_posts", { limit }, { 
        error: error.message 
      }, executionTime);
      
      throw new McpError(ErrorCode.InternalError, `Failed to fetch posts: ${error.message}`);
    }
  }

  return null; // Tool not handled by this module
}