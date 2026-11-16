"""Remote Streamable HTTP transport for the BhriguSetu MCP server.

The stdio entry point remains unchanged for local MCP clients.
"""
from __future__ import annotations

import os

from .server import mcp


def main() -> None:
    """Serve the same BhriguSetu tools over Streamable HTTP."""
    port = int(os.getenv("PORT", "8000"))
    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",
        port=port,
        stateless_http=True,
        json_response=True,
    )


if __name__ == "__main__":
    main()
