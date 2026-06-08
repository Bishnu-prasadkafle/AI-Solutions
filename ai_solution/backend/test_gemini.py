from dotenv import load_dotenv
load_dotenv()
import os, json, urllib.request, urllib.error

key = os.getenv('GEMINI_API_KEY', '')
print(f'Key length: {len(key)}')

url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}'
payload = json.dumps({
    'contents': [{'role': 'user', 'parts': [{'text': 'Say hello'}]}],
    'generationConfig': {'maxOutputTokens': 50}
}).encode('utf-8')

req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print('SUCCESS:', data['candidates'][0]['content']['parts'][0]['text'])
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code, e.read().decode('utf-8'))
except Exception as e:
    print('EXCEPTION:', type(e).__name__, e)
