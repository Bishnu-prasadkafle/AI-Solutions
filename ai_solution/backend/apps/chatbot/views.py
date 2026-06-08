import json
import urllib.request
import urllib.error
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

SYSTEM_PROMPT = """You are an AI assistant for AI-Solutions, a tech startup founded in Sunderland, UK in 2021 by ex-Google, DeepMind, and Palantir engineers.

COMPANY OVERVIEW:
- Name: AI-Solutions.
- Location: Sunderland, United Kingdom (also offices in London and Dubai).
- Founded: 2021.
- Clients: 150+ enterprise clients across 12 countries.
- Team: 45 members.
- Recognised by Innovate UK & Northern Powerhouse.

MISSION & VISION:
- Mission: Make enterprise AI accessible to every industry — delivering measurable ROI from day one without dedicated data science teams.
- Vision: A world where AI amplifies human potential rather than replacing it. Augmentation, not automation.

SERVICES:
1. AI-Powered Virtual Assistants — Context-aware AI assistants trained on your business data to handle complex queries 24/7.
2. Intelligent Workflow Automation — Self-learning AI models that adapt to your workflows, reducing manual effort and operational costs.
3. Rapid Prototyping Solutions — Concept to working prototype within 7 days. Full production deployment in 2–6 weeks.
4. Predictive Analytics — Data-driven insights and forecasting tailored to your industry.
5. Document Processing — Intelligent extraction, classification, and processing of business documents.
6. Custom AI Model Development — Bespoke AI models built around your specific business needs.
7. AI Analytics Suite — Launched 2024, next-generation autonomous workflow engine launched 2026.

KEY FACTS:
- Most clients go live within 4 weeks
- Prototype in 7 days
- Integrates with CRMs, ERPs, helpdesk tools, e-commerce, and custom APIs
- Bank-grade encryption, GDPR compliant, ISO 27001 guidelines
- Serves retail, healthcare, finance, logistics, education, real estate, and more
- Deployed across 30+ countries worldwide

PAGES ON THE WEBSITE:
- /services — view all services
- /about — company story, team, values, milestones
- /blog — latest news and articles
- /contact — contact form for inquiries and demo requests
- /feedback — client testimonials
- /gallery — events and photos

INSTRUCTIONS:
- Be helpful, professional, and concise
- Answer questions about services, pricing inquiries (direct to /contact), demos, the team, and company background
- For anything requiring human follow-up, direct users to /contact
- Keep responses under 150 words unless more detail is truly necessary
- Do not make up specific pricing — tell them to contact the team for a tailored quote
- Always speak in first person as part of the AI-Solutions team ("we", "our")
"""

# Fallback chain — tried in order when previous hits 429 or 503
MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-001',
]

BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}'


def call_gemini(api_key: str, payload: bytes, model: str) -> str:
    url = BASE_URL.format(model, api_key)
    req = urllib.request.Request(
        url, data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    return data['candidates'][0]['content']['parts'][0]['text']


class ChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return Response({'error': 'Chatbot not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        messages = request.data.get('messages', [])
        if not messages:
            return Response({'error': 'No messages provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Build Gemini contents from history (last 10 messages only to save tokens)
        contents = []
        for msg in messages[-10:]:
            role = 'model' if msg.get('role') == 'assistant' else 'user'
            contents.append({'role': role, 'parts': [{'text': msg.get('content', '')}]})

        payload = json.dumps({
            'system_instruction': {'parts': [{'text': SYSTEM_PROMPT}]},
            'contents': contents,
            'generationConfig': {'maxOutputTokens': 300, 'temperature': 0.7},
        }).encode('utf-8')

        last_error = None

        for model in MODELS:
            try:
                reply = call_gemini(api_key, payload, model)
                return Response({'reply': reply, 'model': model})
            except urllib.error.HTTPError as e:
                error_body = e.read().decode('utf-8')
                # 429 = quota exceeded, 503 = overloaded — try next model
                if e.code in (429, 503):
                    last_error = f'{model}: {e.code}'
                    continue
                # Any other HTTP error (401, 400 etc.) — fail immediately
                return Response(
                    {'error': f'Gemini API error ({model}): {error_body}'},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            except Exception as e:
                last_error = str(e)
                continue

        # All models exhausted
        return Response(
            {'reply': "I'm temporarily unavailable due to high demand. Please try again in a minute or visit our [Contact page](/contact) for immediate assistance."},
            status=status.HTTP_200_OK
        )
    
