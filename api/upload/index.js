const { putObject } = require('../_utils/r2');

// Vercel API route for uploading NFT image and metadata to R2
module.exports = async function handler(req, res) {
  // CORS headers
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
    const { tokenId, image, metadata } = req.body;
    
    if (!tokenId || !metadata) {
      res.status(400).json({ error: 'Missing tokenId or metadata' });
      return;
    }

    const baseUrl = process.env.R2_PUBLIC_URL || 'https://token-ccg.r2.dev';
    
    // Upload image if provided (base64 data URL)
    let imageUrl = null;
    if (image && image.startsWith('data:')) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const contentType = matches[1];
        const imageBuffer = Buffer.from(matches[2], 'base64');
        const imageKey = `images/${tokenId}.png`;
        
        await putObject({
          key: imageKey,
          body: imageBuffer,
          contentType: contentType
        });
        
        imageUrl = `${baseUrl}/${imageKey}`;
      }
    }
    
    // Build NFT metadata (OpenSea standard)
    const nftMetadata = {
      name: metadata.name || `TOKEN Card #${tokenId}`,
      description: metadata.description || 'A TOKEN CCG card on Base',
      image: imageUrl || metadata.image,
      external_url: `https://token-ccg.vercel.app/collection.html?card=${tokenId}`,
      attributes: [
        { trait_type: 'House', value: metadata.house },
        { trait_type: 'Faction', value: metadata.faction },
        { trait_type: 'Value', value: metadata.value },
        { trait_type: 'Card Name', value: metadata.cardName }
      ]
    };
    
    // Add optional attributes
    if (metadata.xp !== undefined) {
      nftMetadata.attributes.push({ trait_type: 'XP', value: metadata.xp, display_type: 'number' });
    }
    if (metadata.level !== undefined) {
      nftMetadata.attributes.push({ trait_type: 'Level', value: metadata.level, display_type: 'number' });
    }
    
    // Upload metadata JSON
    const metadataKey = `metadata/${tokenId}.json`;
    await putObject({
      key: metadataKey,
      body: JSON.stringify(nftMetadata, null, 2),
      contentType: 'application/json'
    });
    
    const metadataUrl = `${baseUrl}/${metadataKey}`;
    
    res.status(200).json({
      success: true,
      tokenId,
      imageUrl,
      metadataUrl
    });
    
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};
