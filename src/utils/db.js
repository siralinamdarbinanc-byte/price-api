// Helper function to run a query on D1
export async function dbQuery(env, query, params = []) {
  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();
  return result.results;
}

// Helper function to run a single query (for INSERT/UPDATE/DELETE)
export async function dbRun(env, query, params = []) {
  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).run();
  return result;
}

// Helper function to run multiple queries in a batch
export async function dbBatch(env, queries) {
  const result = await env.DB.batch(queries);
  return result;
}
