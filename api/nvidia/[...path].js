export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'Missing NVIDIA_API_KEY' });
  }

  const path = Array.isArray(request.query.path)
    ? request.query.path.join('/')
    : request.query.path;
  const upstreamUrl = `https://integrate.api.nvidia.com/${path || ''}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(request.body)
    });

    const payload = await upstreamResponse.text();
    response.status(upstreamResponse.status);
    response.setHeader('Content-Type', upstreamResponse.headers.get('content-type') || 'application/json');
    return response.send(payload);
  } catch (error) {
    return response.status(502).json({ error: error.message || 'NVIDIA request failed' });
  }
}
