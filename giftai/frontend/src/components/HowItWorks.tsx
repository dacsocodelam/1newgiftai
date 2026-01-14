export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "情報入力",
      description: "受取人の情報を提供：年齢、性別、趣味、関係性、予算",
      icon: "📝",
      details: [
        "年齢と性別",
        "趣味・性格",
        "あなたとの関係性",
        "予想予算",
        "特別な機会",
      ],
    },
    {
      step: "02",
      title: "AI分析",
      description:
        "賢いAIシステムが数千の商品とトレンドを分析し、最適な提案を見つけます",
      icon: "🤖",
      details: [
        "心理学分析",
        "トレンド比較",
        "予算照会",
        "機会別フィルタリング",
        "適合度計算",
      ],
    },
    {
      step: "03",
      title: "提案受取",
      description:
        "AIが厳選したギフトリストと、なぜそれが受取人に適しているかの理由を受け取ります",
      icon: "🎁",
      details: [
        "パーソナライズ提案",
        "理由説明",
        "多様な選択肢",
        "購入リンク",
        "適合度評価",
      ],
    },
    {
      step: "04",
      title: "追加サービス",
      description:
        "美しいギフト包装、手書きカード、急行配送などの追加サービスを選んで完璧なサプライズを作ります",
      icon: "✨",
      details: [
        "高級ギフト包装",
        "手書きカード",
        "急行配送",
        "配送時間選択",
        "サプライズサービス",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#001f3f]">
            ⚙️ GiftAIはどのように動作しますか？
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            簡単な情報から完璧なギフトまで - たった4つの簡単なステップで
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-[#001f3f] font-bold text-xl">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#001f3f] mb-2">
                      {step.icon} {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 rounded-2xl p-6">
                  <h4 className="font-semibold text-[#001f3f] mb-4">
                    ステップ{step.step}の詳細：
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  {/* Main Circle */}
                  <div className="w-64 h-64 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-6xl shadow-2xl">
                    {step.icon}
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#001f3f] rounded-full flex items-center justify-center text-white font-bold text-sm animate-bounce">
                    {step.step}
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-4xl text-[#FFD700] animate-pulse">
                      ↓
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-20 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-3xl p-8 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">
              🏆 なぜGiftAIを選ぶのか？
            </h3>
            <p className="text-gray-200">
              私たちのサービスを利用する優れたメリット
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                ⚡
              </div>
              <h4 className="font-bold mb-2">超高速</h4>
              <p className="text-gray-200 text-sm">
                わずか60秒で完璧なギフト提案を獲得
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🧠
              </div>
              <h4 className="font-bold mb-2">インテリジェント</h4>
              <p className="text-gray-200 text-sm">
                AIが心理学とトレンドを分析して正確な提案を行います
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💝
              </div>
              <h4 className="font-bold mb-2">パーソナライズ</h4>
              <p className="text-gray-200 text-sm">
                各提案は個人別にカスタマイズされます
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4 text-[#001f3f]">
            完璧なギフトを見つける準備はできましたか？
          </h3>
          <a
            href="#gift-finder"
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] px-8 py-4 rounded-full font-bold text-lg hover:from-[#001f3f] hover:to-[#003366] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
          >
            🎯 今すぐ始める
          </a>
        </div>
      </div>
    </section>
  );
}
