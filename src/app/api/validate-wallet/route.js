export const dynamic = 'force-dynamic';
export const runtime = 'edge';
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
    const queryResponse = await fetch("https://four.meme/mapi/defi/v2/public/wallet-direct/wallet/address/verify?address=" + address + "&projectId=meme_100567380&timestamp=" + timestamp)

    if (!queryResponse.ok) {
      throw new Error(`Failed to fetch token transactions: ${queryResponse.status}`);
    }

    const queryData = await queryResponse.json();

    // 检查API响应状态
    if (queryData.status === "0") {
      return Response.json({ error: "Etherscan API error", message: queryData.message, result: queryData.result }, { status: 400 });
    }

    // 返回结果 - 确保返回格式与前端期望一致
    console.log("API Response:", queryData);
    return Response.json(queryData);
  } catch (error) {
    console.error("Error1111:", error);
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
