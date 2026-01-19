# 🚀 Quick Start Guide - AI Suggestion Feature

## ⚡ 5-Minute Setup (Mock Mode - No Backend Needed)

### Step 1: Create Environment File

```bash
cd frontend
cp .env.example .env.local
```

### Step 2: Enable Mock AI Service

Edit `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_AI=true
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Test the Feature

1. Open http://localhost:3002
2. Scroll to "ギフトを見つける" section
3. Click "カードを作る" button
4. In the modal:
   - Select a tone (💖 感動 / 😂 ユーモア / 🎊 フォーマル)
   - Enter receiver name (optional): e.g., "美咲"
   - Enter relationship (optional): e.g., "親友"
   - Click **✨ AI に提案してもらう**
5. Watch the magic:
   - Loading spinner appears
   - 3D sphere glows (if callback implemented)
   - 3 AI suggestions appear with glassmorphism effect
   - Click any suggestion to see typing animation

---

## 📋 Feature Checklist

Test these features:

- [ ] Tone selection changes accent color (Pink/Yellow/Blue)
- [ ] Glow button animates on hover
- [ ] Loading state shows spinning ⚡ icon
- [ ] 3 suggestions appear with stagger animation
- [ ] Each suggestion has confidence bar
- [ ] Clicking suggestion triggers typing effect
- [ ] Characters appear one by one (including emojis)
- [ ] Error handling works (simulate by setting error chance)
- [ ] Fallback messages appear on error
- [ ] QR code generates with edited message

---

## 🎨 UI Verification

### Glassmorphism Effect

```css
✓ backdrop-blur-md
✓ bg-white/10
✓ border border-white/20
✓ Smooth transitions
```

### Animations

```
✓ Stagger cards (0.1s delay each)
✓ Typing effect (30ms/char)
✓ Confidence bar animate width
✓ Button hover scale
✓ Glow pulse effect
```

### Colors by Tone

```
💖 Emotional: Pink #ec4899
😂 Funny: Yellow #fbbf24
🎊 Formal: Blue #3b82f6
```

---

## 🔧 Troubleshooting

### Issue: No suggestions appear

**Solution:** Check console for errors. Verify `.env.local` has `NEXT_PUBLIC_USE_MOCK_AI=true`

### Issue: Typing effect too slow

**Solution:** In `CardCreator.tsx` line ~185, change interval from `30ms` to `20ms`

### Issue: React is not defined error

**Solution:** Already fixed. Make sure you're using latest code with `useMemo` import

### Issue: URI malformed error

**Solution:** Already fixed. Using `Array.from()` for emoji handling

---

## 🌐 Switch to Real Backend

### Step 1: Start Rails Backend

```bash
cd backend
rails server -p 3001
```

### Step 2: Implement API Endpoint

See `AI_SUGGESTION_INTEGRATION.md` for complete Rails implementation guide.

### Step 3: Update Environment

Edit `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_AI=false
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Step 4: Test API

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
    { "id": "1", "message": "美咲へ、いつもありがとう💖", "confidence": 0.95 },
    { "id": "2", "message": "最高の誕生日を🎂✨", "confidence": 0.9 },
    { "id": "3", "message": "これからもよろしくね🌸", "confidence": 0.85 }
  ]
}
```

---

## 🎯 Next Steps

### For Developers

1. Read `AI_FEATURE_SUMMARY.md` for architecture overview
2. Read `AI_SUGGESTION_INTEGRATION.md` for backend details
3. Implement Rails controller and AI service
4. Add OpenAI integration
5. Configure environment variables

### For Testers

1. Test all tones (emotional, funny, formal)
2. Test with different receiver names
3. Test edge cases (empty inputs, long messages)
4. Test error scenarios
5. Test on mobile devices

### For Designers

1. Verify glassmorphism effect matches design
2. Check animation timing feels natural
3. Verify colors match brand palette
4. Test contrast for accessibility
5. Review spacing and typography

---

## 📊 Performance Metrics

### Current (Mock Mode)

- Initial load: ~100ms
- AI response: 1-3 seconds (simulated)
- Typing animation: ~1.5 seconds (50 chars)
- Total UX: ~5 seconds from click to complete

### Target (Production)

- AI response: < 5 seconds
- API timeout: 15 seconds
- Typing animation: adjustable
- Error handling: < 1 second

---

## 🎓 Learning Outcomes

You've learned:

- ✅ Framer Motion stagger animations
- ✅ Glassmorphism UI design
- ✅ TypeScript interfaces for API data
- ✅ Error handling with fallbacks
- ✅ Emoji-safe string manipulation
- ✅ Environment-based configuration
- ✅ Mock service for testing
- ✅ Callback patterns for parent communication

---

## 📞 Need Help?

1. **Documentation:**
   - `AI_FEATURE_SUMMARY.md` - Overview
   - `AI_SUGGESTION_INTEGRATION.md` - Backend guide

2. **Code Examples:**
   - `mockAiService.ts` - Mock implementation
   - `CardCreator.tsx` - Full component

3. **Testing:**
   - Use mock mode first
   - Check browser console for logs
   - Verify network tab for API calls

---

**Status:** ✅ Ready to Use (Mock Mode)  
**Backend Status:** 📝 Implementation Required  
**Last Updated:** January 19, 2026

---

🎉 **Enjoy building amazing AI-powered gift cards!**
