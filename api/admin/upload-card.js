const crypto = require('crypto');
const { putObject } = require('../_utils/r2');

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

function getHouseColors(house) {
  const palette = {
    bitcoin: ['#F7931A', '#FFD93D'],
    ethereum: ['#C0C0C0', '#E8E8E8'],
    base: ['#0052FF', '#5C9DFF'],
    tysm: ['#FCD34D', '#3B82F6']
  };
  return palette[house] || ['#1F2937', '#111827'];
}

function buildCardSvg({ house, faction, displayValue, icon }) {
  const colors = getHouseColors(house);
  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="720" viewBox="0 0 512 720">` +
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="${colors[0]}"/><stop offset="100%" stop-color="${colors[1]}"/></linearGradient></defs>` +
    `<rect width="512" height="720" rx="28" fill="#0B0B10"/>` +
    `<rect x="20" y="20" width="472" height="680" rx="24" fill="url(#bg)"/>` +
    `<rect x="40" y="40" width="432" height="640" rx="20" fill="rgba(6,6,12,0.82)"/>` +
    `<text x="256" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" fill="#FFFFFF" letter-spacing="6">TOKEN</text>` +
    `<text x="256" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#E5E7EB">${faction}</text>` +
    `<text x="256" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" fill="#FFFFFF">${displayValue}</text>` +
    `<text x="256" y="590" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" fill="#FFFFFF">${icon || ''}</text>` +
    `</svg>`;
}

function getPublicBaseUrl() {
  const base = process.env.R2_PUBLIC_BASE_URL || '';
  return base.replace(/\/+$/, '');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const adminKey = process.env.ADMIN_API_KEY || '';
  const headerKey = (req.headers['x-admin-key'] || '').toString();
  if (!adminKey || headerKey !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    const description = String(body.description || 'TOKEN CCG Card').trim();
    const house = String(body.house || '').toLowerCase();
    const faction = String(body.faction || '').toUpperCase();
    const value = String(body.value || '').toUpperCase();
    const displayValue = value === '11' ? 'J' : value;
    const factionIcon = String(body.factionIcon || '❓');
    const xp = Number(body.xp || 0);
    const level = Number(body.level || 1);

    if (!name || !house || !faction || !displayValue) {
      res.status(400).json({ error: 'Missing required fields (name, house, faction, value)' });
      return;
    }

    const id = String(body.tokenId || body.id || crypto.randomUUID());
    const imageDataUrl = body.imageDataUrl || '';
    const parsed = parseDataUrl(imageDataUrl);

    let imageKey = `cards/${id}.svg`;
    let imageUrl = '';
    if (parsed && parsed.mime.startsWith('image/')) {
      const ext = parsed.mime.split('/')[1] || 'png';
      imageKey = `cards/${id}.${ext}`;
      await putObject({
        key: imageKey,
        body: Buffer.from(parsed.base64, 'base64'),
        contentType: parsed.mime
      });
      imageUrl = `${getPublicBaseUrl()}/${imageKey}`;
    } else {
      const svg = buildCardSvg({ house, faction, displayValue, icon: factionIcon });
      await putObject({
        key: imageKey,
        body: Buffer.from(svg, 'utf8'),
        contentType: 'image/svg+xml'
      });
      imageUrl = `${getPublicBaseUrl()}/${imageKey}`;
    }

    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes: [
        { trait_type: 'house', value: house },
        { trait_type: 'faction', value: faction },
        { trait_type: 'value', value: displayValue },
        { trait_type: 'xp', value: xp },
        { trait_type: 'level', value: level },
        { trait_type: 'factionIcon', value: factionIcon }
      ]
    };

    const metadataKey = `metadata/${id}.json`;
    await putObject({
      key: metadataKey,
      body: Buffer.from(JSON.stringify(metadata), 'utf8'),
      contentType: 'application/json'
    });

    const tokenUri = `${getPublicBaseUrl()}/${metadataKey}`;
    res.status(200).json({ ok: true, tokenId: id, tokenUri, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
};
