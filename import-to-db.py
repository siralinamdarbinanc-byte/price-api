import json
import requests

API_URL = "https://price-api-v2.aliinndd2.workers.dev/admin/import"

with open('import-data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"تعداد کل رکوردها: {len(products)}")

batch_size = 100
total_inserted = 0

for i in range(0, len(products), batch_size):
    batch = products[i:i + batch_size]
    
    try:
        response = requests.post(API_URL, json={'products': batch})
        result = response.json()
        
        if result.get('success'):
            inserted = result.get('inserted', 0)
            total_inserted += inserted
            print(f"Batch {i//batch_size + 1}: {inserted} رکورد اضافه شد (مجموع: {total_inserted})")
        else:
            print(f"Batch {i//batch_size + 1} ارور داد: {result.get('error')}")
    except Exception as e:
        print(f"Batch {i//batch_size + 1} خطا: {e}")

print(f"\n✅ تمام! {total_inserted} رکورد وارد دیتابیس شد.")
