import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    const prompt = `You are a medical lab results formatter. Your job is to take raw, messy lab results and reformat them into a clean, easy-to-read format for sharing in patient community groups (like Facebook thyroid groups).

FORMAT RULES:
- Test name in ALL CAPS
- Value immediately after the name on the same line
- Flag as (H) for high or (L) for low if outside reference range
- Reference range in parentheses with units on same line
- One blank line between each test
- At the end, add a brief plain-English summary of anything flagged (1-3 sentences max)
- Do NOT add medical advice or interpretations beyond flagging H/L
- Do NOT add headers or section dividers
- Keep it clean and plain — this will be pasted into a Facebook group comment

EXAMPLE OUTPUT:
FREE T3: 2.5 pg/mL (L) (ref: 2.0–4.4 pg/mL)

FREE T4: 1.1 ng/dL (ref: 0.8–1.8 ng/dL)

TSH: 1.82 mIU/L (ref: 0.4–4.5 mIU/L)

FERRITIN: 54 ng/mL (ref: 12–150 ng/mL)

Notes: Free T3 is technically in range but sits at the lower end — many people feel best in the upper half of range.

---

Now format these lab results. If a value is missing a reference range, just show the value without a range. If you can't parse something as a lab result, skip it.

RAW LAB DATA:
${text}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Anthropic API error ${response.status}: ${err}`)
    }

    const data = await response.json()
    const formatted = data.content?.[0]?.type === 'text' ? data.content[0].text : ''
    return NextResponse.json({ formatted })
  } catch (e) {
    console.error('Format labs error:', e)
    return NextResponse.json(
      { error: `Failed to format labs: ${e instanceof Error ? e.message : 'unknown'}` },
      { status: 500 }
    )
  }
}
