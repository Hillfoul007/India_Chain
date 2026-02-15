import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserData {
  delivery_count: number;
  kyc_verified: boolean;
  wallet_balance: number;
  shipment_count: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userData } = await req.json();

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    // Call Gemini API with tool use for structured output
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analyze the following on-chain activity and provide a credit score analysis:
                  
- Completed Deliveries: ${userData.delivery_count}
- KYC Verified: ${userData.kyc_verified ? "Yes" : "No"}
- Wallet Balance: ₹${userData.wallet_balance.toFixed(2)}
- Total Shipments: ${userData.shipment_count}

Provide a structured JSON response with:
1. score (0-1000)
2. factors object with:
   - delivery_reliability (0-100)
   - kyc_trust (0-100)
   - activity_volume (0-100)
   - financial_health (0-100)
3. analysis (brief text explanation)

Return ONLY valid JSON.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate and ensure proper structure
    const creditScore = {
      score: Math.min(1000, Math.max(0, parseInt(result.score) || 500)),
      factors: {
        delivery_reliability: Math.min(
          100,
          Math.max(0, result.factors?.delivery_reliability || 50)
        ),
        kyc_trust: Math.min(100, Math.max(0, result.factors?.kyc_trust || 50)),
        activity_volume: Math.min(
          100,
          Math.max(0, result.factors?.activity_volume || 50)
        ),
        financial_health: Math.min(
          100,
          Math.max(0, result.factors?.financial_health || 50)
        ),
      },
      analysis: result.analysis || "Unable to generate analysis",
    };

    return new Response(JSON.stringify(creditScore), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-credit-score function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
