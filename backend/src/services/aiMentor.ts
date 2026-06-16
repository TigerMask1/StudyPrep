import { GoogleGenerativeAI } from "@google/generative-ai";
import { planGenerator } from './planGenerator';
import { profileService } from './profileService';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export const aiMentorService = {
  async generateMorningBrief(studentId: string) {
    const student = await profileService.getById(studentId);
    const todayPlan = await planGenerator.generateDay(student, new Date());

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are the NEET AI Mentor. Generate a motivating morning brief for the following student:
      Student Name: ${student.name}
      Phase: ${todayPlan.phase}
      Intensity: ${todayPlan.intensity_score}/10
      Available Hours: ${todayPlan.available_hours}

      Today's Plan:
      ${JSON.stringify(todayPlan.study_blocks)}

      Keep it concise, focused, and calibrated to the intensity score.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  async chat(studentId: string, message: string, history: any[]) {
    const student = await profileService.getById(studentId);
    const todayPlan = await planGenerator.generateDay(student, new Date());

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are the NEET AI Mentor. You have access to the student's profile and today's plan.
        Student: ${JSON.stringify(student)}
        Plan: ${JSON.stringify(todayPlan)}
        Be calm, focused, and solution-oriented.`
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  }
};
