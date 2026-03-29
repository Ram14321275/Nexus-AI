import { GoogleGenAI } from '@google/genai';
import Roadmap from '../models/Roadmap.js';

export const generateRoadmap = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    // Ensure API Key exists
    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ message: 'Gemini API Key is missing in server environment.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert curriculum designer. Break down the topic "${topic}" into a step-by-step learning roadmap. Return strictly a JSON array of objects, where each object has "title" (string) and "desc" (string) describing what to learn. Limit to exactly 5 core steps. No markdown wrap, no backticks, just raw JSON text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let jsonStr = response.text;
    // Strip markdown formatting if AI still outputs it
    if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json/gi, '').replace(/```/g, '').trim();
    }
    
    const parsedNodes = JSON.parse(jsonStr);

    // Save to DB
    const roadmap = await Roadmap.create({
      user: req.user._id,
      topic,
      nodes: parsedNodes
    });

    res.status(201).json(roadmap);
  } catch (error) {
    console.error("AI Gen Error:", error.message);
    res.status(500).json({ message: 'Failed to generate roadmap from AI.' });
  }
};

export const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roadmaps.' });
  }
}
