import {
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";

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
    const { limit = 10 } = args;
    
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    
    if (!response.ok) {
      throw new McpError(ErrorCode.InternalError, `HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    const limitedPosts = posts.slice(0, limit);
    
    return {
      content: [
        {
          type: "text",
          text: `Successfully fetched ${limitedPosts.length} posts:\n\n${limitedPosts.map(post => 
            `ID: ${post.id}\nTitle: ${post.title}\nBody: ${post.body.substring(0, 100)}...\n`
          ).join('\n')}`,
        },
      ],
    };
  }

  return null; // Tool not handled by this module
}