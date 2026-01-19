/**
 * Mock AI Service for Testing (without Rails backend)
 *
 * This service simulates AI suggestions locally for development/testing.
 * Replace with real backend API in production.
 */

type ToneType = "emotional" | "funny" | "formal";

interface MockSuggestion {
  id: string;
  message: string;
  confidence: number;
}

/**
 * Simulate API delay (1-3 seconds)
 */
const simulateDelay = () => {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 2000;
    setTimeout(resolve, delay);
  });
};

/**
 * Generate mock AI suggestions based on tone, receiver, relationship
 */
export const generateMockSuggestions = async (
  tone: ToneType,
  receiver: string,
  relationship: string,
  occasion: string,
): Promise<{ suggestions: MockSuggestion[] }> => {
  // Simulate network delay
  await simulateDelay();

  // Mock suggestion templates by tone
  const templates: Record<ToneType, string[]> = {
    emotional: [
      `${receiver || "あなた"}へ、心からの感謝を込めて💖`,
      `いつも支えてくれてありがとう、${relationship}として誇りです✨`,
      `${occasion}おめでとう！幸せが溢れますように🌸`,
      `出会えたことに感謝、これからもずっと一緒にいたい💕`,
      `${receiver || "大切な人"}の笑顔が私の宝物です🎁`,
    ],
    funny: [
      `${receiver || "あなた"}、また歳とったね！でも若く見えるよ😂`,
      `${occasion}だから、プレゼント期待しててね🎁💸`,
      `${relationship}の義務として、笑わせに来ました🤣`,
      `老けたけど、まだまだいける！ファイト💪😆`,
      `${receiver || "君"}がいると毎日が楽しい！サンキュー😎`,
    ],
    formal: [
      `${receiver || "○○"}様、心より${occasion}をお祝い申し上げます🎊`,
      `${relationship}として、日頃の感謝を込めて贈ります🙏`,
      `${occasion}を迎えられたこと、心よりお慶び申し上げます✨`,
      `益々のご健勝とご多幸をお祈りいたします🌟`,
      `これからも変わらぬご愛顧のほど、よろしくお願いいたします🎁`,
    ],
  };

  // Randomly select 3 suggestions
  const messages = templates[tone] || templates.emotional;
  const shuffled = [...messages].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  // Create mock suggestions with confidence scores
  const suggestions: MockSuggestion[] = selected.map((message, index) => ({
    id: `mock-suggestion-${Date.now()}-${index}`,
    message,
    confidence: 0.95 - index * 0.05, // Decreasing confidence
  }));

  return { suggestions };
};

/**
 * Simulate error (5% chance)
 */
export const shouldSimulateError = (): boolean => {
  return Math.random() < 0.05; // 5% chance of error
};

/**
 * Mock error messages
 */
export const getMockError = (): string => {
  const errors = [
    "⏰ タイムアウト: サーバーの応答が遅すぎます",
    "🔧 サーバーエラー: 後でもう一度お試しください",
    "⚠️ リクエスト制限: しばらく待ってください",
  ];
  return errors[Math.floor(Math.random() * errors.length)];
};
