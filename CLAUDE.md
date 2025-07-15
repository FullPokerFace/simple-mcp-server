# Simple MCP Server - Project Context

## Project Overview
- **Type**: Model Context Protocol (MCP) Server
- **Location**: `/mnt/c/Users/waiwe/OneDrive/Desktop/Projects/saaga-apps/simple-mcp-server`
- **Purpose**: Building a simple MCP server implementation

## MCP TypeScript SDK Information
- **Installation**: `npm install @modelcontextprotocol/sdk`
- **Requirements**: Node.js 18.x or higher
- **Repository**: https://github.com/modelcontextprotocol/typescript-sdk

### Core Architecture
- **Server**: Central MCP protocol interface with connection management
- **Resources**: Data exposure endpoints (similar to GET APIs)
- **Tools**: Action-enabling functions with side effects
- **Prompts**: Reusable interaction templates

### Key Features
- Standardized LLM interaction protocol
- Input validation with schemas (using Zod)
- Dynamic registration capabilities
- Context-aware completions
- Multiple transport options (stdio, HTTP)

### Basic Server Setup Pattern
```typescript
const server = new McpServer({
 name: "demo-server",
 version: "1.0.0"
});

// Register a tool
server.registerTool("calculate-bmi", {
 title: "BMI Calculator",
 inputSchema: { weightKg: z.number(), heightM: z.number() }
}, async ({ weightKg, heightM }) => ({
 content: [{ 
   type: "text", 
   text: String(weightKg / (heightM * heightM)) 
 }]
}));
```

## Implementation Progress

### Completed
- ✅ Project initialized with npm (`npm init -y`)
- ✅ MCP TypeScript SDK installed (`@modelcontextprotocol/sdk` v1.15.1)
- ✅ Simple MCP server created with add numbers tool
- ✅ Package.json configured with ES modules and start script

### Project Structure
```
simple-mcp-server/
├── package.json          # Project configuration with ES modules
├── index.js              # Main MCP server implementation
├── CLAUDE.md             # Project context and progress
└── node_modules/         # Dependencies
```

### Server Implementation
- **Server Name**: "simple-mcp-server"
- **Version**: "1.0.0"
- **Transport**: StdioServerTransport
- **Tool**: "add" - adds two numbers together with input validation

### Usage
```bash
npm start          # Start the MCP server (stdio mode)
npm run inspector  # Start with MCP Inspector for testing
```

## Testing with MCP Inspector
The project includes the MCP Inspector for easy testing:

1. **Start the inspector**: `npm run inspector` (or `npx @modelcontextprotocol/inspector node index.js`)
2. **Web interface opens** at: http://localhost:6274 (with auth token)
3. **Proxy server** runs on: localhost:6277
4. **Test the add tool**:
   - Click "add" tool in the interface
   - Enter parameters: `a: 5`, `b: 3`
   - Execute and see result: "The result of 5 + 3 is 8"

**Note**: The inspector keeps running until you stop it with Ctrl+C. The browser should open automatically with the correct auth token.

## Session Notes
- Started: 2025-07-15
- MCP SDK documentation reviewed and integrated
- CLAUDE.md file created for persistent context tracking
- Simple MCP server with add tool implemented
- MCP Inspector installed and configured for testing

## Important Notes
- **Transport**: Uses stdio (not HTTP) - no port number
- **Testing**: Use MCP Inspector for visual testing interface
- **Communication**: MCP protocol messages via stdin/stdout

## Next Steps
- Add more tools (subtract, multiply, etc.)
- Consider TypeScript migration for better type safety
- Explore other MCP capabilities (resources, prompts)

## To Memorize
- to memorize