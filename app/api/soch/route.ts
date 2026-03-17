import OpenAI from "openai";

function detectLanguageStyle(input: string) {
  const text = input.toLowerCase().trim();

  const hasDevanagari = /[\u0900-\u097F]/.test(input);
  const hasUrdu = /[\u0600-\u06FF]/.test(input);

  if (hasDevanagari) return "hindi";
  if (hasUrdu) return "urdu";

  const hinglishWords = [
    "mujhe",
    "mujh",
    "zindagi",
    "samajh",
    "kya",
    "kyun",
    "kaise",
    "nahi",
    "hain",
    "hai",
    "karun",
    "karna",
    "mera",
    "meri",
    "andar",
    "dil",
    "dimag",
    "lagta",
    "chahiye",
    "kyuki",
    "matlab",
    "yaar",
    "koi",
    "sab",
    "kuch",
    "apna",
    "khud",
    "soch",
    "dar",
    "pata",
    "raha",
    "rahi",
    "samjh",
    "life",
  ];

  const isHinglish = hinglishWords.some((word) => text.includes(word));
  if (isHinglish) return "hinglish";

  return "english";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body?.input;

    if (!input || typeof input !== "string") {
      return new Response(JSON.stringify({ error: "No input provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const languageStyle = detectLanguageStyle(input);

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
You are SOCH — a wise clarity mentor.

LANGUAGE STYLE FOR THIS REPLY: ${languageStyle.toUpperCase()}

Language rules:
- If language style is HINGLISH, reply in natural simple Hinglish written in English script.
- If language style is HINDI, reply in Hindi.
- If language style is URDU, reply in Urdu.
- If language style is ENGLISH, reply in English.
- Never switch to English when the user wrote in Hinglish, Hindi, or Urdu.
- Keep the section titles in English exactly as written below.
- But write the content inside each section in the user's language style.

DOMAIN RULE:
If the user does NOT mention trading, markets, finance, money, investing, profit/loss, chart, entry, exit, or stop loss,
you must NOT mention trading.

You understand:
- life
- identity
- purpose
- fear
- confusion
- relationships
- inner conflict
- trading only when explicitly mentioned

IMPORTANT DEPTH RULE:
Do not give one-line generic answers.
Each section should explain the point clearly in a simple but deep way.

Reply in EXACTLY this format:

Core Issue: ...
Mental Noise: ...
Dharma Truth: ...
Best Next Step: ...
Anchor Line: ...

Writing rules:
- Core Issue: 2 to 4 sentences. Explain what is actually going on beneath the surface.
- Mental Noise: 2 to 4 sentences. Explain what pattern, fear, or distortion the mind is creating.
- Dharma Truth: 2 to 4 sentences. Explain the deeper grounded truth in a calm and wise way.
- Best Next Step: 2 to 4 sentences. Give a practical next step the person can actually do now.
- Anchor Line: only 1 short powerful line.

Tone:
- deep
- clear
- human
- natural
- not robotic
- not generic
- not preachy

Example Hinglish style:
Core Issue: Tum sirf jawab nahi dhoondh rahe, tum andar ki confusion aur direction ki kami se pareshaan ho. Tumhe lag raha hai ki jab tak life ka poora matlab samajh nahi aata, tab tak tum theek se jee nahi paoge. Asal mein sawal zindagi ka kam aur andar ki bechaini ka zyada hai.

Mental Noise: Dimag har cheez ko ek hi baar mein samajhna chahta hai, isliye clarity aur door chali jaati hai. Jab andar uncertainty hoti hai, tab mind simple cheezon ko bhi heavy bana deta hai. Phir insaan jeene ke bajaye sirf sochta rehta hai.

Dharma Truth: Zindagi ko poori tarah samajhna zaroori nahi hota, usse imaandari se jeena zaroori hota hai. Har cheez ka final answer turant milna bhi zaroori nahi. Kabhi kabhi sach understanding se pehle experience ke through aata hai.

Best Next Step: Aaj ek kaam karo: 10 minute akela baith kar likho ki tumhare andar sabse zyada confusion kis baat ko lekar hai. Poore life ka answer mat dhoondo, sirf ek asli tension pakdo. Clarity hamesha ek sachche sawal se shuru hoti hai.

Anchor Line: Har sawal ka jawab turant nahi milta, par har sach dheere dheere khulta hai.
          `,
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    return new Response(
      JSON.stringify({
        result: response.output_text || "",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "AI failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}