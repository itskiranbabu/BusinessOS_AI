import { GoogleGenAI, Type } from "@google/genai";
import { BusinessBlueprint, SocialPost } from "../types";

// Initialize Gemini Client with Vite environment variables
const apiKey = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const blueprintSchema = {
  type: Type.OBJECT,
  properties: {
    businessName: { type: Type.STRING, description: "A catchy name for the fitness business" },
    niche: { type: Type.STRING, description: "The specific fitness niche (e.g. Postpartum weight loss, Senior mobility)" },
    targetAudience: { type: Type.STRING, description: "Description of the ideal client" },
    mission: { type: Type.STRING, description: "A short mission statement" },
    suggestedPrograms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 program names to sell"
    },
    websiteData: {
      type: Type.OBJECT,
      properties: {
        heroHeadline: { type: Type.STRING },
        heroSubhead: { type: Type.STRING },
        ctaText: { type: Type.STRING },
        features: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 key benefits/features"
        },
        pricing: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        testimonials: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              result: { type: Type.STRING },
              quote: { type: Type.STRING }
            }
          }
        }
      }
    },
    contentPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          day: { type: Type.INTEGER },
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          cta: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Video', 'Image', 'Carousel', 'Text'] }
        }
      },
      description: "A 5-day sample content plan"
    }
  },
  required: ["businessName", "niche", "websiteData", "contentPlan", "suggestedPrograms"]
};

export const generateBusinessBlueprint = async (userDescription: string): Promise<BusinessBlueprint | null> => {
  try {
    if (!ai || !apiKey) {
      console.warn("No API Key provided in environment variables. Returning mock data.");
      return getMockBlueprint();
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert business consultant for Fitness Coaches. 
      Create a complete business blueprint (Website copy, content plan, pricing) based on this user description: "${userDescription}".
      Focus on high-conversion copywriting and realistic fitness programming.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as BusinessBlueprint;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo purposes if API fails or key is missing
    return getMockBlueprint();
  }
};

export const regenerateContentPlan = async (niche: string): Promise<SocialPost[]> => {
  if (!ai || !apiKey) {
    console.warn("No API Key provided. Returning mock content.");
    return getMockBlueprint().contentPlan;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 fresh, viral social media post ideas for a fitness coach in the "${niche}" niche. 
      Focus on engagement and authority building.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              day: { type: Type.INTEGER },
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              cta: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Video', 'Image', 'Carousel', 'Text'] }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SocialPost[];
  } catch (error) {
    console.error("Content Gen Error", error);
    return [];
  }
};

// Fallback mock data generator to ensure app is usable without API key immediately
const getMockBlueprint = (): BusinessBlueprint => {
  return {
    businessName: "IronWill Fitness (Demo Mode)",
    niche: "Strength Training for Busy Dads",
    targetAudience: "Fathers over 30 who want to reclaim their athleticism",
    mission: "To help 10,000 dads get strong and pain-free.",
    suggestedPrograms: ["DadBod Destroyer", "Mobility Mastery", "Elite Dad Coaching"],
    websiteData: {
      heroHeadline: "Reclaim Your Prime Years",
      heroSubhead: "The premier strength system designed specifically for busy fathers. Get strong, lose fat, and have energy for your kids.",
      ctaText: "Start Your Transformation",
      features: ["30-Minute Workouts", "Custom Nutrition Plan", "24/7 Coach Access"],
      pricing: [
        { name: "Basic", price: "$97/mo", features: ["App Access", "Community"] },
        { name: "Pro", price: "$297/mo", features: ["Weekly Check-in", "Form Review"] }
      ],
      testimonials: [
        { name: "Mike T.", result: "Lost 20lbs", quote: "I feel 10 years younger." }
      ]
    },
    contentPlan: [
      { id: "1", day: 1, hook: "Stop doing crunches.", body: "They won't fix your belly.", cta: "DM 'CORE' for my guide", type: "Video" },
      { id: "2", day: 2, hook: "The dad breakfast hack.", body: "High protein, low time.", cta: "Comment 'RECIPE'", type: "Image" }
    ]
  };
};
