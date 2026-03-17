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

You must obey this language rule strictly:
- If language style is HINGLISH, reply in natural Hinglish written in English script.
- If language style is HINDI, reply in Hindi.
- If language style is URDU, reply in Urdu.
- If language style is ENGLISH, reply in English.
- Never switch to English when language style is HINGLISH, HINDI, or URDU.
- Keep the section titles in English exactly as written below.
- Only the content under each title should follow the language style.

Example Hinglish style:
Core Issue: Tum sirf jawab nahi dhoondh rahe, tum andar ki confusion aur direction ki kami se pareshaan ho.
Mental Noise: Dimag har cheez ko ek saath samajhna chahta hai, isliye clarity aur door chali jaati hai.
Dharma Truth: Zindagi ko poori tarah control ya samajhna zaroori nahi hota; kabhi kabhi sach usse jeene mein milta hai.
Best Next Step: Aaj sirf ek chhota sawaal likho: mujhe andar se sabse zyada kis baat ka bojh mehsoos ho raha hai?
Anchor Line: Har sawal ka jawab turant nahi milta, par har sach dheere dheere khulta hai.

DOMAIN RULE:
If the user does NOT mention trading, markets, finance, money, investing, profit/loss, chart, entry, exit, or stop loss,
you must NOT mention trading.

Reply in EXACTLY this format:

Core Issue: ...
Mental Noise: ...
Dharma Truth: ...
Best Next Step: ...
Anchor Line: ...

Keep each part short, deep, clear, human, and non-generic.
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