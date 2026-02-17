const { putObject } = require('./_utils/r2');

// PUBLIC endpoint - no admin key required
// Protection: user must pay gas to mint, that's the anti-spam

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

function getPublicBaseUrl() {
  const base = process.env.R2_PUBLIC_BASE_URL || '';
  return base.replace(/\/+$/, '');
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body || {};
    
    // Required: tokenId (proves mint happened)
    const tokenId = String(body.tokenId || '').trim();
    if (!tokenId) {
      res.status(400).json({ error: 'Missing tokenId' });
      return;
    }
    
    // Card metadata
    const name = String(body.name || `TOKEN Card #${tokenId}`).trim();
    const description = String(body.description || 'A TOKEN CCG card on Base').trim();
    const house = String(body.house || '').toLowerCase();
    const faction = String(body.faction || '').toUpperCase();
    const value = String(body.value || '').toUpperCase();
    const factionIcon = String(body.factionIcon || '❓');
    const xp = Number(body.xp || 0);
    const level = Number(body.level || 1);

    if (!house || !faction || !value) {
      res.status(400).json({ error: 'Missing required fields (house, faction, value)' });
      return;
    }

    // Upload image
    const imageDataUrl = body.imageDataUrl || '';
    const parsed = parseDataUrl(imageDataUrl);
    
    let imageUrl = '';
    if (parsed && parsed.mime.startsWith('image/')) {
      const ext = parsed.mime.split('/')[1] || 'png';
      const imageKey = `cards/${tokenId}.${ext}`;
      await putObject({
        key: imageKey,
        body: Buffer.from(parsed.base64, 'base64'),
        contentType: parsed.mime
      });
      imageUrl = `${getPublicBaseUrl()}/${imageKey}`;
    } else {
      res.status(400).json({ error: 'Invalid or missing imageDataUrl' });
      return;
    }

    // Build metadata (OpenSea standard)
    const metadata = {
      name,
      description,
      image: imageUrl,
      external_url: `https://token-ccg.vercel.app/collection.html?card=${tokenId}`,
      attributes: [
        { trait_type: 'House', value: house },
        { trait_type: 'Faction', value: faction },
        { trait_type: 'Value', value: value },
        { trait_type: 'XP', value: xp, display_type: 'number' },
        { trait_type: 'Level', value: level, display_type: 'number' },
        { trait_type: 'Faction Icon', value: factionIcon }
      ]
    };

    // Upload metadata
    const metadataKey = `metadata/${tokenId}.json`;
    await putObject({
      key: metadataKey,
      body: Buffer.from(JSON.stringify(metadata, null, 2), 'utf8'),
      contentType: 'application/json'
    });

    const tokenUri = `${getPublicBaseUrl()}/${metadataKey}`;
    
    res.status(200).json({ 
      ok: true, 
      tokenId, 
      tokenUri, 
      imageUrl 
    });
    
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err?.message || 'Server error' });
  }
};
