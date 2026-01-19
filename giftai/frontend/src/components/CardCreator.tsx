"use client";
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { toPng } from "html-to-image";

interface CardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  relationship?: string;
  occasion?: string;
}

type ToneType = "emotional" | "funny" | "formal";

const CardCreator: React.FC<CardCreatorProps> = ({
  isOpen,
  onClose,
  relationship = "友人",
  occasion = "お祝い",
}) => {
  const [selectedTone, setSelectedTone] = useState<ToneType | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

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
  const qrUrl = editedMessage
    ? `${baseUrl}?m=${encodeURIComponent(editedMessage)}&t=${
        selectedTone || "emotional"
      }`
    : "";

  // Tone options in Japanese
  const toneOptions: {
    value: ToneType;
    label: string;
    icon: string;
    color: string;
  }[] = [
    {
      value: "emotional",
      label: "感動",
      icon: "💖",
      color: "from-pink-400 to-rose-500",
    },
    {
      value: "funny",
      label: "ユーモア",
      icon: "😂",
      color: "from-yellow-400 to-amber-500",
    },
    {
      value: "formal",
      label: "フォーマル",
      icon: "🎊",
      color: "from-blue-400 to-indigo-500",
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
      const response = await axios.get("http://localhost:3001/api/message", {
        params: {
          tone,
          relationship,
          occasion,
        },
      });

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

  // Handle message selection
  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
    setEditedMessage(message);
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
      setSelectedTone(null);
      setMessages([]);
      setSelectedMessage("");
      setEditedMessage("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#001f3f] to-[#003366] text-white p-6 rounded-t-3xl z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎴</span>
              <div>
                <h2 className="text-2xl font-bold">デジタルカード作成</h2>
                <p className="text-sm text-blue-200">
                  AIが素敵なメッセージを提案します
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 z-30"
              aria-label="閉じる"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Tone Selection */}
          <div>
            <h3 className="text-lg font-bold text-[#001f3f] mb-3 flex items-center gap-2">
              <span className="bg-[#FFD700] text-[#001f3f] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              トーンを選択
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleToneSelect(option.value)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedTone === option.value
                      ? `border-[#FFD700] bg-gradient-to-r ${option.color} text-white shadow-lg scale-105`
                      : "border-gray-200 hover:border-[#FFD700] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div
                    className={`font-bold ${
                      selectedTone === option.value
                        ? "text-white"
                        : "text-[#001f3f]"
                    }`}
                  >
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: AI Message Selection */}
          {selectedTone && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-[#001f3f] mb-3 flex items-center gap-2">
                <span className="bg-[#FFD700] text-[#001f3f] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                AIおすすめメッセージ
              </h3>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin text-4xl mb-3">
                    🤖
                  </div>
                  <p className="text-gray-600">AIがメッセージを作成中...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                  {error}
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleMessageSelect(message)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedMessage === message
                          ? "border-[#FFD700] bg-[#FFD700]/10 shadow-md"
                          : "border-gray-200 hover:border-[#FFD700]/50 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xl ${
                            selectedMessage === message ? "scale-125" : ""
                          } transition-transform`}
                        >
                          {selectedMessage === message ? "✅" : "💬"}
                        </span>
                        <span className="text-[#001f3f]">{message}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Edit Message */}
          {selectedMessage && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-[#001f3f] mb-3 flex items-center gap-2">
                <span className="bg-[#FFD700] text-[#001f3f] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                メッセージを編集
              </h3>
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                maxLength={100}
                rows={3}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 outline-none transition-all resize-none"
                placeholder="メッセージを編集してください..."
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {editedMessage.length}/100文字
              </div>
            </div>
          )}

          {/* Step 4: QR Preview */}
          {editedMessage && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-[#001f3f] mb-3 flex items-center gap-2">
                <span className="bg-[#FFD700] text-[#001f3f] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                QRコードプレビュー
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-[#FFD700]/5 rounded-2xl p-6 text-center">
                {/* Ngrok URL Warning */}
                {isUsingFallbackUrl && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500">⚠️</span>
                      <div className="text-sm">
                        <p className="font-bold text-amber-700">
                          外部スキャン注意
                        </p>
                        <p className="text-amber-600">
                          現在ローカルURLを使用しています。他のデバイスからスキャンするには、
                          <code className="bg-amber-100 px-1 rounded">
                            NEXT_PUBLIC_SITE_URL
                          </code>
                          をNgrok URLに設定してください。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current URL Display */}
                <div className="mb-4 p-2 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 break-all">
                    🔗 {qrUrl.substring(0, 60)}...
                  </p>
                </div>

                <div
                  ref={qrRef}
                  className="inline-block bg-white p-4 rounded-2xl shadow-lg"
                >
                  <QRCodeSVG
                    value={qrUrl}
                    size={200}
                    level="L"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#001f3f"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  このQRコードをスキャンすると、アニメーション付きのメッセージカードが表示されます
                </p>
                {!isUsingFallbackUrl && (
                  <p className="mt-2 text-xs text-green-600 flex items-center justify-center gap-1">
                    <span>✅</span> Ngrok URL設定済み - 外部スキャン可能
                  </p>
                )}

                {/* Status Messages */}
                {(downloadStatus || copyStatus) && (
                  <div className="mb-3 text-sm font-medium">
                    {downloadStatus && (
                      <p className="text-blue-600">{downloadStatus}</p>
                    )}
                    {copyStatus && (
                      <p className="text-green-600">{copyStatus}</p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-gradient-to-r from-[#001f3f] to-[#003366] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
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
                    リンクをコピー
                  </button>

                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
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
                    プレビュー
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>🤖</span>
              Powered by GiftAI
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-[#001f3f] transition-colors font-medium"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CardCreator;
