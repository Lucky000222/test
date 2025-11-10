export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { getIP } from '../proxy/getIp';

export async function GET(request) {
  console.log("API route called with URL:", request.url);

  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const timestamp = searchParams.get('timestamp');

  console.log("Parameters:", { address, timestamp });

  if (!address || !timestamp) {
    return Response.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const ipData = await getIP();
    console.log("IP Data:  ", ipData);
    if (ipData?.msg && !ipData?.msg?.includes("白名单")) {
      return Response.json({ error: ipData.msg || "GET IP ERROR" }, { status: 400 });
    }

    // 构造代理URL：ipData 可能是字符串 "ip:port" 或对象 {ip: "xxx", port: "xxx"}
    let proxyUrl;
    if (typeof ipData === 'string') {
      proxyUrl = `http://${ipData}`;
    } else if (ipData?.ip && ipData?.port) {
      proxyUrl = `http://${ipData.ip}:${ipData.port}`;
    } else {
      return Response.json({ error: ipData }, { status: 400 });
    }
    console.log("使用代理URL: ", proxyUrl);

    const targetUrl = `https://four.meme/mapi/defi/v2/public/wallet-direct/wallet/address/verify?address=${address}&projectId=meme_100567380&timestamp=${timestamp}`;

    // Edge Runtime 兼容的代理方案
    // 方案1: 使用支持代理的 HTTP API 服务
    // 方案2: 直接使用 fetch（Cloudflare Workers 的 fetch 已经通过 Cloudflare 网络）

    let queryDataText;

    // 尝试使用代理 API 服务（如果可用）
    // 注意：需要替换为实际支持代理的 API 服务
    try {
      // 使用支持代理的 API 服务
      // 格式: https://proxy-api.com/proxy?target=URL&proxy=PROXY_URL
      // 这里使用一个通用的代理服务模式
      const proxyApiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

      const proxyResponse = await fetch(proxyApiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
        // Cloudflare Workers 的 fetch 支持 cf 配置
        cf: {
          cacheTtl: 0,
          cacheEverything: false,
        }
      });

      if (!proxyResponse.ok) {
        throw new Error(`Proxy API failed: ${proxyResponse.status}`);
      }

      const proxyData = await proxyResponse.json();
      // 代理服务返回格式: { status: {...}, contents: "..." }
      queryDataText = {
        statusCode: proxyData.status?.http_code || 200,
        data: proxyData.contents || proxyData.data || JSON.stringify(proxyData)
      };
    } catch (proxyError) {
      console.log("代理服务失败，尝试直接请求:", proxyError);

      // 方案2: 直接使用 fetch（Cloudflare Workers 的 fetch 已经通过 Cloudflare 网络）
      // 这可能会被目标 API 阻止，但可以尝试
      const directResponse = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'origin': 'https://four.meme',
          'referer': 'https://four.meme/',
        },
        cf: {
          cacheTtl: 0,
          cacheEverything: false,
        }
      });

      queryDataText = {
        statusCode: directResponse.status,
        data: await directResponse.text()
      };
    }

    console.log("响应状态码: ", queryDataText.statusCode);
    console.log("后端API返回:  ", queryDataText.data);

    if (queryDataText.statusCode && (queryDataText.statusCode < 200 || queryDataText.statusCode >= 300)) {
      return Response.json({
        error: `REQUEST ERROR`,
        statusCode: queryDataText.statusCode,
        message: queryDataText.data
      }, { status: queryDataText.statusCode });
    }

    // 尝试解析为 JSON
    let queryData;
    try {
      queryData = JSON.parse(queryDataText.data);
      // 如果 message 包含 "User is not eligible for TGE."，返回 true
      if ((queryData.message && queryData.message.includes("User is not eligible for TGE.") || queryData.data === true)) {
        return Response.json({ message: true }, { status: 200 });
      }
      // 如果 message 是 null，返回 false
      if (queryData.message === null) {
        return Response.json({ message: false }, { status: 200 });
      }



      // 其他情况返回原始数据
      return Response.json(queryData);
    } catch (error) {
      console.error("Error1111111111:", error);
      return Response.json({ message: "Internal server error" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error22222222:", error);
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
