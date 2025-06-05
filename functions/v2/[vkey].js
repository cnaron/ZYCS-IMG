export async function onRequestPost({ request, params }) {
  const { url, method, headers, body } = request;
  const newUrl = new URL(url);
  const vkey = params.vkey; // 从路由参数获取 key

  // 实际代理上传到 imgur（或其它服务器）
  const proxyRes = await fetch(`https://i.imgur.com/${vkey}`, {
    method,
    headers,
    body
  });

  // ⚠️ 你这里没有上传逻辑，只是个代理上传入口
  // 所以这里只拼出代理后的访问地址，给 Worker 用
  const finalUrl = `https://imgur.cnaron.com/v2/${vkey}.jpeg`;

  return new Response(JSON.stringify({
    code: 200,
    data: {
      url: finalUrl
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
