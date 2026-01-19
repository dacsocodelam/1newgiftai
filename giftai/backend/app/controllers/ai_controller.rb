class AiController < ApplicationController
  def suggest
    require 'net/http'
    require 'json'
    require 'uri'

    api_key = ENV['GEMINI_API_KEY']
    
    if api_key.nil? || api_key.empty?
      render json: { 
        suggestions: "デモモード: APIキーが設定されていないため、サンプル提案を表示しています。",
        products: Product.limit(5).as_json(only: [:name, :description, :price, :url]) 
      }
      return
    end

    prompt_text = "おすすめギフト: 年齢#{params[:age]}, 性別#{params[:gender]}, 関係#{params[:relationship]}, 趣味#{params[:hobby]}, 予算#{params[:budget]}¥, 機会#{params[:occasion]}. 日本語で提案してください。提案は5つ以下にし、各ギフトに簡単な説明と、Amazon.co.jpでその商品を購入するための実際の検索URLを追加してください。URLは「https://www.amazon.co.jp/s?k=商品名」の形式にしてください。"

    begin
      uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=#{api_key}")
      
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE  # For development only
      
      request = Net::HTTP::Post.new(uri)
      request['Content-Type'] = 'application/json'
      
      request.body = {
        contents: [{
          parts: [{ text: prompt_text }]
        }]
      }.to_json
      
      response = http.request(request)
      
      if response.code == '200'
        data = JSON.parse(response.body)
        suggestions_text = data.dig('candidates', 0, 'content', 'parts', 0, 'text') || 'No suggestions generated'
        
        # Extract keywords from suggestions
        keywords = suggestions_text.scan(/(\w+[\w\s]*\w+)/).flatten
        
        where_clause = keywords.map { "category LIKE ? OR name LIKE ?" }.join(" OR ")
        like_params = keywords.flat_map { |keyword| ["%#{keyword}%", "%#{keyword}%"] }
        
        products = if keywords.any?
                     Product.where(where_clause, *like_params).limit(5)
                   else
                     Product.limit(5)
                   end

        render json: { suggestions: suggestions_text, products: products.as_json(only: [:name, :description, :price, :url]) }
      else
        raise "API Error: #{response.code} - #{response.body}"
      end
    rescue => e
      Rails.logger.error "Gemini API Error: #{e.message}"
      
      # Trả về response 200 với thông báo lỗi thay vì 500
      render json: { 
        suggestions: "申し訳ございません。APIの利用制限を超えました。デモモードで表示しています。\n\n🎁 おすすめギフト（サンプル）:\n1. 📚 書籍ギフトカード - 読書好きに最適\n2. ☕ カフェギフト券 - リラックスタイムに\n3. 🎨 文房具セット - クリエイティブな趣味に\n4. 🌸 アロマセット - 癒しのプレゼント\n5. 🍰 スイーツギフト - 特別な日に",
        products: Product.limit(5).as_json(only: [:name, :description, :price, :url])
      }, status: 200
    end
  end

  def generate_message
    require 'net/http'
    require 'json'
    require 'uri'

    api_key = ENV['GEMINI_API_KEY']
    tone = params[:tone] || 'emotional'
    relationship = params[:relationship] || '友人'
    occasion = params[:occasion] || '誕生日'

    # フォールバックメッセージ（トーン別）
    fallback_messages = {
      'emotional' => [
        "いつもありがとう、心から感謝💖",
        "あなたに出会えて幸せです✨",
        "特別なあなたへ、愛を込めて🌸"
      ],
      'funny' => [
        "また一つ歳とったね😂🎂",
        "いつも笑わせてくれてサンキュー🤣",
        "プレゼントより私が最高のギフト！😎"
      ],
      'formal' => [
        "心よりお祝い申し上げます🎊",
        "ご健勝をお祈りいたします🙏",
        "日頃の感謝を込めて贈ります✨"
      ]
    }

    if api_key.nil? || api_key.empty?
      render json: { messages: fallback_messages[tone] || fallback_messages['emotional'] }
      return
    end

    # トーン別のプロンプト指示
    tone_instructions = {
      'emotional' => '感動的で心温まる、愛情あふれるトーン',
      'funny' => 'ユーモラスで面白く、笑顔になれるトーン',
      'formal' => 'フォーマルで丁寧、礼儀正しいトーン'
    }

    prompt_text = <<~PROMPT
      あなたはギフトカードのメッセージ作成専門家です。
      以下の条件で、3つの異なるショートメッセージを日本語で作成してください。

      条件:
      - トーン: #{tone_instructions[tone] || tone_instructions['emotional']}
      - 相手との関係: #{relationship}
      - 機会/イベント: #{occasion}
      - 各メッセージは50文字以内
      - 絵文字を1-2個含める
      - 3つとも異なる表現で

      出力形式（JSONのみ、説明不要）:
      {"messages": ["メッセージ1", "メッセージ2", "メッセージ3"]}
    PROMPT

    begin
      uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=#{api_key}")
      
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      request = Net::HTTP::Post.new(uri)
      request['Content-Type'] = 'application/json'
      
      request.body = {
        contents: [{
          parts: [{ text: prompt_text }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200
        }
      }.to_json
      
      response = http.request(request)
      
      if response.code == '200'
        data = JSON.parse(response.body)
        text = data.dig('candidates', 0, 'content', 'parts', 0, 'text') || ''
        
        # JSONを抽出（マークダウンコードブロック内の場合も対応）
        json_match = text.match(/\{[\s\S]*"messages"[\s\S]*\}/)
        
        if json_match
          parsed = JSON.parse(json_match[0])
          render json: { messages: parsed['messages'] }
        else
          # パース失敗時はフォールバック
          render json: { messages: fallback_messages[tone] || fallback_messages['emotional'] }
        end
      else
        raise "API Error: #{response.code}"
      end
    rescue => e
      Rails.logger.error "Gemini Message API Error: #{e.message}"
      render json: { messages: fallback_messages[tone] || fallback_messages['emotional'] }
    end
  end

  def analyze_style
    require 'net/http'
    require 'json'
    require 'uri'
    require 'base64'

    api_key = ENV['GEMINI_API_KEY']

    if api_key.nil? || api_key.empty?
      render json: { 
        analysis: "デモモード: 画像分析機能はAPIキーが必要です。",
        style_keywords: ["ファッション", "モダン", "カジュアル"]
      }
      return
    end

    # Get base64 image from params
    image_data = params[:image]
    
    if image_data.nil? || image_data.empty?
      render json: { error: "画像データが必要です" }, status: 400
      return
    end

    # Extract base64 data (remove data:image/...;base64, prefix if present)
    base64_image = image_data.split(',').last

    prompt_text = <<~PROMPT
      この画像を分析して、以下の情報を抽出してください：

      1. ファッションスタイル（カジュアル、フォーマル、モダン、クラシックなど）
      2. 色の好み（主要な色）
      3. 趣味や興味（画像から推測できる）
      4. 年齢層（推定）
      5. ギフト推奨カテゴリ（この人に合うギフトのジャンル）

      出力形式（JSONのみ、日本語で）:
      {
        "style": "スタイル名",
        "colors": ["色1", "色2"],
        "interests": ["興味1", "興味2", "興味3"],
        "age_range": "年齢層",
        "gift_categories": ["カテゴリ1", "カテゴリ2", "カテゴリ3"],
        "summary": "150文字以内の分析サマリー"
      }
    PROMPT

    begin
      uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=#{api_key}")
      
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      request = Net::HTTP::Post.new(uri)
      request['Content-Type'] = 'application/json'
      
      request.body = {
        contents: [{
          parts: [
            { text: prompt_text },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64_image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 500
        }
      }.to_json
      
      response = http.request(request)
      
      if response.code == '200'
        data = JSON.parse(response.body)
        text = data.dig('candidates', 0, 'content', 'parts', 0, 'text') || ''
        
        # JSONを抽出
        json_match = text.match(/\{[\s\S]*\}/)
        
        if json_match
          parsed = JSON.parse(json_match[0])
          render json: { 
            analysis: parsed['summary'] || "分析完了",
            style_data: parsed
          }
        else
          render json: { 
            analysis: text,
            style_data: {}
          }
        end
      else
        raise "API Error: #{response.code} - #{response.body}"
      end
    rescue => e
      Rails.logger.error "Gemini Vision API Error: #{e.message}"
      render json: { 
        analysis: "画像分析中にエラーが発生しました。デフォルト設定で続行します。",
        style_data: {
          style: "モダン",
          colors: ["ブルー", "ホワイト"],
          interests: ["ファッション", "ライフスタイル"],
          age_range: "20-30代",
          gift_categories: ["アクセサリー", "ファッション小物", "ライフスタイルグッズ"]
        }
      }, status: 200
    end
  end
end