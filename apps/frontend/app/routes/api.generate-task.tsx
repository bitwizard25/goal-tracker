import { json, type ActionFunction } from '@remix-run/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { requireUserId } = await import('../services/auth.server');
  await requireUserId(request); // auth guard

  const formData = await request.formData();
  const description = formData.get('description') as string;

  if (!description || description.trim().length < 5) {
    return json({ error: 'Please describe your task in a bit more detail.' }, { status: 400 });
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

    const prompt = `You are a smart productivity assistant. A user described a task they need to do:

"${description}"

Convert this rough description into a structured, actionable task. Return ONLY a valid JSON object with this exact schema:
{
  "title": "Concise, action-oriented task title (5-10 words, starts with a verb)",
  "description": "Expanded 2-3 sentence description explaining what needs to be done, any context, and why it matters.",
  "difficulty_level": <integer 1-5 where 1=trivial, 2=easy, 3=medium, 4=hard, 5=very hard>,
  "due_date": "<YYYY-MM-DD, today is ${today}. Infer urgency from the description. If none implied, use today+1 for urgent tasks, today+3 for normal tasks, today+7 for low-urgency>",
  "tags": ["tag1", "tag2"] <choose 2-3 relevant tags ONLY from: work, personal, health, learning, creative, admin, urgent, planning, review, meeting>
}

Respond with ONLY the JSON object. No markdown, no explanation.`.trim();

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI task generation error:', error);
    return json({ error: 'Failed to generate task. Please try again.' }, { status: 500 });
  }
};
