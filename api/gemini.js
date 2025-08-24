// /api/gemini.js
export default async function handler(req, res) {
  // Allow only POST (and handle preflight for local dev)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const { prompt, history } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing 'prompt' string in body" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We forward only what we need. Gemini expects `contents`.
        body: JSON.stringify({
          contents: [
            ...(Array.isArray(history) ? history : []),
            { role: "user", parts: [{ text: prompt }] },
          ],
        }),
      }
    );

    // Guard against non-OK or empty responses
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res
        .status(response.status)
        .json({ error: "Upstream error", status: response.status, body: text });
    }

    const data = await response.json().catch(() => null);
    if (!data) {
      return res.status(502).json({ error: "Upstream returned no JSON" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
}
