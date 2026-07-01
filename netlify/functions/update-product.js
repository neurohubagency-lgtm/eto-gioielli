const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'neurohubagency-lgtm/eto-gioielli';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'eto-gioielli-admin',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getFileSha(path) {
  try {
    const res = await githubRequest('GET', `/repos/${GITHUB_REPO}/contents/${path}`);
    return res.status === 200 ? res.data.sha : null;
  } catch { return null; }
}

async function putFile(path, contentBase64, message) {
  const sha = await getFileSha(path);
  const body = { message, content: contentBase64 };
  if (sha) body.sha = sha;
  const res = await githubRequest('PUT', `/repos/${GITHUB_REPO}/contents/${path}`, body);
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`GitHub error ${res.status}: ${JSON.stringify(res.data)}`);
  }
}

function updateProductInJs(content, productId, updates) {
  const startIdx = content.indexOf(`{ id:'${productId}'`);
  if (startIdx === -1) return null;

  let depth = 0, i = startIdx;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { depth--; if (depth === 0) break; }
    i++;
  }
  const endIdx = i + 1;
  let block = content.substring(startIdx, endIdx);

  if (updates.photoUrl) {
    block = block.replace(/images:\['[^']*'\]/, `images:['${updates.photoUrl}']`);
  }
  if (updates.videoUrl) {
    if (block.includes("video:'")) {
      block = block.replace(/video:'[^']*'/, `video:'${updates.videoUrl}'`);
    } else {
      block = block.replace(/(images:\['[^']*'\])/, `$1, video:'${updates.videoUrl}'`);
    }
  }
  if (updates.descriptionRu) {
    const escaped = updates.descriptionRu.replace(/'/g, "\\'");
    block = block.replace(/description:\{ru:'[^']*'/, `description:{ru:'${escaped}'`);
  }
  if (updates.descriptionEn) {
    const escaped = updates.descriptionEn.replace(/'/g, "\\'");
    block = block.replace(/en:'[^']*'\}/, `en:'${escaped}'}`);
  }
  if (updates.price) {
    block = block.replace(/price:\d+/, `price:${parseInt(updates.price)}`);
  }
  if (updates.promoPrice) {
    if (block.includes('promoPrice:')) {
      block = block.replace(/promoPrice:\d+/, `promoPrice:${parseInt(updates.promoPrice)}`);
    }
  }

  return content.substring(0, startIdx) + block + content.substring(endIdx);
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  if (body.password !== ADMIN_PASSWORD) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Неверный пароль' }) };
  }

  const { productId, photoBase64, videoBase64, descriptionRu, descriptionEn, price, promoPrice } = body;

  if (!productId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'productId обязателен' }) };
  }

  try {
    const updates = {};

    if (photoBase64) {
      const photoPath = `assets/images/${productId}.jpg`;
      await putFile(photoPath, photoBase64, `update photo for ${productId}`);
      updates.photoUrl = photoPath;
    }

    if (videoBase64) {
      const videoPath = `assets/${productId}.mp4`;
      await putFile(videoPath, videoBase64, `update video for ${productId}`);
      updates.videoUrl = videoPath;
    }

    if (photoBase64 || videoBase64 || descriptionRu || price) {
      const productsRes = await githubRequest('GET', `/repos/${GITHUB_REPO}/contents/data/products.js`);
      const currentContent = Buffer.from(productsRes.data.content, 'base64').toString('utf-8');
      const sha = productsRes.data.sha;

      const newContent = updateProductInJs(currentContent, productId, { ...updates, descriptionRu, descriptionEn, price, promoPrice });
      if (!newContent) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: `Товар ${productId} не найден` }) };
      }

      if (newContent !== currentContent) {
        await putFile('data/products.js', Buffer.from(newContent).toString('base64'), `update ${productId} data`);
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
