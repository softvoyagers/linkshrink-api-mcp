// @ts-nocheck
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const API_BASE = process.env.LINKSHRINK_API_URL || 'https://linkshrink.dev';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'linkshrink-mcp',
    version: '1.0.0',
  });

  server.tool(
    'shorten_url',
    'Shorten a long URL into a compact linkshrink.dev short link. Optionally protect with a password, make stats private, or force a preview page before redirect.',
    {
      url: z.string().url().describe('The URL to shorten'),
      password: z.string().optional().describe('Optional password to protect the short link'),
      private_stats: z.boolean().optional().describe('If true, stats require a token to access'),
      force_preview: z.boolean().optional().describe('If true, show a preview page before redirecting'),
    },
    async ({ url, password, private_stats, force_preview }) => {
      const body: Record<string, unknown> = { url };
      if (password) body.password = password;
      if (private_stats !== undefined) body.private_stats = private_stats;
      if (force_preview !== undefined) body.force_preview = force_preview;

      const response = await fetch(`${API_BASE}/api/v1/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  server.tool(
    'get_url_stats',
    'Get click statistics for a shortened URL including total clicks, clicks by day, referrers, and countries.',
    {
      code: z.string().describe('The short URL code (e.g. "abc123")'),
      token: z.string().optional().describe('Stats token required for private stats'),
    },
    async ({ code, token }) => {
      const params = new URLSearchParams();
      if (token) params.set('token', token);
      const qs = params.toString();
      const url = `${API_BASE}/api/v1/stats/${encodeURIComponent(code)}${qs ? '?' + qs : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  server.tool(
    'unshorten_url',
    'Resolve any shortened URL to its original destination. Works with linkshrink.dev and other URL shorteners. Returns the full redirect chain.',
    {
      url: z.string().url().describe('The shortened URL to resolve'),
    },
    async ({ url }) => {
      const params = new URLSearchParams({ url });
      const response = await fetch(`${API_BASE}/api/v1/unshorten?${params.toString()}`);
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  server.tool(
    'bulk_shorten',
    'Shorten multiple URLs at once in a single request. Returns an array of shortened URL results.',
    {
      urls: z.array(z.string().url()).describe('Array of URLs to shorten'),
    },
    async ({ urls }) => {
      const response = await fetch(`${API_BASE}/api/v1/shorten/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  server.tool(
    'shorten_with_utm',
    'Build a URL with UTM campaign tracking parameters and shorten it. Useful for marketing campaigns and attribution tracking.',
    {
      url: z.string().url().describe('The base URL to add UTM parameters to'),
      utm_source: z.string().describe('Campaign source (e.g. "google", "newsletter")'),
      utm_medium: z.string().describe('Campaign medium (e.g. "cpc", "email")'),
      utm_campaign: z.string().describe('Campaign name (e.g. "spring_sale")'),
      force_preview: z.boolean().optional().describe('If true, show a preview page before redirecting'),
    },
    async ({ url, utm_source, utm_medium, utm_campaign, force_preview }) => {
      const body: Record<string, unknown> = { url, utm_source, utm_medium, utm_campaign };
      if (force_preview !== undefined) body.force_preview = force_preview;

      const response = await fetch(`${API_BASE}/api/v1/shorten/utm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
        isError: !response.ok,
      };
    }
  );

  return server;
}
