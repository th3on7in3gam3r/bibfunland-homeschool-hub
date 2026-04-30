import Anthropic from '@anthropic-ai/sdk';

// Server-side only
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface Worksheet {
  title: string;
  gradeLevel: string;
  objective: string;
  parentInstructions: string;
  contentMarkup: string;
  bibleVerse: string;
}

export interface WorksheetPack {
  title: string;
  overview: string;
  worksheets: Worksheet[];
}

// Strip markdown code fences if Claude wraps the JSON despite instructions
function extractJSON(raw: string): string {
  // Use [\s\S] instead of dotAll flag for broader TS target compatibility
  const fenced = raw.match(/```(?:json)?[\s\S]*?\n?([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return raw.trim();
}

export async function generateWorksheetPack(
  theme: string,
  gradeRange: string,
  worksheetCount: number = 6
): Promise<WorksheetPack> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `Create a printable Christian homeschool worksheet pack for children.

Theme: "${theme}"
Grade Range: "${gradeRange}"

Rules:
- Exactly ${worksheetCount} worksheets, one per type below (use the first ${worksheetCount} types in order)
- Biblically accurate, Christ-centered, age-appropriate
- Every worksheet includes a full scripture verse with reference (NIV or ESV)
- Keep contentMarkup concise — use short sentences, bullet points, and placeholders like [Write here] or [Draw here]. Do NOT write long paragraphs.

Worksheet types:
1. Story sequencing — 5-6 numbered events to cut out and order
2. Scripture copywork — one verse to copy, space to draw
3. Math activity — 4 simple word problems using story numbers
4. Reading comprehension — 3-4 sentence passage + 3 questions
5. Creative prompt — one drawing box + one writing prompt
6. Matching — 6 word-to-definition pairs

Return ONLY a valid JSON object. No markdown. No code fences. No explanation:
{
  "title": "string",
  "overview": "string (2-3 sentences)",
  "worksheets": [
    {
      "title": "string",
      "gradeLevel": "string",
      "objective": "string (1 sentence)",
      "parentInstructions": "string (1-2 sentences)",
      "contentMarkup": "string (use \\n for line breaks, keep under 400 words)",
      "bibleVerse": "string (full verse text + reference)"
    }
  ]
}`,
      },
    ],
    system: "You are a Christian children's educator creating concise, printable homeschool worksheets. Keep all text brief and age-appropriate. Return only valid JSON.",
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '';

  // Check if Claude hit the token limit mid-response
  if (message.stop_reason === 'max_tokens') {
    throw new Error('Response was too long and got cut off. Try a simpler theme or shorter description.');
  }

  return JSON.parse(extractJSON(raw)) as WorksheetPack;
}

export async function generateWorksheetIdeas(
  packTitle: string,
  packOverview: string,
  gradeRange: string
): Promise<Worksheet[]> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 6000,
    messages: [
      {
        role: 'user',
        content: `Suggest 3 new printable worksheet ideas to expand a Christian homeschool pack.

Pack title: "${packTitle}"
Pack overview: "${packOverview}"
Grade range: "${gradeRange}"

Rules:
- Each idea must be grounded in scripture and support academic learning
- Age-appropriate for ${gradeRange}
- Keep contentMarkup concise (under 200 words each), use [Write here] and [Draw here] placeholders

Return ONLY a valid JSON array. No markdown. No code fences:
[
  {
    "title": "string",
    "gradeLevel": "${gradeRange}",
    "objective": "string (1 sentence)",
    "parentInstructions": "string (1-2 sentences)",
    "contentMarkup": "string (brief, use \\n for line breaks)",
    "bibleVerse": "string (full verse + reference)"
  }
]`,
      },
    ],
    system: "You are a Christian children's educator creating concise, printable homeschool worksheets. Keep all text brief and age-appropriate. Return only valid JSON.",
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '[]';

  if (message.stop_reason === 'max_tokens') {
    throw new Error('Response was cut off. Please try again.');
  }

  return JSON.parse(extractJSON(raw)) as Worksheet[];
}
