export async function onRequest({ request }) {
  // 假设 Worker 收到 Telegram 图片后，imgBlob 是二进制内容
  // 这里只示例上传部分，其它业务逻辑你自己加

  const formData = await request.formData()
  const imgFile = formData.get('file') // 你自己的逻辑里拿到的图片

  // 构造新 FormData
  const body = new FormData()
  body.append('file', imgFile, 'image.jpg') // 注意参数名必须是 'file'

  // 上传到你自己的图床服务（自动代理到 Imgur）
  const uploadResRaw = await fetch('https://imgur.cnaron.com/api/upload', {
    method: 'POST',
    body
  })
  const uploadText = await uploadResRaw.text()

  let uploadRes
  try {
    uploadRes = JSON.parse(uploadText)
  } catch (e) {
    // 非 JSON 返回
    return new Response(JSON.stringify({ error: '非 JSON 返回', data: uploadText }), {
      status: 500
    })
  }

  const imgLink = uploadRes?.data?.link || uploadRes?.link

  if (!imgLink) {
    // 上传失败
    return new Response(JSON.stringify({ error: '图床上传失败', data: uploadText }), {
      status: 500
    })
  }

  // 上传成功，把链接发给 Telegram 或作为接口返回
  // 这里只是直接返回 json，你可以按你的 Bot 逻辑 sendMessage
  return new Response(JSON.stringify({ url: imgLink }), {
    headers: { 'content-type': 'application/json' }
  })
}
