import { json, type ActionFunction } from '@remix-run/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { requireUserId } = await import('../services/auth.server');
  await requireUserId(request);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'AI not configured.' }, { status: 500 });

  const formData = await request.formData();
  const goalTitle       = (formData.get('goalTitle')       as string) ?? '';
  const goalDescription = (formData.get('goalDescription') as string) ?? '';
  const targetDate      = (formData.get('targetDate')      as string) ?? '';
  const category        = (formData.get('category')        as string) ?? '';

  if (!goalTitle) return json({ error: 'Goal title is required.' }, { status: 400 });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a productivity coach. A user has a long-term goal they want to start acting on TODAY.

Goal: "${goalTitle}"
Description: "${goalDescription}"
Category: ${category}
Target date: ${targetDate || 'not set'}
Today: ${today}

Generate exactly 5 concrete daily tasks they should start doing this week to make meaningful progress toward this goal.

Return ONLY a valid JSON array of 5 objects, each with this schema:
{
  "title": "Action-oriented task title starting with a verb (5-10 words)",
  "description": "1 sentence: what to do and why it moves the goal forward",
  "difficulty_level": <integer 1-5>,
  "due_date": "<YYYY-MM-DD — spread across today through today+6 days, start with the most foundational task today>",
  "tags": ["tag1", "tag2"] <choose 2 from: work, personal, health, learning, creative, admin, urgent, planning, review, meeting>
}

Make the tasks specific, achievable in one day, and directly connected to the goal. Order from most foundational to most advanced.
Respond with ONLY the JSON array.`.trim();

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    return json({ success: true, tasks: parsed });
  } catch (e: any) {
    console.error('Goal tasks generation error:', e);
    return json({ error: 'Failed to generate tasks. Please try again.' }, { status: 500 });
  }
};
