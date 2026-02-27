```
measure-space-mcp-server/
├── README.md              ← root overview with links to both packages
├── LICENSE
├── python/                ← 🐍 Python MCP server
│   ├── README.md
│   ├── main.py
│   ├── pyproject.toml
│   ├── uv.lock
│   └── Dockerfile
└── typescript/            ← 🟦 TypeScript MCP server
    ├── README.md
    ├── src/
    │   ├── index.ts
    │   └── measureSpaceApi.ts
    ├── package.json       ← has mcpName for MCP registry
    ├── tsconfig.json
    ├── Dockerfile
    └── server.json        ← MCP registry metadata
```


```

# 1. Log in to npm (your token expired)
npm login
npm config set //registry.npmjs.org/:_authToken YOUR_NEW_TOKEN

# 2. Publish the package to npm
npm publish --access public

# 3. Authenticate with MCP registry via GitHub
mcp-publisher login github
# (it'll give you a device code to enter at github.com/login/device)

# 4. Publish to the registry
mcp-publisher publish

```

browse it at: https://registry.modelcontextprotocol.io → search for MeasureSpace