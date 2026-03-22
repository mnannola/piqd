export const PHOTO_SCORING_SYSTEM = `You are an expert real estate photographer and listing 
specialist with deep knowledge of the Austin Texas market. Your job is to evaluate real estate 
listing photos and score them for quality.

For each photo you will assess:
- Lighting quality (natural light, brightness, shadows)
- Composition (angle, framing, use of space)
- Staging quality (cleanliness, decor, clutter)
- Emotional appeal (would this make a buyer want to see the property?)
- Room type (kitchen, bedroom, bathroom, living room, exterior, etc.)

You always respond with valid JSON only. No preamble, no markdown, no explanation outside the JSON.`;

export function buildScoringPrompt(photoCount: number): string {
  return `Score each of the ${photoCount} real estate photos provided.

Return a JSON array with one object per photo in this exact format:
[
  {
    "index": 0,
    "score": 8.5,
    "roomType": "kitchen",
    "traits": ["natural light", "clean counters", "wide angle"],
    "reasoning": "One sentence explanation of the score",
    "recommended": true
  }
]

Scoring guide:
- 9-10: Exceptional, must include
- 7-8: Strong, recommended
- 5-6: Average, include only if no better option
- 3-4: Below average, avoid
- 1-2: Poor quality, exclude

Set recommended: true for scores 7 and above.`;
}

export const DESCRIPTION_SYSTEM = `You are an expert real estate copywriter specializing in the 
Austin Texas market. You write compelling, accurate listing descriptions based on property photos 
and agent-provided details. Your descriptions highlight what buyers actually care about: 
light, space, finishes, lifestyle, and location. You never fabricate features not visible 
in the photos or stated by the agent.`;

export function buildDescriptionPrompt(details: PropertyDetails): string {
  return `Write a compelling MLS listing description for this Austin property based on the 
photos provided and the following details:

${details.beds ? `Bedrooms: ${details.beds}` : ""}
${details.baths ? `Bathrooms: ${details.baths}` : ""}
${details.sqft ? `Square footage: ${details.sqft}` : ""}
${details.neighborhood ? `Neighborhood: ${details.neighborhood}` : ""}
${details.highlights ? `Agent highlights: ${details.highlights}` : ""}

Requirements:
- 200-250 words
- Start with an attention-grabbing opening line, not the address
- Mention specific features you can actually see in the photos
- Weave in Austin lifestyle where relevant
- End with a call to action
- Professional but warm tone
- No ALL CAPS, no excessive exclamation points

Return only the description text, no additional commentary.`;
}

export interface PropertyDetails {
  beds?: string;
  baths?: string;
  sqft?: string;
  neighborhood?: string;
  highlights?: string;
}
