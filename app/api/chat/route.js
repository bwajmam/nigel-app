export async function POST(request) {
  const { messages } = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Missing ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  if (!messages || !Array.isArray(messages)) {
    return Response.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json(
      { error: err || response.statusText },
      { status: response.status }
    );
  }

  const data = await response.json();
  const text =
    data.content?.find((block) => block.type === "text")?.text ?? "";

  return Response.json({ content: text });
}
