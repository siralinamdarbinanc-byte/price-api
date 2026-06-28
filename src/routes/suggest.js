import { suggestProducts } from '../utils/search-engine.js';

export async function handleSuggest(request, env, corsHeaders) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ suggestions: [] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const suggestions = await suggestProducts(env, query, 5);
    
    return new Response(JSON.stringify({
      success: true,
      suggestions: suggestions
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
