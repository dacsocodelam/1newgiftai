# 🤖 AI Suggestion Feature - Backend Integration Guide

## Overview

Tính năng "AI Suggestion" trong CardCreator.tsx cho phép người dùng tự động tạo lời chúc bằng AI dựa trên tone, receiver, relationship và occasion.

## Frontend Implementation ✅

### Component: `CardCreator.tsx`

#### New Props

```typescript
interface CardCreatorProps {
  // ... existing props
  onAiThinkingChange?: (isThinking: boolean) => void; // Callback để control 3D sphere
}
```

#### New States

```typescript
const [isAiThinking, setIsAiThinking] = useState(false);
const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
const [aiError, setAiError] = useState("");
const [receiverName, setReceiverName] = useState("");
const [receiverInfo, setReceiverInfo] = useState("");
```

#### API Call Function

```typescript
fetchAiSuggestions(); // POST /api/ai/suggestions
```

---

## Backend Requirements 🔧

### Rails API Endpoint

**Endpoint:** `POST /api/ai/suggestions`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "tone": "emotional" | "funny" | "formal",
  "receiver": "大切な人",
  "relationship": "友人",
  "occasion": "お祝い"
}
```

**Success Response (200 OK):**

```json
{
  "suggestions": [
    {
      "id": "suggestion-1",
      "message": "いつもありがとう、心から感謝💖",
      "confidence": 0.95
    },
    {
      "id": "suggestion-2",
      "message": "あなたに出会えて幸せです✨",
      "confidence": 0.9
    },
    {
      "id": "suggestion-3",
      "message": "特別なあなたへ、愛を込めて🌸",
      "confidence": 0.85
    }
  ]
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "error": "AI service unavailable"
}
```

---

## Rails Implementation Example

### 1. Create Controller

**File:** `backend/app/controllers/api/ai_controller.rb`

```ruby
module Api
  class AiController < ApplicationController
    # POST /api/ai/suggestions
    def suggestions
      tone = params[:tone] # "emotional", "funny", "formal"
      receiver = params[:receiver] || "大切な人"
      relationship = params[:relationship] || "友人"
      occasion = params[:occasion] || "お祝い"

      # Call AI service (OpenAI, Claude, or custom model)
      suggestions = AiMessageService.generate_suggestions(
        tone: tone,
        receiver: receiver,
        relationship: relationship,
        occasion: occasion
      )

      render json: {
        suggestions: suggestions.map.with_index do |message, index|
          {
            id: "suggestion-#{index + 1}",
            message: message,
            confidence: calculate_confidence(message, tone)
          }
        end
      }
    rescue StandardError => e
      Rails.logger.error("AI Suggestion Error: #{e.message}")
      render json: { error: "AI service unavailable" }, status: 500
    end

    private

    def calculate_confidence(message, tone)
      # Simple confidence calculation based on message length and tone
      base_confidence = 0.8
      length_bonus = [message.length / 100.0, 0.15].min
      base_confidence + length_bonus
    end
  end
end
```

### 2. Add Route

**File:** `backend/config/routes.rb`

```ruby
Rails.application.routes.draw do
  namespace :api do
    post 'ai/suggestions', to: 'ai#suggestions'
  end
