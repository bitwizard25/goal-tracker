import { json, type ActionFunction } from '@remix-run/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const { requireUserId } = await import('../services/auth.server');
    const { connectDB } = await import('../lib/db.server');
    const { LongTermGoal } = await import('../models/Goals');

    const userId = await requireUserId(request);
    await connectDB();

    const formData = await request.formData();
    const inputDescription = formData.get('description') as string;

    if (!inputDescription || inputDescription.trim().length < 5) {
        return json({ error: 'Please provide a slightly more detailed description to use AI autocomplete.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    try {
        const longTermGoals = await LongTermGoal.find({ user_id: userId, status: 'active' }).select('_id title').lean();

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' } });

        const prompt = `
      You are an expert Productivity Coach. The user wants to create a goal based on this rough thought:
      "${inputDescription}"

      Your job is to structure this into a formally defined Short-Term Goal.
      Please return a JSON object with the following schema:
      {
        "title": "A concise, actionable, and engaging title for the goal",
        "description": "An expanded, well-written description of what the user wants to achieve and why it matters.",
        "start_date": "YYYY-MM-DD format (use today as reference: ${new Date().toISOString().split('T')[0]})",
        "end_date": "YYYY-MM-DD format (estimate a reasonable timeframe based on the task, e.g. 1 week to 3 months)",
        "priority": "low" | "medium" | "high",
        "long_term_goal_id": "If this task clearly aligns with one of the provided Long-Term Goals, output its ID here. Otherwise, output an empty string.",
        "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"] (Generate 3 to 5 logical sequential milestones to complete this goal)
      }

      Available Active Long-Term Goals for linking:
      ${JSON.stringify(longTermGoals.map(g => ({ id: g._id.toString(), title: g.title })))}
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the returned JSON
        const parsed = JSON.parse(responseText);

        return json({ success: true, data: parsed });

    } catch (error: any) {
        console.error('AI Goal Generation Error:', error);
        return json({ error: 'Failed to generate goal. Please try again.' }, { status: 500 });
    }
};
