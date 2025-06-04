export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return new Response('Only POST allowed', { status: 405 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'Missing image file' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const imgurForm = new FormData();
  imgurForm.append('image', file);

  const imgurRes = await fetch('https://api.imgur.com/3/upload?client_id=546c25a59c58ad7', {
    method: 'POST',
    body: imgurForm,
    headers: {
      'Authorization': 'Client-ID 546c25a59c58ad7'
    }
  });

  const json = await imgurRes.json();

  return new Response(JSON.stringify(json), {
    status: imgurRes.status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
