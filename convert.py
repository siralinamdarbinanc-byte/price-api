import csv
import json

encodings = ['utf-8', 'windows-1256', 'latin-1', 'iso-8859-1', 'cp1252']

data = []
file_read = False

for enc in encodings:
    try:
        with open('data.csv', 'r', encoding=enc) as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append({
                    'code': row.get('code', ''),
                    'name': row.get('name', ''),
                    'brand': row.get('brand', ''),
                    'car': row.get('car', ''),
                    'category': row.get('category', ''),
                    'price': int(row.get('price', 0)) if str(row.get('price', '')).strip().isdigit() else 0,
                    'stock': int(row.get('stock', 0)) if str(row.get('stock', '')).strip().isdigit() else 0,
                    'keywords': row.get('keywords', '')
                })
            file_read = True
            print(f"Encoding موفق: {enc}")
            break
    except Exception as e:
        print(f"Encoding {enc} کار نکرد: {e}")
        continue

if not file_read:
    print("هیچ encoding ای کار نکرد!")
else:
    with open('import-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"تعداد {len(data)} رکورد آماده شد!")
    print("فایل import-data.json ساخته شد.")
