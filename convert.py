import csv
import json
import re

data = []
with open('data.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # استخراج قیمت (حذف کاما و تبدیل به عدد)
        price_str = row.get('قیمت فروش به ریال', '0').replace(',', '').replace('"', '').strip()
        try:
            price = int(price_str)
        except:
            price = 0
        
        name = row.get('نام کالا', '').strip()
        # ساخت normalized_name برای جستجوی بهتر
        normalized = name.lower().replace('ي', 'ی').replace('ك', 'ک').replace('ة', 'ه').replace('‌', '')
        
        data.append({
            'code': row.get('ردیف', '').strip(),
            'name': name,
            'brand': row.get('برند', '').strip(),
            'car': '',
            'category': '',
            'price': price,
            'stock': 0,
            'keywords': name,
            'normalized_name': normalized
        })

with open('import-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"تعداد {len(data)} رکورد آماده شد!")
print("نمونه رکورد اول:")
if data:
    print(json.dumps(data[0], ensure_ascii=False, indent=2))
