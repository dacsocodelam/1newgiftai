"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateMockSuggestions,
  shouldSimulateError,
  getMockError,
} from "@/lib/mockAiService";

interface CardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  relationship?: string;
  occasion?: string;
  onAiThinkingChange?: (isThinking: boolean) => void; // Callback to control 3D sphere
}

type ToneType = "emotional" | "funny" | "formal";

// AI Suggestion Response Interfaces
interface AISuggestion {
  id: string;
  message: string;
  confidence?: number;
}

interface BackendSuggestionItem {
  id?: string;
  message?: string;
  text?: string;
  confidence?: number;
}

const CardCreator: React.FC<CardCreatorProps> = ({
  isOpen,
  onClose,
  relationship = "友人",
  occasion = "お祝い",
  onAiThinkingChange,
}) => {
  const [selectedTone, setSelectedTone] = useState<ToneType | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string>("");

  // AI Suggestion States
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiError, setAiError] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverInfo, setReceiverInfo] = useState("");

  const qrRef = useRef<HTMLDivElement>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Base URL for the card view page - prioritize NEXT_PUBLIC_SITE_URL for Ngrok
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = siteUrl
    ? `${siteUrl}/card/view`
    : typeof window !== "undefined"
      ? `${window.location.origin}/card/view`
      : "https://your-site.com/card/view";

  // Check if using fallback URL (not Ngrok)
  const isUsingFallbackUrl = !siteUrl;

  // Generate QR URL with encoded message
  const qrUrl = useMemo(() => {
    if (!editedMessage || !baseUrl) {
      return "https://giftai.example.com"; // Fallback valid URL
    }
    try {
      return `${baseUrl}?m=${encodeURIComponent(editedMessage)}&t=${
        selectedTone || "emotional"
      }`;
    } catch (error) {
      console.error("Error encoding message:", error);
      return "https://giftai.example.com";
    }
  }, [editedMessage, baseUrl, selectedTone]);

  // Tone options in Japanese with accent colors
  const toneOptions: {
    value: ToneType;
    label: string;
    icon: string;
    color: string;
    glowColor: string;
    accentColor: string;
  }[] = [
    {
      value: "emotional",
      label: "感動",
      icon: "💖",
      color: "from-pink-400 to-rose-500",
      glowColor: "shadow-[0_0_30px_rgba(236,72,153,0.6)]",
      accentColor: "#ec4899",
    },
    {
      value: "funny",
      label: "ユーモア",
      icon: "😂",
      color: "from-yellow-400 to-amber-500",
      glowColor: "shadow-[0_0_30px_rgba(251,191,36,0.6)]",
      accentColor: "#fbbf24",
    },
    {
      value: "formal",
      label: "フォーマル",
      icon: "🎊",
      color: "from-blue-400 to-indigo-500",
      glowColor: "shadow-[0_0_30px_rgba(59,130,246,0.6)]",
      accentColor: "#3b82f6",
    },
  ];

  // Fetch AI-generated messages when tone is selected
  const handleToneSelect = async (tone: ToneType) => {
    setSelectedTone(tone);
    setSelectedMessage("");
    setEditedMessage("");
    setMessages([]);
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/message`,
        {
          params: {
            tone,
            relationship,
            occasion,
          },
        },
      );

      if (response.data.messages && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
      } else {
        setError("メッセージの取得に失敗しました");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("AIメッセージの生成中にエラーが発生しました");
      // Set fallback messages
      const fallbackMessages: Record<ToneType, string[]> = {
        emotional: [
          "いつもありがとう、心から感謝💖",
          "あなたに出会えて幸せです✨",
          "特別なあなたへ、愛を込めて🌸",
        ],
        funny: [
          "また一つ歳とったね😂🎂",
          "いつも笑わせてくれてサンキュー🤣",
          "プレゼントより私が最高のギフト！😎",
        ],
        formal: [
          "心よりお祝い申し上げます🎊",
          "ご健勝をお祈りいたします🙏",
          "日頃の感謝を込めて贈ります✨",
        ],
      };
      setMessages(fallbackMessages[tone]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message selection with smooth animation
  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);

    // Clear any existing animation interval
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    // Animate text flowing into input - use Array.from to handle emojis properly
    setEditedMessage("");
    const chars = Array.from(message); // Split into proper characters including emojis
    let i = 0;
    animationIntervalRef.current = setInterval(() => {
      if (i <= chars.length) {
        setEditedMessage(chars.slice(0, i).join(""));
        i++;
      } else {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
      }
    }, 30);
  };

  // ============================================
  // AI SUGGESTION FEATURE - Backend Integration
  // ============================================

  /**
   * Fetch AI-generated message suggestions from Rails backend
   * POST /api/ai/suggestions
   * Params: { tone, receiver, relationship, occasion }
   *
   * Set NEXT_PUBLIC_USE_MOCK_AI=true to use mock service (no backend needed)
   */
  const fetchAiSuggestions = async () => {
    if (!selectedTone) {
      setAiError("まずトーンを選択してください");
      return;
    }

    setIsAiThinking(true);
    setAiError("");
    setAiSuggestions([]);

    // Notify parent component (for 3D sphere glow/rotation effect)
    if (onAiThinkingChange) {
      onAiThinkingChange(true);
    }

    try {
      // Check if using mock service (for testing without backend)
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK_AI === "true";

      let response;

      if (useMock) {
        // Use mock service for local testing
        console.log("🧪 Using Mock AI Service");

        // Simulate error sometimes
        if (shouldSimulateError()) {
          throw new Error(getMockError());
        }

        response = await generateMockSuggestions(
          selectedTone,
          receiverName || "大切な人",
          receiverInfo || relationship,
          occasion,
        );
      } else {
        // Use real backend API
        console.log("🌐 Using Real Backend API");
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://1newgiftai.onrender.com";

        const apiResponse = await axios.post(
          `${backendUrl}/api/ai/suggestions`,
          {
            tone: selectedTone,
            receiver: receiverName || "大切な人",
            relationship: receiverInfo || relationship,
            occasion: occasion,
          },
          {
            timeout: 15000,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        response = apiResponse.data;
      }

      // Parse and validate response
      if (response && Array.isArray(response.suggestions)) {
        const suggestions = response.suggestions.map(
          (item: BackendSuggestionItem, index: number) => ({
            id: item.id || `suggestion-${index}`,
            message: item.message || item.text || "",
            confidence: item.confidence || 0.9,
          }),
        );

        setAiSuggestions(suggestions);

        // Auto-select first suggestion if available
        if (suggestions.length > 0) {
          // Optional: Auto-fill first suggestion with delay
          setTimeout(() => {
            handleMessageSelect(suggestions[0].message);
          }, 500);
        }
      } else {
        throw new Error("Invalid response format from backend");
      }
    } catch (err: unknown) {
      console.error("AI Suggestion Error:", err);
      const error = err as {
        code?: string;
        response?: { status?: number };
        message?: string;
      };

      if (error.code === "ECONNABORTED") {
        setAiError("⏰ タイムアウト: サーバーの応答が遅すぎます");
      } else if (error.response?.status === 500) {
        setAiError("🔧 サーバーエラー: 後でもう一度お試しください");
      } else if (error.response?.status === 429) {
        setAiError("⚠️ リクエスト制限: しばらく待ってください");
      } else {
        setAiError("❌ AI生成エラー: " + (error.message || "不明なエラー"));
      }

      // Fallback to manual suggestions on error
      setAiSuggestions([
        {
          id: "fallback-1",
          message: "心を込めて贈ります✨",
          confidence: 0.8,
        },
        {
          id: "fallback-2",
          message: "いつもありがとう💖",
          confidence: 0.7,
        },
        {
          id: "fallback-3",
          message: "幸せをお祈りします🌸",
          confidence: 0.6,
        },
      ]);
    } finally {
      setIsAiThinking(false);

      // Reset 3D sphere state
      if (onAiThinkingChange) {
        onAiThinkingChange(false);
      }
    }
  };

  // Handle QR download as PNG
  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      setDownloadStatus("ダウンロード中...");

      // Convert QR code to PNG
      const dataUrl = await toPng(qrRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `gift-card-qr-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadStatus("✅ ダウンロード完了！");
      setTimeout(() => setDownloadStatus(""), 3000);
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus("❌ ダウンロード失敗");
      setTimeout(() => setDownloadStatus(""), 3000);
    }
  };

  // Handle copy link to clipboard
  const handleCopyLink = async () => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(qrUrl);
        setCopyStatus("✅ リンクをコピーしました！");
      } else {
        // Fallback method for older browsers or non-secure context
        const textArea = document.createElement("textarea");
        textArea.value = qrUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopyStatus("✅ リンクをコピーしました！");
        } else {
          throw new Error("Copy command failed");
        }
      }
      setTimeout(() => setCopyStatus(""), 3000);
    } catch (error) {
      console.error("Copy error:", error);
      setCopyStatus("❌ コピー失敗");
      setTimeout(() => setCopyStatus(""), 3000);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Clear animation interval
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }

      setSelectedTone(null);
      setMessages([]);
      setSelectedMessage("");
      setEditedMessage("");
      setError("");
      setAiSuggestions([]);
      setAiError("");
      setReceiverName("");
      setReceiverInfo("");
    }

    // Cleanup on unmount
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Get current tone config for accent color
  const currentTone = toneOptions.find((t) => t.value === selectedTone);
  const accentColor = currentTone?.accentColor || "#ec4899";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Space Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal - Split View */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden z-10 border border-white/10"
          >
            {/* Glass Header */}
            <div className="sticky top-0 bg-white/10 backdrop-blur-xl border-b border-white/10 text-white p-6 z-20">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-3xl">🎴</span>
                  <div>
                    <h2 className="text-2xl font-bold">デジタルカード作成</h2>
                    <p className="text-sm text-blue-200">
                      AIが素敵なメッセージを提案します
                    </p>
                  </div>
                </motion.div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="閉じる"
                  type="button"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Split View Content */}
            <div className="grid lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Left Panel - Controls */}
              <div className="space-y-6">
                {/* Step 1: Tone Selection */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: accentColor }}
                    >
                      1
                    </span>
                    トーンを選択
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {toneOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleToneSelect(option.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          selectedTone === option.value
                            ? `border-white/30 bg-gradient-to-r ${option.color} text-white ${option.glowColor}`
                            : "border-white/10 hover:border-white/30 bg-white/5 backdrop-blur-sm text-white/80"
                        }`}
                      >
                        <motion.div
                          animate={
                            selectedTone === option.value
                              ? { scale: [1, 1.2, 1] }
                              : {}
                          }
                          transition={{ duration: 0.5 }}
                          className="text-3xl mb-2"
                        >
                          {option.icon}
                        </motion.div>
                        <div className="font-bold text-sm">{option.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Step 1.5: AI Suggestion Input (NEW) */}
                <AnimatePresence>
                  {selectedTone && (
                    <motion.div
                      initial={{ x: -20, opacity: 0, height: 0 }}
                      animate={{ x: 0, opacity: 1, height: "auto" }}
                      exit={{ x: -20, opacity: 0, height: 0 }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: accentColor }}
                          >
                            🤖
                          </span>
                          AI自動作成
                        </h3>
                      </div>

                      {/* Receiver Info Inputs */}
                      <div className="space-y-3 mb-4">
                        <input
                          type="text"
                          placeholder="受け取る人の名前 (任意)"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all"
                        />
                        <input
                          type="text"
                          placeholder="関係性の詳細 (例: 親友、上司、恋人)"
                          value={receiverInfo}
                          onChange={(e) => setReceiverInfo(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all"
                        />
                      </div>

                      {/* AI Generate Button */}
                      <motion.button
                        onClick={fetchAiSuggestions}
                        disabled={isAiThinking}
                        whileHover={!isAiThinking ? { scale: 1.02 } : {}}
                        whileTap={!isAiThinking ? { scale: 0.98 } : {}}
                        className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                          isAiThinking
                            ? "bg-white/10 cursor-not-allowed"
                            : "bg-gradient-to-r backdrop-blur-sm border border-white/20"
                        }`}
                        style={{
                          background: !isAiThinking
                            ? `linear-gradient(135deg, ${accentColor}80, ${accentColor}60)`
                            : undefined,
                          boxShadow: !isAiThinking
                            ? `0 0 30px ${accentColor}60`
                            : undefined,
                        }}
                      >
                        {isAiThinking ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="text-2xl"
                            >
                              ⚡
                            </motion.div>
                            <span>AI思考中...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">✨</span>
                            <span>AI に提案してもらう</span>
                          </>
                        )}
                      </motion.button>

                      {/* AI Error Display */}
                      {aiError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm backdrop-blur-sm"
                        >
                          {aiError}
                        </motion.div>
                      )}

                      {/* AI Suggestions Display - Glassmorphism Mini Cards */}
                      <AnimatePresence>
                        {aiSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-2"
                          >
                            <p className="text-white/70 text-sm mb-2">
                              💡 AI が提案したメッセージ:
                            </p>
                            <motion.div
                              variants={{
                                show: {
                                  transition: {
                                    staggerChildren: 0.1,
                                  },
                                },
                              }}
                              initial="hidden"
                              animate="show"
                              className="space-y-2"
                            >
                              {aiSuggestions.map((suggestion, index) => (
                                <motion.button
                                  key={suggestion.id}
                                  variants={{
                                    hidden: { opacity: 0, x: -20, scale: 0.9 },
                                    show: { opacity: 1, x: 0, scale: 1 },
                                  }}
                                  onClick={() =>
                                    handleMessageSelect(suggestion.message)
                                  }
                                  whileHover={{ scale: 1.02, x: 5 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full text-left p-4 rounded-xl border backdrop-blur-md transition-all duration-300 bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15"
                                  style={{
                                    boxShadow: `0 4px 15px ${accentColor}20`,
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-xl">
                                      {index === 0
                                        ? "🌟"
                                        : index === 1
                                          ? "💫"
                                          : "✨"}
                                    </span>
                                    <div className="flex-1">
                                      <p className="text-white/90">
                                        {suggestion.message}
                                      </p>
                                      {suggestion.confidence && (
                                        <div className="mt-2 flex items-center gap-2">
                                          <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{
                                                width: `${suggestion.confidence * 100}%`,
                                              }}
                                              transition={{
                                                delay: 0.3 + index * 0.1,
                                              }}
                                              className="h-full rounded-full"
                                              style={{
                                                background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs text-white/50">
                                            {Math.round(
                                              suggestion.confidence * 100,
                                            )}
                                            %
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.button>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 2: AI Message Selection (Original) */}
                <AnimatePresence>
                  {selectedTone && (
                    <motion.div
                      initial={{ x: -20, opacity: 0, height: 0 }}
                      animate={{ x: 0, opacity: 1, height: "auto" }}
                      exit={{ x: -20, opacity: 0, height: 0 }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
                    >
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: accentColor }}
                        >
                          2
                        </span>
                        AIおすすめメッセージ
                      </h3>

                      {isLoading ? (
                        <div className="text-center py-8">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "linear",
                            }}
                            className="inline-block text-4xl mb-3"
                          >
                            🤖
                          </motion.div>
                          <p className="text-white/70">
                            AIがメッセージを作成中...
                          </p>
                        </div>
                      ) : error ? (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 backdrop-blur-sm">
                          {error}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {messages.map((message, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleMessageSelect(message)}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                                selectedMessage === message
                                  ? "border-white/30 backdrop-blur-xl"
                                  : "border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-sm"
                              }`}
                              style={{
                                backgroundColor:
                                  selectedMessage === message
                                    ? `${accentColor}20`
                                    : undefined,
                                boxShadow:
                                  selectedMessage === message
                                    ? `0 0 20px ${accentColor}40`
                                    : undefined,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <motion.span
                                  animate={
                                    selectedMessage === message
                                      ? { scale: [1, 1.3, 1] }
                                      : {}
                                  }
                                  transition={{ duration: 0.3 }}
                                  className="text-xl"
                                >
                                  {selectedMessage === message ? "✅" : "💬"}
                                </motion.span>
                                <span className="text-white/90">{message}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Edit Message */}
                <AnimatePresence>
                  {selectedMessage && (
                    <motion.div
                      initial={{ x: -20, opacity: 0, height: 0 }}
                      animate={{ x: 0, opacity: 1, height: "auto" }}
                      exit={{ x: -20, opacity: 0, height: 0 }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
                    >
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: accentColor }}
                        >
                          3
                        </span>
                        メッセージを編集
                      </h3>
                      <motion.textarea
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        maxLength={100}
                        rows={3}
                        className="w-full p-4 border-2 border-white/20 rounded-xl outline-none transition-all resize-none bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-white/40"
                        style={{
                          boxShadow: `0 0 20px ${accentColor}20`,
                        }}
                        placeholder="メッセージを編集してください..."
                      />
                      <div className="text-right text-sm text-white/60 mt-2">
                        {editedMessage.length}/100文字
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Panel - Card Preview Canvas */}
              <div className="lg:sticky lg:top-6 h-fit">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 min-h-[400px] flex flex-col"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: accentColor }}
                    >
                      👁️
                    </span>
                    カードプレビュー
                  </h3>

                  {editedMessage ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                      {/* Card Preview */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-sm aspect-[3/4] rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                          boxShadow: `0 0 40px ${accentColor}60`,
                        }}
                      >
                        {/* Animated stars background */}
                        <div className="absolute inset-0 opacity-30">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                              animate={{
                                opacity: [0.2, 1, 0.2],
                                scale: [1, 1.5, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 2,
                              }}
                            />
                          ))}
                        </div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="relative z-10"
                        >
                          <div className="text-6xl mb-4">
                            {currentTone?.icon || "💖"}
                          </div>
                          <p className="text-white text-lg font-medium leading-relaxed px-4 backdrop-blur-sm bg-black/20 rounded-xl p-4">
                            {editedMessage}
                          </p>
                        </motion.div>
                      </motion.div>

                      {/* QR Code Section */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full"
                      >
                        {/* Ngrok Warning */}
                        {isUsingFallbackUrl && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl backdrop-blur-sm"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-amber-300">⚠️</span>
                              <div className="text-xs text-amber-100">
                                <p className="font-bold">外部スキャン注意</p>
                                <p>
                                  ローカルURLを使用中。Ngrok
                                  URLを設定してください。
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* QR Code with Scanline Effect */}
                        <div className="flex justify-center mb-4 relative">
                          <div
                            ref={qrRef}
                            className="relative inline-block bg-white p-4 rounded-2xl overflow-hidden"
                            style={{
                              boxShadow: `0 0 30px ${accentColor}60`,
                            }}
                          >
                            <QRCodeSVG
                              value={qrUrl}
                              size={180}
                              level="L"
                              includeMargin={true}
                              bgColor="#ffffff"
                              fgColor="#001f3f"
                            />
                            {/* Scanline Effect */}
                            <motion.div
                              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                              animate={{
                                top: ["0%", "100%"],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "linear",
                              }}
                            />
                          </div>
                        </div>

                        <p className="text-sm text-white/70 text-center mb-4">
                          QRコードをスキャンしてカードを表示
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            className="px-4 py-2 rounded-xl font-bold text-white text-sm flex items-center gap-2 backdrop-blur-sm border border-white/20"
                            style={{
                              background: `linear-gradient(135deg, ${accentColor}80, ${accentColor}60)`,
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            ダウンロード
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-green-500/60 backdrop-blur-sm rounded-xl font-bold text-white text-sm flex items-center gap-2 border border-white/20"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                            コピー
                          </motion.button>

                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={qrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-bold text-white text-sm flex items-center gap-2 border border-white/20"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            開く
                          </motion.a>
                        </div>

                        {/* Status Messages */}
                        <AnimatePresence>
                          {(downloadStatus || copyStatus) && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-3 text-center text-sm font-medium text-white/90"
                            >
                              {downloadStatus && <p>{downloadStatus}</p>}
                              {copyStatus && <p>{copyStatus}</p>}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-white/50 text-center p-8">
                      <div>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-6xl mb-4"
                        >
                          🎴
                        </motion.div>
                        <p className="text-lg">
                          トーンを選択してメッセージを作成
                        </p>
                        <p className="text-sm mt-2">
                          カードプレビューがここに表示されます
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Glass Footer */}
            <div className="sticky bottom-0 bg-white/10 backdrop-blur-xl border-t border-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70 flex items-center gap-2">
                  <span>🤖</span>
                  Powered by GiftAI
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-white/80 hover:text-white transition-colors font-medium hover:bg-white/10 rounded-lg"
                >
                  閉じる
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardCreator;