end
```

### 3. Create AI Service

**File:** `backend/app/services/ai_message_service.rb`

```ruby
class AiMessageService
  # Using OpenAI GPT-4 as example
  def self.generate_suggestions(tone:, receiver:, relationship:, occasion:)
    # Initialize OpenAI client
    client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])

    # Build prompt based on tone
    prompt = build_prompt(tone, receiver, relationship, occasion)

    # Call OpenAI API
    response = client.chat(
      parameters: {
        model: "gpt-4",
        messages: [
          { role: "system", content: "あなたは日本語でギフトカードのメッセージを書く専門家です。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200
      }
    )

    # Parse response and extract 3 messages
    messages = parse_ai_response(response)
    messages.take(3)
  rescue => e
    Rails.logger.error("OpenAI Error: #{e.message}")
    # Return fallback messages
    fallback_messages(tone)
  end

  def self.build_prompt(tone, receiver, relationship, occasion)
    tone_descriptions = {
      "emotional" => "感動的で心温まる",
      "funny" => "ユーモアがあって楽しい",
      "formal" => "丁寧で礼儀正しい"
    }

    <<~PROMPT
      #{receiver}さん（#{relationship}）への#{occasion}のギフトカードメッセージを、
      #{tone_descriptions[tone]}トーンで3つ提案してください。

      条件:
      - 各メッセージは1行、30-50文字程度
      - 絵文字を1-2個含める
      - 心に響く言葉を選ぶ

      フォーマット: 各メッセージを改行で区切って出力
    PROMPT
  end

  def self.parse_ai_response(response)
    content = response.dig("choices", 0, "message", "content")
    content.split("\n").map(&:strip).reject(&:empty?)
  end

  def self.fallback_messages(tone)
    fallbacks = {
      "emotional" => [
        "いつもありがとう、心から感謝💖",
        "あなたに出会えて幸せです✨",
        "特別なあなたへ、愛を込めて🌸"
      ],
      "funny" => [
        "また一つ歳とったね😂🎂",
        "いつも笑わせてくれてサンキュー🤣",
        "プレゼントより私が最高のギフト！😎"
      ],
      "formal" => [
        "心よりお祝い申し上げます🎊",
        "ご健勝をお祈りいたします🙏",
        "日頃の感謝を込めて贈ります✨"
      ]
    }
    fallbacks[tone] || fallbacks["emotional"]
  end
end
```

### 4. Add Gem (if using OpenAI)

**File:** `backend/Gemfile`

```ruby
gem 'ruby-openai'
```

Then run:

```bash
bundle install
```

### 5. Environment Variables

**File:** `backend/.env`

```bash
OPENAI_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## Frontend Environment Variables

**File:** `frontend/.env.local`

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
# Or for production with Ngrok:
# NEXT_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok.io
```

---

## Testing

### Manual Test

1. Start Rails backend:

```bash
cd backend
rails server -p 3001
```

2. Start Next.js frontend:

```bash
cd frontend
npm run dev
```

3. Open browser and test:
   - Select a tone (感動/ユーモア/フォーマル)
   - Enter receiver name and relationship (optional)
   - Click "AI に提案してもらう"
   - Watch the 3D sphere glow (if `onAiThinkingChange` callback is implemented)
   - See 3 AI-generated suggestions appear with glassmorphism effect
   - Click on a suggestion to see typing animation

### API Test with curl

```bash
curl -X POST http://localhost:3001/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "tone": "emotional",
    "receiver": "美咲",
    "relationship": "親友",
    "occasion": "誕生日"
  }'
```

Expected response:

```json
{
  "suggestions": [
    {
      "id": "suggestion-1",
      "message": "美咲へ、いつもそばにいてくれてありがとう💖",
      "confidence": 0.95
    },
    ...
  ]
}
```

---

## UI Features ✨

### 1. **Glow Button**

- Button phát sáng với accent color theo tone đã chọn
- Animated pulse effect khi loading

### 2. **3D Sphere Integration**

- Callback `onAiThinkingChange(true)` trigger sphere animation
- Sphere có thể glow mạnh hơn, xoay nhanh hơn khi AI đang suy nghĩ

### 3. **Glassmorphism Mini Cards**

- Suggestions hiển thị dưới dạng glass cards
- `backdrop-blur-md`, `bg-white/10`, border mờ

### 4. **Stagger Animation**

- Framer Motion staggerChildren
- Mỗi card xuất hiện lần lượt với delay 0.1s

### 5. **Typing Effect**

- Khi click suggestion, text "chảy" vào textarea
- Sử dụng `Array.from()` để handle emojis đúng

### 6. **Confidence Bar**

- Progress bar hiển thị confidence score
- Animated width với gradient color

---

## Error Handling

Frontend tự động handle các lỗi:

- **Timeout (15s):** ⏰ タイムアウト
- **500 Error:** 🔧 サーバーエラー
- **429 Rate Limit:** ⚠️ リクエスト制限
- **Network Error:** ❌ AI生成エラー

Khi có lỗi, fallback messages sẽ được hiển thị.

---

## Performance Optimization

1. **Request Timeout:** 15 seconds
2. **Debounce:** User input debounced (if needed)
3. **Cache:** Consider caching suggestions for same params
4. **Rate Limiting:** Implement rate limiting on backend

---

## Future Enhancements

- [ ] Add language selection (English, Vietnamese, etc.)
- [ ] Save favorite suggestions to database
- [ ] User feedback on suggestions (thumbs up/down)
- [ ] Custom AI model fine-tuned on Japanese gift messages
- [ ] Real-time streaming response (SSE or WebSocket)

---

## Support

For issues or questions, contact the development team.

**Last Updated:** January 19, 2026
