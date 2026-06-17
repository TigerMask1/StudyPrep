import { GoogleGenerativeAI } from "@google/generative-ai";
import { planGenerator } from './planGenerator';
import { profileService } from './profileService';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export const aiMentorService = {
  async generateMorningBrief(studentId: string) {
    const student = await profileService.getById(studentId);
    if (!student) throw new Error('Student not found');

    const todayPlan = await planGenerator.generateDay(student, new Date());

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are the NEET AI Mentor. Generate a motivating morning brief for the following student:
      Student Name: ${student.name}
      Phase: ${todayPlan.phase}
      Intensity: ${todayPlan.intensity_score}/10
      Available Hours: ${todayPlan.available_hours}

      Today's Plan:
      ${JSON.stringify(todayPlan.study_blocks)}

      Keep it concise, focused, and calibrated to the intensity score. Use a supportive but firm tone.
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      console.error('Gemini generateMorningBrief error:', err.message || err);
      return "Good morning! Let's focus on today's goals and stay consistent. You've got this!";
    }
  },

  async chat(studentId: string, message: string, history: any[]) {
    const student = await profileService.getById(studentId);
    if (!student) throw new Error('Student not found');

    const todayPlan = await planGenerator.generateDay(student, new Date());

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    try {
      const result = await chat.sendMessage(`
        System: You are the NEET AI Mentor. Student: ${JSON.stringify(student)}, Plan: ${JSON.stringify(todayPlan)}.
        Rules: Be calm, focused, solution-oriented. NEET-level precision.
        User: ${message}
      `);
      return result.response.text();
    } catch (err: any) {
      console.error('Gemini chat error:', err.message || err);
      return `I'm having trouble connecting to my brain (Gemini API). Error: ${err.message || 'Unknown'}. Please check your API key and model availability.`;
    }
  }
};
