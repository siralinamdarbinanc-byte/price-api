import { searchProducts } from '../utils/search-engine.js';

export async function handleSearch(request, env, corsHeaders) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: 'پارامتر q الزامی است' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const results = await searchProducts(env, query, 20);
    
    return new Response(JSON.stringify({
      success: true,
      query: query,
      count: results.length,
      data: results
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
