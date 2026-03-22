import type { PhotoScore } from "../hooks/usePhotoScoring";

// Realistic mock scores that cover a variety of room types and score ranges
export const MOCK_SCORES: PhotoScore[] = [
  { index: 0,  score: 9.2, roomType: "kitchen",      recommended: true,  traits: ["natural light", "clean counters", "wide angle"],         reasoning: "Excellent natural light with clean staging and strong composition." },
  { index: 1,  score: 8.7, roomType: "living room",  recommended: true,  traits: ["bright", "open layout", "hardwood floors"],              reasoning: "Inviting space with great light and well-staged furniture." },
  { index: 2,  score: 8.4, roomType: "exterior",     recommended: true,  traits: ["curb appeal", "landscaping", "blue sky"],                reasoning: "Strong curb appeal with attractive landscaping and good sky." },
  { index: 3,  score: 8.1, roomType: "primary bed",  recommended: true,  traits: ["spacious", "natural light", "neutral tones"],            reasoning: "Spacious feel with neutral staging and good natural light." },
  { index: 4,  score: 7.8, roomType: "backyard",     recommended: true,  traits: ["covered patio", "large yard", "landscaping"],            reasoning: "Great outdoor space with covered patio, appealing to Austin buyers." },
  { index: 5,  score: 7.5, roomType: "dining room",  recommended: true,  traits: ["open to kitchen", "natural light", "modern fixture"],    reasoning: "Nice flow from dining to kitchen with good lighting." },
  { index: 6,  score: 7.2, roomType: "bathroom",     recommended: true,  traits: ["updated fixtures", "clean", "good tile"],                reasoning: "Updated finishes and clean presentation." },
  { index: 7,  score: 6.8, roomType: "bedroom",      recommended: false, traits: ["decent size", "carpet", "average light"],               reasoning: "Average room with nothing particularly compelling." },
  { index: 8,  score: 6.1, roomType: "bathroom",     recommended: false, traits: ["functional", "dated fixtures", "small"],                reasoning: "Functional but dated — only include if no better option." },
  { index: 9,  score: 5.4, roomType: "laundry",      recommended: false, traits: ["dated", "cluttered", "poor lighting"],                  reasoning: "Below average — cluttered and poorly lit." },
  { index: 10, score: 4.2, roomType: "garage",       recommended: false, traits: ["cluttered", "poor angle", "unflattering"],              reasoning: "Cluttered garage shot adds little value to the listing." },
  { index: 11, score: 3.1, roomType: "bedroom",      recommended: false, traits: ["dark", "blurry", "cluttered"],                         reasoning: "Poor lighting and clutter make this a weak photo." },
];

export const MOCK_DESCRIPTION = `Tucked in the heart of Austin, this beautifully maintained home 
blends modern updates with everyday livability. Sunlight pours through oversized windows into a 
thoughtfully designed kitchen featuring clean quartz countertops, stainless appliances, and an 
island perfect for morning coffee or evening entertaining.

The open living and dining layout flows effortlessly to a covered back patio — the kind of outdoor 
space Austin buyers dream about. Mature landscaping and a generous yard give you privacy without 
sacrificing that indoor-outdoor connection that defines the Texas lifestyle.

The primary suite offers a quiet retreat with natural light, neutral finishes, and room to breathe. 
Updated bathrooms throughout reflect careful attention to detail, while original hardwood floors 
anchor the home with warmth and character.

Located minutes from South Congress, Barton Springs, and the best of what Austin has to offer — 
this one checks every box. Schedule your showing today before it's gone.`;

// Simulate API delay so the UI behaves realistically during testing
export function mockDelay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
