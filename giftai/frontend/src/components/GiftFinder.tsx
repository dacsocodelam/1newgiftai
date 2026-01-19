"use client";
import { useState } from "react";
import GiftQuiz, { QuizData } from "./GiftQuiz";
import axios from "axios";

interface GiftFinderProps {
  onResults: (
    suggestions: string,
    products: any[],
    formData: QuizData,
    styleAnalysis?: any,
  ) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setLoadingMessage: (message: string) => void;
}

const GiftFinder: React.FC<GiftFinderProps> = ({
  onResults,
  isLoading,
  setIsLoading,
  setLoadingMessage,
}) => {
  const [useQuizMode, setUseQuizMode] = useState(true);
  const [styleAnalysis, setStyleAnalysis] = useState<any>(null);

  const loadingMessages = [
    "🔍 お客様の情報を分析中...",
    "🎯 AIが何千もの商品を検索中...",
    "💡 適合性を比較・評価中...",
    "✨個人の好みに合わせてカスタマイズ中...",
    "🎁 完了！素晴らしい結果を準備中...",
  ];

  const handleQuizComplete = async (quizData: QuizData) => {
    setIsLoading(true);
    setLoadingMessage(loadingMessages[0]);

    // Loading message animation
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < loadingMessages.length) {
        setLoadingMessage(loadingMessages[messageIndex]);
      }
    }, 1200);

    try {
      let analysisResult = null;

      // Step 1: Analyze style image if provided
      if (quizData.styleImage) {
        setLoadingMessage("📸 画像を分析中...");

        const reader = new FileReader();
        const imageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(quizData.styleImage!);
        });

        try {
          const analysisResponse = await axios.post(
            "http://localhost:3001/api/analyze_style",
            { image: imageBase64 },
            { timeout: 30000 }, // 30 second timeout
          );
          analysisResult = analysisResponse.data;
          setStyleAnalysis(analysisResult);
        } catch (error: any) {
          console.error("Image analysis error:", error);
          // Set fallback analysis result
          analysisResult = {
            analysis:
              "画像分析中にエラーが発生しました。デフォルト設定で続行します。",
            style_data: {
              style: "モダン",
              colors: ["ブルー", "ホワイト"],
              interests: ["ファッション", "ライフスタイル"],
              age_range: "20-30代",
              gift_categories: [
                "アクセサリー",
                "ファッション小物",
                "ライフスタイルグッズ",
              ],
            },
          };
          setStyleAnalysis(analysisResult);
        }
      }

      // Step 2: Get AI suggestions
      const suggestParams = {
        age: quizData.age,
        gender: quizData.gender,
        relationship: quizData.relationship,
        hobby: quizData.hobby,
        budget: quizData.budget,
        occasion: quizData.occasion,
        ...(analysisResult && {
          style_analysis: JSON.stringify(analysisResult.style_data),
        }),
      };

      const response = await axios.get("http://localhost:3001/api/suggest", {
        params: suggestParams,
      });

      clearInterval(messageInterval);
      setIsLoading(false);

      onResults(
        response.data.suggestions,
        response.data.products,
        quizData,
        analysisResult,
      );
    } catch (error) {
      clearInterval(messageInterval);
      setIsLoading(false);
      console.error("Error:", error);
      onResults(
        "提案の検索中にエラーが発生しました。もう一度お試しください！",
        [],
        quizData,
      );
    }
  };

  return (
    <div className="py-16">
      {/* Mode Toggle */}
      <div className="max-w-2xl mx-auto mb-8 flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-lg inline-flex gap-2">
          <button
            onClick={() => setUseQuizMode(true)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              useQuizMode
                ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] shadow-md"
                : "text-gray-600 hover:text-[#001f3f]"
            }`}
          >
            🎯 {t('giftFinder.quizMode')}
          </button>
          <button
            onClick={() => setUseQuizMode(false)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              !useQuizMode
                ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] shadow-md"
                : "text-gray-600 hover:text-[#001f3f]"
            }`}
          >
            📝 {t('giftFinder.formMode')}
          </button>
        </div>
      </div>

      {useQuizMode ? (
        <GiftQuiz onComplete={handleQuizComplete} isLoading={isLoading} />
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {t('giftFinder.formModeComingSoon')}
            </p>
          </div>
        </div>
      )}

      {styleAnalysis && !isLoading && (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 animate-slide-up-fade">
          <h3 className="text-lg font-bold text-[#001f3f] mb-3 flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            {t('giftFinder.styleAnalysis')}
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">{styleAnalysis.analysis}</p>
            {styleAnalysis.style_data && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {styleAnalysis.style_data.style && (
                  <div className="bg-white/60 px-3 py-2 rounded-lg">
                    <span className="font-medium">スタイル:</span>{" "}
                    {styleAnalysis.style_data.style}
                  </div>
                )}
                {styleAnalysis.style_data.age_range && (
                  <div className="bg-white/60 px-3 py-2 rounded-lg">
                    <span className="font-medium">年齢層:</span>{" "}
                    {styleAnalysis.style_data.age_range}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftFinder;
