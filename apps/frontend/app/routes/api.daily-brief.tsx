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
  const pending     = Number(formData.get('pending')     ?? 0);
  const completed   = Number(formData.get('completed')   ?? 0);
  const total       = Number(formData.get('total')       ?? 0);
  const streak      = Number(formData.get('streak')      ?? 0);
  const mood        = formData.get('mood')     ? Number(formData.get('mood'))   : null;
  const energy      = formData.get('energy')   ? Number(formData.get('energy')) : null;
  const userName    = (formData.get('userName') as string) ?? 'there';
  const taskTitles  = (formData.get('taskTitles') as string) ?? '';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const moodLine   = mood   != null ? `Mood: ${mood}/10`   : 'Mood: not logged yet';
    const energyLine = energy != null ? `Energy: ${energy}/10` : 'Energy: not logged yet';

    const prompt = `You are a warm, motivating personal productivity coach. Today is ${today}.

Here is the user's current context:
- Name: ${userName}
- Current streak: ${streak} day${streak !== 1 ? 's' : ''}
- Tasks today: ${total} total, ${completed} completed, ${pending} still pending
- ${moodLine}
- ${energyLine}
- Pending tasks: ${taskTitles || 'none listed'}

Write a short daily brief for this person. Return ONLY a valid JSON object:
{
  "greeting": "A warm, personalized 1-sentence good-${streak > 0 ? 'keep-the-streak' : 'fresh-start'} opening (use their first name if known, else just be warm)",
  "focus": "1 sentence: the single most important thing they should focus on today based on their pending tasks and energy",
  "insight": "1 short insight or pattern observation — could be about their streak, mood, or task load (be specific, not generic)",
  "tip": "1 concrete, actionable micro-tip they can apply in the next 30 minutes"
}

Tone: warm, smart, human — like a trusted coach. No corporate fluff. Under 20 words per field.
Respond with ONLY the JSON object.`.trim();

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return json({ success: true, data: parsed });
  } catch (e: any) {
    console.error('Daily brief error:', e);
    return json({ error: 'Failed to generate brief.' }, { status: 500 });
  }
};
