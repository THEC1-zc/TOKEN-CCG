const { getObject } = require('../_utils/r2');

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (c) => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const tokenId = String(req.query.tokenId || '').trim();
  if (!tokenId) {
    res.status(400).json({ error: 'Missing tokenId' });
    return;
  }

  try {
    const key = `metadata/${tokenId}.json`;
    const result = await getObject({ key });
    const body = await streamToBuffer(result.Body);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(body);
  } catch (err) {
    res.status(404).json({ error: 'Metadata not found' });
  }
};
