import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { registerAllTools } from "../mcp/tools/index.js";
import { registerConfigResources } from "../mcp/resources/config.js";

// Create MCP server instance
const server = new Server(
  {
    name: "simple-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Register all resources and tools
registerConfigResources(server);
registerAllTools(server);

// Simple HTTP MCP handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return server info
    res.json({
      name: "simple-mcp-server",
      version: "1.0.0",
      status: "running",
      capabilities: ["tools", "resources"],
      endpoints: {
        tools: "/api/mcp/tools",
        resources: "/api/mcp/resources"
      }
    });
  } else if (req.method === 'POST') {
    // Handle MCP JSON-RPC messages
    try {
      const message = req.body;
      
      // Handle MCP JSON-RPC messages
      const response = await server.handleMessage(message);
      res.json(response);
    } catch (error) {
      console.error('MCP Error:', error);
      res.status(500).json({
        jsonrpc: "2.0",
        id: req.body?.id || null,
        error: {
          code: -32000,
          message: error.message
        }
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}