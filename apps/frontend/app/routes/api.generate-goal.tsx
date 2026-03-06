import { json, type ActionFunction } from '@remix-run/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { requireUserId } = await import('../services/auth.server');
  await requireUserId(request);

  const formData = await request.formData();
  const description = formData.get('description') as string;

  if (!description || description.trim().length < 5) {
    return json({ error: 'Please describe your goal in a bit more detail.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'AI service is not configured on the server.' }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a smart productivity and life coach assistant. A user described a long-term goal:

"${description}"

Convert this into a fully structured SMART goal. Return ONLY a valid JSON object with this exact schema:
{
  "title": "Concise goal title (5-10 words, starts with a verb)",
  "description": "Expanded 2-3 sentence description of the goal, context, and why it matters.",
  "target_date": "<YYYY-MM-DD, today is ${today}. Infer from the description — if no timeframe mentioned, use 6 months from today>",
  "category": "<exactly one of: health, career, education, relationships, finance, personal>",
  "priority": "<exactly one of: low, medium, high — infer from urgency/importance>",
  "smart": {
    "specific": "1-2 sentences: exactly what will be accomplished, clearly defined",
    "measurable": "1-2 sentences: concrete metrics, numbers, or milestones to track progress",
    "achievable": "1-2 sentences: why this goal is realistic given typical resources and effort",
    "relevant": "1-2 sentences: why this goal matters, how it connects to broader life values",
    "time_bound": "1-2 sentences: timeline breakdown — when it starts, key checkpoints, final deadline"
  }
}

Respond with ONLY the JSON object. No markdown, no explanation.`.trim();

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI goal generation error:', error);
    return json({ error: 'Failed to generate goal. Please try again.' }, { status: 500 });
  }
};
