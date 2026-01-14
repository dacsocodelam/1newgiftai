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
end