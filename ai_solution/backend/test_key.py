from dotenv import load_dotenv
load_dotenv()
import os, urllib.request, urllib.error, json

key = os.getenv('GEMINI_API_KEY', '')
results = []

models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
for ver in ['v1beta', 'v1']:
    for model in models:
        url = f'https://generativelanguage.googleapis.com/{ver}/models/{model}:generateContent?key={key}'
        payload = json.dumps({'contents': [{'parts': [{'text': 'hi'}]}]}).encode()
        try:
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
            with urllib.request.urlopen(req, timeout=8) as r:
                results.append(f'SUCCESS: {ver}/{model}')
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:120]
            results.append(f'{e.code} {ver}/{model}: {body}')
        except Exception as ex:
            results.append(f'ERR {ver}/{model}: {ex}')

with open('test_results.txt', 'w') as f:
    f.write('\n'.join(results))
print('Done')
