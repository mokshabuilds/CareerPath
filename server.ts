import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिन्दी)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
};

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

interface StudentProfileContext {
  name?: string;
  qualification?: string;
  currentClassOrDegree?: string;
  interests?: string[];
}

interface CounselorRequestBody {
  messages?: ChatMessageInput[];
  profile?: StudentProfileContext | null;
  language?: string;
}

interface TranslateRequestBody {
  targetLanguage?: string;
  texts?: string[];
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.post('/api/counselor', async (req, res) => {
  try {
    const body = req.body as CounselorRequestBody;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      res.status(400).json({ error: 'Please enter a question to start counseling.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'AI Career Counselor is unavailable right now because the Gemini API key is not configured in environment secrets.',
      });
      return;
    }

    const profile = body?.profile;
    const profileLines: string[] = [];
    if (profile?.name) profileLines.push(`Student Name: ${profile.name}`);
    if (profile?.qualification) profileLines.push(`Qualification: ${profile.qualification}`);
    if (profile?.currentClassOrDegree) {
      profileLines.push(`Current Class / Degree: ${profile.currentClassOrDegree}`);
    }
    if (profile?.interests && profile.interests.length > 0) {
      profileLines.push(`Academic Interests: ${profile.interests.join(', ')}`);
    }

    const profileContext =
      profileLines.length > 0
        ? `\n\nStudent Profile Context (use this to personalize your recommendations naturally):\n${profileLines.join('\n')}`
        : '';

    const langCode = typeof body?.language === 'string' && LANGUAGE_NAMES[body.language] ? body.language : 'en';
    const languageName = LANGUAGE_NAMES[langCode] || 'English';
    const languageInstruction =
      langCode === 'en'
        ? 'Respond in clear, natural English.'
        : `Respond in ${languageName} using its native script and natural, student-friendly phrasing. Keep Indian exam acronyms (like JEE, NEET, CUET, CAT, CLAT, GATE, NIRF, IIT, IISc, IIM) recognizable in Latin script alongside explanations if helpful.`;

    const systemInstruction = `You are CareerPath's friendly, encouraging, and accurate career counselor for students in India.
Your expertise covers:
- Career pathways after Class 10, Class 12 (Science PCM/PCB, Commerce, Arts/Humanities, Vocational), and Graduation
- Indian degrees and courses (B.Tech, MBBS, B.Com, BBA, LLB, B.Des, B.Sc, BA, MBA, M.Tech, CA, CS, etc.)
- Top Indian colleges (IITs, NITs, AIIMS, IIMs, NLUs, DU, NID, NIFT, IISc, BITS Pilani, RVCE, BMSCE, MSRIT, Christ, PES, IIITs, etc.) and NIRF rankings
- Major entrance exams (JEE Main & Advanced, NEET UG, CUET UG, CAT, CLAT, GATE, UPSC CSE, NATA/UCEED, NDA)
- Scholarships in India (NSP, INSPIRE, PM-USP, Reliance Foundation, Aditya Birla, ONGC, etc.)

Guidelines:
- ${languageInstruction}
- Give practical, structured, realistic guidance tailored to the Indian education ecosystem.
- Be concise (120–220 words unless the student asks for a deep roadmap), warm, and easy to scan with clear bullet points when helpful.
- Mention concrete next steps (exams, eligibility, skills, or relevant CareerPath sections like Career Explorer, Entrance Exams, or Scholarships).
- Never invent fake dates or guaranteed admission promises.${profileContext}`;

    const contents = messages.slice(-12).map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(msg.text).slice(0, 2000) }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      res.status(502).json({ error: 'Received an empty response from the counselor service.' });
      return;
    }

    res.json({ reply });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unexpected server error';
    console.error('Counselor API error:', errMessage);
    res.status(500).json({
      error: `Unable to reach the AI Career Counselor right now (${errMessage}). Please try again.`,
    });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    const body = req.body as TranslateRequestBody;
    const targetCode = typeof body?.targetLanguage === 'string' ? body.targetLanguage : 'en';
    const texts = Array.isArray(body?.texts)
      ? body.texts.slice(0, 30).map((t) => String(t).slice(0, 1200))
      : [];

    if (texts.length === 0) {
      res.json({ translations: [] });
      return;
    }
    if (targetCode === 'en' || !LANGUAGE_NAMES[targetCode]) {
      res.json({ translations: texts });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'Translation service unavailable because Gemini API key is not configured.' });
      return;
    }

    const targetName = LANGUAGE_NAMES[targetCode];
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Translate each item in the following JSON array into natural, accurate ${targetName} for an Indian student career guidance portal. Preserve numbers, currency symbols (₹, LPA), and standard Indian exam/institution acronyms (like IIT, IISc, IIM, JEE, NEET, CUET, NIRF, B.Tech, MBBS, MBA, CAT, CLAT) clearly. Return a JSON array of strings of the exact same length and order:\n\n${JSON.stringify(texts)}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const rawJson = (response.text ?? '[]').trim();
    const parsed = JSON.parse(rawJson) as unknown;
    if (!Array.isArray(parsed) || parsed.length !== texts.length) {
      res.status(502).json({ error: 'Translation format mismatch.' });
      return;
    }

    res.json({ translations: parsed.map((item, idx) => (typeof item === 'string' && item.trim() ? item : texts[idx])) });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Translation error';
    console.error('Translate API error:', errMessage);
    res.status(500).json({ error: errMessage });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPath server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
