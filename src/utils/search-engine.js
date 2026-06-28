import { dbQuery } from './db.js';

// نرمال‌سازی متن برای جستجو
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // حذف اعراب
    .replace(/\s+/g, ' ')
    .trim();
}

// اصلاح غلط املایی
export async function fixTypo(env, text) {
  const words = text.split(' ');
  const fixedWords = [];
  
  for (const word of words) {
    const result = await dbQuery(env, 
      'SELECT correct FROM typo_dictionary WHERE wrong = ?', 
      [word]
    );
    fixedWords.push(result.length > 0 ? result[0].correct : word);
  }
  
  return fixedWords.join(' ');
}

// جستجوی اصلی
export async function searchProducts(env, query, limit = 20) {
  // نرمال‌سازی و اصلاح غلط املایی
  let normalizedQuery = normalizeText(query);
  normalizedQuery = await fixTypo(env, normalizedQuery);
  
  const keywords = normalizedQuery.split(' ').filter(k => k.length > 1);
  
  if (keywords.length === 0) {
    return [];
  }

  // ساخت شرط جستجو
  const conditions = keywords.map(() => 
    '(normalized_name LIKE ? OR keywords LIKE ? OR brand LIKE ? OR car LIKE ?)'
  ).join(' AND ');
  
  const params = [];
  keywords.forEach(k => {
    params.push(`%${k}%`, `%${k}%`, `%${k}%`, `%${k}%`);
  });
  
  params.push(limit);

  const results = await dbQuery(env, 
    `SELECT * FROM products 
     WHERE ${conditions}
     ORDER BY search_count DESC, click_count DESC, price ASC
     LIMIT ?`,
    params
  );

  // ثبت جستجو
  await env.DB.prepare(
    'INSERT INTO search_logs (query, result_count) VALUES (?, ?)'
  ).bind(query, results.length).run();

  return results;
}

// پیشنهاد لحظه‌ای
export async function suggestProducts(env, query, limit = 5) {
  const normalized = normalizeText(query);
  
  if (normalized.length < 2) return [];

  const results = await dbQuery(env,
    `SELECT DISTINCT normalized_name FROM products 
     WHERE normalized_name LIKE ?
     ORDER BY search_count DESC
     LIMIT ?`,
    [`%${normalized}%`, limit]
  );

  return results.map(r => r.normalized_name);
}
