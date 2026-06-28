export async function handleAdmin(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  // GET /admin/stats
  if (path === '/admin/stats' && request.method === 'GET') {
    try {
      const productCount = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();
      const searchCount = await env.DB.prepare('SELECT COUNT(*) as count FROM search_logs').first();
      
      return new Response(JSON.stringify({
        success: true,
        stats: {
          totalProducts: productCount.count,
          totalSearches: searchCount.count
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // GET /admin/products
  if (path === '/admin/products' && request.method === 'GET') {
    try {
      const products = await env.DB.prepare('SELECT * FROM products ORDER BY updated_at DESC LIMIT 50').all();
      
      return new Response(JSON.stringify({
        success: true,
        data: products.results
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Admin endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
