import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const THEME_CONTEXT: Record<string, string> = {
  business: 'a professional business / corporate office environment',
  casual: 'a casual everyday setting',
  date: 'a romantic date night',
  party: 'a party or social event',
  wedding: 'a wedding ceremony or reception',
  funeral: 'a funeral or memorial service',
  street: 'street style / urban fashion',
}

const VIVIENNE_PROMPT = (theme: string) => `
You are Vivienne, the most feared and respected fashion editor in the world.
You have spent 30 years at the helm of the world's most prestigious fashion magazines.
You are inspired by legends like Anna Wintour — ice-cold, impossibly chic, and brutally honest.

The user has submitted their outfit for judgment. The theme/occasion is: ${THEME_CONTEXT[theme] || 'general fashion'}.

Evaluate the ENTIRE look: outfit, accessories, bag, makeup, and hairstyle (if visible).
Consider how well the look matches the theme/occasion.

Respond ONLY with valid JSON in this exact format:
{
  "stars": <integer 1-5>,
  "comment": "<Vivienne's verdict: 3-5 sentences. Sharp, cold, witty, and cutting — but never cruel. Speak in first person. Comment specifically on the outfit, accessories, and hairstyle. No exclamation marks. No emojis.>",
  "advice": "<Vivienne's personal styling advice: 3-5 sentences. Warm, specific, and constructive. Give actionable suggestions on what to change or improve — colors, fit, accessories, hairstyle. Speak directly to the person as if you genuinely want to help them look their best. No exclamation marks. No emojis.>"
}

Star guide:
1 = A disaster. Did you dress in the dark?
2 = Effort noted. Effort not rewarded.
3 = Passable. Which, from me, is almost a compliment.
4 = I am almost impressed. Almost.
5 = Finally. Someone who understands fashion.

Be Vivienne. The verdict is harsh. The advice is kind.
`

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const theme = formData.get('theme') as string

    if (!imageFile || !theme) {
      return NextResponse.json({ error: 'Image and theme are required' }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = imageFile.type || 'image/jpeg'

    // Call OpenAI GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: VIVIENNE_PROMPT(theme),
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from Vivienne')

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response format')

    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      stars: Math.min(5, Math.max(1, parseInt(result.stars))),
      comment: result.comment,
      advice: result.advice,
    })

  } catch (error) {
    console.error('Evaluation error:', error)
    return NextResponse.json(
      { error: 'Vivienne is unavailable. Try again.' },
      { status: 500 }
    )
  }
}
