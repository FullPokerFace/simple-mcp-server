import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";

// Sample server configuration data
const serverConfig = {
  name: "simple-mcp-server",
  version: "1.0.0",
  capabilities: ["tools", "resources"],
  settings: {
    debug: false,
    timeout: 30000,
    maxConnections: 10,
  },
  endpoints: {
    tools: [
      {
        name: "add",
        description: "Add two numbers together",
        version: "1.0.0",
      },
    ],
  },
};

export function registerConfigResources(server) {
  // Register resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "config://server",
          name: "Server Configuration",
          description: "Current server configuration and settings",
          mimeType: "application/json",
        },
        {
          uri: "config://capabilities",
          name: "Server Capabilities",
          description: "Available server capabilities and features",
          mimeType: "application/json",
        },
      ],
    };
  });

  // Handle resource reads
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    switch (uri) {
      case "config://server":
        return {
          contents: [
            {
              uri: "config://server",
              mimeType: "application/json",
              text: JSON.stringify(serverConfig, null, 2),
            },
          ],
        };
      
      case "config://capabilities":
        return {
          contents: [
            {
              uri: "config://capabilities",
              mimeType: "application/json",
              text: JSON.stringify({
                tools: serverConfig.endpoints.tools,
                resources: ["config://server", "config://capabilities"],
                features: serverConfig.capabilities,
              }, null, 2),
            },
          ],
        };

      default:
        throw new McpError(
          ErrorCode.InvalidParams,
          `Unknown resource: ${uri}`
        );
    }
  });
}