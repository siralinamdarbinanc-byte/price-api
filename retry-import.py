import json
import requests
import time

API_URL = "https://price-api-v2.aliinndd2.workers.dev/admin/import"

with open('import-data.json', 'r', encoding='utf-8') as f:
    all_products = json.load(f)

print(f"تعداد کل رکوردها: {len(all_products)}")
print("در حال بررسی وضعیت دیتابیس...")

# بررسی تعداد رکوردهای فعلی
try:
    response = requests.get("https://price-api-v2.aliinndd2.workers.dev/admin/stats", timeout=10)
    stats = response.json()
    current_count = stats.get('stats', {}).get('totalProducts', 0)
    print(f"رکوردهای فعلی در دیتابیس: {current_count}")
except:
    current_count = 0
    print("نتونستم وضعیت دیتابیس رو چک کنم، فرض می‌کنم 0 رکورد هست")

# رکوردهایی که باید ارسال بشن
remaining = all_products[current_count:]
print(f"رکوردهای باقی‌مانده: {len(remaining)}")

if len(remaining) == 0:
    print("✅ همه رکوردها قبلاً وارد شدن!")
else:
    batch_size = 10
    total_inserted = 0
    
    for i in range(0, len(remaining), batch_size):
        batch = remaining[i:i + batch_size]
        
        for retry in range(3):  # 3 بار تلاش
            try:
                response = requests.post(API_URL, json={'products': batch}, timeout=30)
                result = response.json()
                
                if result.get('success'):
                    inserted = result.get('inserted', 0)
                    total_inserted += inserted
                    print(f"Batch {i//batch_size + 1}: {inserted} رکورد اضافه شد (مجموع: {total_inserted})")
                    break
                else:
                    print(f"Batch {i//batch_size + 1} ارور داد: {result.get('error')}")
                    break
            except Exception as e:
                print(f"Batch {i//batch_size + 1} خطا (تلاش {retry + 1}/3): {e}")
                time.sleep(2)  # 2 ثانیه صبر کن
        
        time.sleep(0.5)  # نیم ثانیه بین هر batch
    
    print(f"\n✅ تمام! {total_inserted} رکورد اضافه وارد دیتابیس شد.")
    print(f"مجموع کل: {current_count + total_inserted} رکورد")
