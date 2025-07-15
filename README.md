# Simple MCP Server

A Model Context Protocol (MCP) server implementation with SQLite database logging and web dashboard.

## Features

- **Math Tools**: Add, subtract, multiply numbers
- **API Tools**: Fetch data from external APIs (JSONPlaceholder)
- **Database Tools**: View usage statistics and history
- **Web Dashboard**: Monitor tool usage at localhost:8000
- **SQLite Logging**: Automatic logging of all tool usage with execution times

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Deploy automatically**

### Local Development

```bash
# Install dependencies
npm install

# Run all services (MCP server, Inspector, Web dashboard)
npm run dev

# Run individual services
npm run inspector  # MCP Inspector
npm run web       # Web dashboard only
npm start         # MCP server only
```

## Usage

### Claude Desktop Configuration

**Local Usage:**
```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/index.js"]
    }
  }
}
```

**Vercel Usage:**
```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", "@-",
        "https://your-app.vercel.app/api/mcp"
      ]
    }
  }
}
```

### Available Tools

- `add` - Add two numbers
- `subtract` - Subtract two numbers  
- `multiply` - Multiply two numbers
- `get_posts` - Fetch posts from JSONPlaceholder API
- `get_tool_usage_stats` - View usage statistics
- `get_tool_usage_history` - View recent usage history

### Web Dashboard

Access at `https://your-app.vercel.app/` to view:
- Usage statistics
- Recent tool usage history
- Real-time monitoring

## Project Structure

```
├── api/                  # Vercel API routes
│   ├── mcp.js           # MCP server endpoint
│   └── web/             # Web dashboard APIs
├── mcp/                 # MCP implementation
│   ├── tools/           # Tool implementations
│   ├── database/        # Database logic
│   └── resources/       # MCP resources
├── public/              # Web dashboard
└── index.js            # Local MCP server
```

## Development

- **Node.js**: 18.x or higher
- **Database**: SQLite (auto-created)
- **Framework**: MCP TypeScript SDK

## Scripts

- `npm run dev` - All services with auto-restart
- `npm run vercel-dev` - Vercel development server
- `npm run deploy` - Deploy to Vercel
- `npm run inspector` - MCP Inspector only
- `npm run web` - Web dashboard only