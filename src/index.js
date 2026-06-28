import { handleSearch } from './routes/search.js';
import { handleSuggest } from './routes/suggest.js';
import { handleAdmin } from './routes/admin.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Routing
    if (path === '/search' || path.startsWith('/search?')) {
      return handleSearch(request, env, corsHeaders);
    }

    if (path === '/suggest' || path.startsWith('/suggest?')) {
      return handleSuggest(request, env, corsHeaders);
    }

    if (path.startsWith('/admin')) {
      return handleAdmin(request, env, corsHeaders);
    }

    // Health check
    if (path === '/') {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'Price API is running',
        version: '1.0.0'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
