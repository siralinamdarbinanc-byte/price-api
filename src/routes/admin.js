export async function handleAdmin(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  // POST /admin/import
  if (path === '/admin/import' && request.method === 'POST') {
    try {
      const body = await request.json();
      const products = body.products || [];
      let inserted = 0;

      for (let i = 0; i < products.length; i += 100) {
        const chunk = products.slice(i, i + 100);
        const statements = chunk.map(p =>
          env.DB.prepare(`
            INSERT INTO products (code, name, brand, car, category, price, stock, keywords, normalized_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            p.code || '', p.name || '', p.brand || '', p.car || '', p.category || '',
            p.price || 0, p.stock || 0, p.keywords || '',
            (p.name || '').toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/ة/g, 'ه')
          )
        );
        await env.DB.batch(statements);
        inserted += chunk.length;
      }

      return new Response(JSON.stringify({ success: true, inserted }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

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
