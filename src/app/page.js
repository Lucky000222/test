'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const words = [
    "M", "ICNT", "CROSS", "AIN", "PAL", "BGSC", "FUEL", "ECHO", "NODE", "BOOM",
    "MPLX", "TALE", "OIK", "TANSSI", "RCADE", "VELVET", "C", "PEAQ", "SPA", "RION",
    "TAC", "TAKER", "BAS", "ESPORTS", "ERA", "TA", "G", "ZKWASM", "UPTOP", "COA",
    "YALA", "LN", "PHY", "ASP", "DELABS", "VAR", "PLAY", "RHEA", "TREE", "GAIA",
    "AIO", "NAORIS", "MIA", "MM", "TOSHI", "CYC", "DARK", "FIR", "SUP", "IN",
    "TOWNS", "X", "PROVE", "SLAY", "BSU", "K", "XCX", "GAME", "WAI", "SLAY",
    "OVL", "BTR", "PUBLIC", "TCOM", "REVA", "AIBOT", "PUBLIC", "DAM", "RICE", "MLK",
    "WILD", "DGC", "XPIN", "AKE", "ARIA", "SAPIEN", "FST", "HEMI", "MTP", "DORA",
    "TOWN", "TAKE", "DOLO", "CELB", "XLAB", "MITO", "BLUM", "XLAB", "ZENT", "PTB",
    "Q", "FOREST", "WOD", "HOLO", "PTB", "MCH", "BOT", "SOMI", "TRADOOR", "GATA",
    "U", "SHARDS", "BOOST", "STAR", "SAROS", "OPEN", "MIRROR", "REKT", "MORE", "CESS",
    "XO", "SAHARA", "H", "NEWT", "DMC", "MGO", "CARV", "BULLA", "BRIC", "LOT",
    "AVAIL", "MAT", "BEE", "SPK", "BOMB", "ULTI", "VELO", "F", "DEGEN", "ROAM",
    "SGC", "PUNDIAI", "IDOL", "HOME", "RESOLV", "SKATE", "OL", "AB", "FLY", "CUDIS",
    "LA", "ZRC", "BDXN", "EDGEN", "SQD", "TAIKO", "ASRR", "RDO", "SOPH", "PFVS",
    "ELDE", "HUMA", "OBT", "SOON", "RWA", "TGT", "MERL", "XTER", "REX", "AGT",
    "NXPC", "PRAI", "RDAC", "PUFFER", "DOOD", "OBOL", "ZKJ", "MYX", "BOOP", "B2",
    "HAEDAL", "MILK", "SIGN", "AIOT", "SWTCH", "POP", "AVNT", "LINEA", "PINGPONG", "UB",
    "AA", "ZEUS", "ALEO", "ZKC", "VLR", "STBL", "MAIGA", "AIA", "BARD", "RIVER",
    "JOJO", "DL", "AOP", "FROGGIE", "NUMI", "0G", "BLESS", "ZBT", "GAIN", "COAI",
    "XPL", "MIRA", "HANA", "GOATED", "LIGHT", "SERAPH", "XAN", "FF", "EDEN", "VFY",
    "STRIKE", "TRUTH", "2Z", "BTG", "EVAA", "P", "CYPR", "LYN", "KLINK", "KGEN",
    "SLX", "PIPE", "WAL", "EUL", "CDL", "CORL", "YB", "ENSO", "LAB", "CLO",
    "WBAI", "RECALL", "RVV", "ANOME", "SUBHUB", "MERL", "MYX", "SVSA", "SIGMA", "BLUAI"
  ];

  // 去重
  const uniqueWords = [...new Set(words)];

  // 生成随机位置和动画延迟，避免重叠，批次显示，避开中间表单框
  const generateRandomPositions = () => {
    const positions = [];
    const minDistance = 3; // 最小距离
    const wordsPerBatch = 50; // 增加单词数量，让页面更密集
    const batchDuration = 3; // 每批显示3秒

    // 中间表单框区域（需要避开）
    const formBoxTop = 35; // 表单框上边缘
    const formBoxBottom = 65; // 表单框下边缘
    const formBoxLeft = 15; // 表单框左边缘
    const formBoxRight = 85; // 表单框右边缘

    // 检查位置是否在表单框区域内
    const isInFormBoxArea = (top, left) => {
      return top >= formBoxTop && top <= formBoxBottom &&
        left >= formBoxLeft && left <= formBoxRight;
    };

    // 随机选择单词
    const shuffledWords = [...uniqueWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, wordsPerBatch);

    // 将页面分成网格，确保每个区域都有单词
    const gridRows = 5;
    const gridCols = 5;
    const gridPositions = [];

    // 为每个网格区域生成一个基础位置
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const topStart = (row / gridRows) * 100;
        const topEnd = ((row + 1) / gridRows) * 100;
        const leftStart = (col / gridCols) * 100;
        const leftEnd = ((col + 1) / gridCols) * 100;

        // 在这个网格区域内随机生成位置，避开表单框
        let attempts = 0;
        let top, left;
        do {
          top = topStart + Math.random() * (topEnd - topStart);
          left = leftStart + Math.random() * (leftEnd - leftStart);
          attempts++;
          // 限制在5%到95%之间，避免边缘
          top = Math.max(5, Math.min(95, top));
          left = Math.max(5, Math.min(95, left));
        } while (attempts < 20 && isInFormBoxArea(top, left));

        if (!isInFormBoxArea(top, left)) {
          gridPositions.push({ top, left, used: false });
        }
      }
    }

    // 随机打乱网格位置
    gridPositions.sort(() => Math.random() - 0.5);

    // 使用网格位置，剩余的随机生成
    let gridIndex = 0;
    for (let i = 0; i < selectedWords.length; i++) {
      let attempts = 0;
      let position;
      const batchIndex = Math.floor(i / wordsPerBatch);
      const showDelay = batchIndex * batchDuration;
      const hideDelay = showDelay + batchDuration - 1;

      do {
        // 优先使用网格位置，确保均匀分布
        if (gridIndex < gridPositions.length && !gridPositions[gridIndex].used) {
          position = {
            word: selectedWords[i],
            id: `${Date.now()}-${i}-${Math.random()}`,
            top: gridPositions[gridIndex].top,
            left: gridPositions[gridIndex].left,
            batchIndex: batchIndex,
            showDelay: showDelay,
            hideDelay: hideDelay,
            animationDuration: 1 + Math.random() * 2,
          };
          gridPositions[gridIndex].used = true;
          gridIndex++;
        } else {
          // 随机生成，但要避开表单框
          let top = Math.random() * 80 + 10;
          let left = Math.random() * 80 + 10;

          // 如果落在表单框区域，重新生成

          if (isInFormBoxArea(top, left)) {
            // 在表单框周围生成
            if (Math.random() > 0.5) {
              top = Math.random() * (formBoxTop - 10) + 5; // 表单框上方
            } else {
              top = Math.random() * (100 - formBoxBottom - 10) + formBoxBottom + 5; // 表单框下方
            }
            left = Math.random() * 80 + 10;
          }

          position = {
            word: selectedWords[i],
            id: `${Date.now()}-${i}-${Math.random()}`,
            top: top,
            left: left,
            batchIndex: batchIndex,
            showDelay: showDelay,
            hideDelay: hideDelay,
            animationDuration: 1 + Math.random() * 2,
          };
        }
        attempts++;
      } while (
        attempts < 100 &&
        positions.some(existing => {
          const distance = Math.sqrt(
            Math.pow(position.top - existing.top, 2) +
            Math.pow(position.left - existing.left, 2)
          );
          return distance < minDistance;
        })
      );

      if (position && !isInFormBoxArea(position.top, position.left)) {
        positions.push(position);
      }
    }

    return positions;
  };

  const [wordPositions, setWordPositions] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);  // 表单状态
  const [xHandle, setXHandle] = useState('');
  const [tweetLink, setTweetLink] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setValidationMessage('');

    // 验证所有字段不能为空
    if (!xHandle || !xHandle.trim()) {
      setValidationMessage('X HANDLE CANNOT BE EMPTY');
      setSubmitting(false);
      return;
    }

    if (!tweetLink || !tweetLink.trim()) {
      setValidationMessage('TWEET LINK CANNOT BE EMPTY');
      setSubmitting(false);
      return;
    }

    if (!walletAddress || !walletAddress.trim()) {
      setValidationMessage('BINANCE KEYLESS WALLET ADDRESS CANNOT BE EMPTY');
      setSubmitting(false);
      return;
    }

    try {
      const ts = Date.now().toString();

      // const queryResponse = await fetch("https://four.meme/mapi/defi/v2/public/wallet-direct/wallet/address/verify?address=" + walletAddress + "&projectId=meme_100567380&timestamp=" + ts,)

      // const queryData = await queryResponse.text();

      // 返回结果 - 确保返回格式与前端期望一致
      // console.log("前端 Response:", queryData);


      // 使用毫秒级时间戳；若后端需要秒，可改为 Math.floor(Date.now() / 1000)
      const url = `/api/validate-wallet?address=${walletAddress}&timestamp=${ts}`;
      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      const data = await res.text();
      console.log("data", data);
      let message = null;
      let messageObj = JSON.parse(data);
      // 获取token
      message = messageObj.message;
      // console.log("message", message);


      // 兼容多种返回结构
      if (message == true) {
        setValidationMessage('SUBMIT SUCCESS');
      } else if (message == false) {
        setValidationMessage('YOUR ADDRESS IS NOT A BINANCE KEYLESS WALLET ADDRESS, PLEASE RE-ENTER');
      } else {
        setValidationMessage('SUBMIT FAILED, PLEASE TRY AGAIN LATER');
      }

    } catch (err) {
      setValidationMessage(err?.message || 'REQUEST ERROR');
    } finally {
      setSubmitting(false);
    }
  };


  // 在客户端生成初始位置，避免 SSR 和客户端不一致
  useEffect(() => {
    // 初始生成位置
    setWordPositions(generateRandomPositions());

    // 无限循环显示 - 每3秒重新生成30个随机单词
    const timer = setInterval(() => {
      setCurrentBatch(prev => prev + 1);
      // 重新生成随机位置
      setWordPositions(generateRandomPositions());
    }, 3000); // 每3秒重新开始

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 动态渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/10"></div>

      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 146, 60, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 146, 60, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* 浮动粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-400/10 blur-sm"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          ></div>
        ))}
      </div>

      {/* 装饰性几何图形 */}
      <div className="absolute top-20 left-10 w-40 h-40 border border-orange-400/70 rotate-45 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-orange-400/70 rotate-12 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-20 w-20 h-20 border border-orange-400/70 -rotate-45 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 left-20 w-24 h-24 border border-orange-400/70 rotate-45 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>

      {/* 导航栏 */}
      <nav className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-orange-400/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-orange-400 pixel-font-large alpha-glow">
              ALPHA
            </div>
          </div>
        </div>
      </nav>

      {/* 中间的表单框 */}
      <div className="fixed inset-0 flex items-center justify-center z-20 pt-16">
        <div className="relative bg-black/90 backdrop-blur-md border-2 border-orange-400/50 rounded-lg p-8 w-full max-w-xl mx-4 shadow-[0_0_30px_rgba(251,146,60,0.4)] form-container">
          {/* 边框光晕动画 */}
          <div className="absolute inset-0 rounded-lg border-2 border-orange-400/30 animate-border-glow pointer-events-none"></div>

          <h2 className="text-orange-400 pixel-font-medium text-center mb-6 relative z-10">
            EXCLUSIVE AIRDROP FOR BINANCE KEYLESS WALLET
          </h2>
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="X HANDLE"
                className="w-full px-4 py-3 bg-black/50 border-2 border-orange-400/30 rounded focus:border-orange-400 focus:outline-none text-orange-400 placeholder-orange-400/50 pixel-font-medium transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,146,60,0.5)] focus:bg-black/70"
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="TWEET LINK"
                className="w-full px-4 py-3 bg-black/50 border-2 border-orange-400/30 rounded focus:border-orange-400 focus:outline-none text-orange-400 placeholder-orange-400/50 pixel-font-medium transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,146,60,0.5)] focus:bg-black/70"
                value={tweetLink}
                onChange={(e) => setTweetLink(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="BINANCE KEYLESS WALLET ADDRESS"
                className="w-full px-4 py-3 bg-black/50 border-2 border-orange-400/30 rounded focus:border-orange-400 focus:outline-none text-orange-400 placeholder-orange-400/50 pixel-font-medium transition-all duration-300 focus:shadow-[0_0_15px_rgba(251,146,60,0.5)] focus:bg-black/70"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="relative w-full py-3 bg-orange-400/20 border-2 border-orange-400 rounded text-orange-400 pixel-font-medium hover:bg-orange-400/30 hover:shadow-[0_0_25px_rgba(251,146,60,0.7)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="relative z-10">{submitting ? 'VALIDATING…' : 'SUBMIT'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/30 to-orange-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            {validationMessage && (
              <p className="text-center text-orange-300 pixel-font-small">{validationMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
