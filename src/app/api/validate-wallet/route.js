export const dynamic = 'force-dynamic';
export const runtime = 'edge';
// import HttpProxyAgent from 'https-proxy-agent'
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
    const queryResponse = await fetch("https://four.meme/mapi/defi/v2/public/wallet-direct/wallet/address/verify?address=" + address + "&projectId=meme_100567380&timestamp=" + timestamp, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9",
        "if-none-match": "W/\"018ed0438666cf040556371eab2e58b11\"",
        // "priority": "u=1, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-arch": "\"x86\"",
        "sec-ch-ua-bitness": "\"64\"",
        "sec-ch-ua-full-version": "\"141.0.7390.123\"",
        "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"141.0.7390.123\", \"Not?A_Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"141.0.7390.123\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": "\"\"",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-ch-ua-platform-version": "\"19.0.0\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://four.meme/token/0x59537849f2a119ec698c7aa6c6daadc40c398a25",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    });
    // console.log(await queryResponse.text(), "queryResponse.text()", await queryResponse.status);

    const queryData = await queryResponse.text();

    // 返回结果 - 确保返回格式与前端期望一致
    console.log("API Response:", queryData);
    return Response.json(queryData);
  } catch (error) {
    console.error("Error1111:", error);
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
