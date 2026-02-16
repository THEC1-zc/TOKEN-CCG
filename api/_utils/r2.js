const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  if (!endpoint) {
    throw new Error('Missing R2_ENDPOINT');
  }
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
    }
  });
}

async function putObject({ key, body, contentType }) {
  const Bucket = process.env.R2_BUCKET;
  if (!Bucket) throw new Error('Missing R2_BUCKET');
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  });
  await client.send(cmd);
}

async function getObject({ key }) {
  const Bucket = process.env.R2_BUCKET;
  if (!Bucket) throw new Error('Missing R2_BUCKET');
  const client = getR2Client();
  const cmd = new GetObjectCommand({
    Bucket,
    Key: key
  });
  return client.send(cmd);
}

module.exports = { getR2Client, putObject, getObject };
