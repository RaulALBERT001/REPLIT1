import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateChallenges(): Promise<{ challenge: string; points: number }[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in sustainability and environmental practices. Generate practical, actionable sustainability challenges for individuals to complete in their daily lives."
        },
        {
          role: "user",
          content: "Generate 5 new sustainability challenges that people can complete to help the environment. Each challenge should be practical, actionable, and doable within a day or week. Respond with JSON in this format: { 'challenges': [{ 'challenge': string, 'points': number }] }. Points should range from 5-15 based on difficulty."
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    const result = JSON.parse(content);
    return result.challenges || [];
  } catch (error) {
    console.error('Error generating challenges:', error);
    throw new Error('Failed to generate challenges');
  }
}

export async function generateQuizQuestions(): Promise<{ question: string; options: string[]; correct_answer: number; points: number }[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in environmental science and sustainability. Create educational quiz questions about environmental topics, recycling, climate change, and sustainable practices."
        },
        {
          role: "user",
          content: "Generate 5 multiple choice quiz questions about environmental sustainability, recycling, or climate change. Each question should have 4 options and educational value. Respond with JSON in this format: { 'questions': [{ 'question': string, 'options': [string, string, string, string], 'correct_answer': number (0-3), 'points': number }] }. Points should be 5 for each question."
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    const result = JSON.parse(content);
    return result.questions || [];
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
}