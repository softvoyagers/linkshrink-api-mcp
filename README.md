# LinkShrink MCP Server

[![npm version](https://img.shields.io/npm/v/linkshrink-mcp)](https://www.npmjs.com/package/linkshrink-mcp)
[![Website](https://img.shields.io/badge/website-linkshrink.dev-00f0ff)](https://linkshrink.dev)
[![API Status](https://img.shields.io/badge/API-online-39ff14)](https://linkshrink.dev/health)

Integrate [LinkShrink](https://linkshrink.dev) into **Claude, Cursor, VS Code**, and any MCP-compatible AI assistant. Shorten URLs, retrieve click analytics, resolve shortened links, bulk shorten, and build UTM-tagged campaign URLs — all through natural language.

No API key required. Free forever.

## Quick Start

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "linkshrink": {
      "command": "npx",
      "args": ["-y", "linkshrink-mcp"]
    }
  }
}
```

Then ask Claude:

> "Shorten https://example.com/very/long/path/to/resource"

> "Get click stats for code abc123"

> "Unshorten https://bit.ly/3xYz"

## Available Tools

| Tool | Description |
|------|-------------|
| `shorten_url` | Shorten a URL with optional password protection, private stats, and preview page |
| `get_url_stats` | Get click statistics for a shortened URL (clicks, referrers, countries, daily breakdown) |
| `unshorten_url` | Resolve any shortened URL to its original destination with full redirect chain |
| `bulk_shorten` | Shorten multiple URLs at once in a single request |
| `shorten_with_utm` | Build UTM-tagged campaign URL and shorten it for marketing attribution |

## Architecture

```
Claude / Cursor / VS Code
        |
        | stdio (MCP protocol)
        v
  linkshrink-mcp
        |
        | HTTPS (REST API)
        v
  linkshrink.dev
```

This is a thin stdio MCP client that translates tool calls into REST API requests against the LinkShrink API at `https://linkshrink.dev`. No data is stored locally — all operations are stateless pass-throughs.

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `LINKSHRINK_API_URL` | `https://linkshrink.dev` | API base URL (override for self-hosted instances) |

## SoftVoyagers Ecosystem

LinkShrink MCP is part of the [SoftVoyagers](https://github.com/softvoyagers) portfolio of free developer APIs:

| Product | Description | Website |
|---------|-------------|---------|
| **LinkMeta** | URL metadata extraction API | [linkmeta.dev](https://linkmeta.dev) |
| **PageShot** | Screenshot & webpage capture API | [pageshot.site](https://pageshot.site) |
| **PDFSpark** | HTML/URL to PDF conversion API | [pdfspark.dev](https://pdfspark.dev) |
| **OGForge** | Open Graph image generator API | [ogforge.dev](https://ogforge.dev) |
| **LinkShrink** | Privacy-first URL shortener API | [linkshrink.dev](https://linkshrink.dev) |
| **Faktuj** | Polish invoice generator | [faktuj.pl](https://faktuj.pl) · [KSeF](https://faktuj.pl/ksef) |
| **QRMint** | Styled QR code generator API | [qrmint.dev](https://qrmint.dev) · [Docs](https://qrmint.dev/docs) · [QR from URL](https://qrmint.dev/qr-code-url) |
| **PageDrop** | Instant HTML hosting API | [pagedrop.dev](https://pagedrop.dev) |
| **PismoSzyteNaMiarę** | Document generator for Polish legal templates | [pismoszytenamiare.pl](https://pismoszytenamiare.pl) · [Umowa kupna-sprzedaży](https://pismoszytenamiare.pl/umowa-kupna-sprzedazy) |

## License

MIT
