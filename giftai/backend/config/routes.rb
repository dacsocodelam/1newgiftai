Rails.application.routes.draw do
  # 1. Trang chủ (Root Route)
  # Giúp tránh lỗi 404 khi truy cập vào URL chính của Render.
  # Bạn có thể trả về một thông báo đơn giản hoặc thông tin trạng thái.
  root to: ->(env) { [200, { 'Content-Type' => 'text/plain' }, ["GiftAI Backend is running!"]] }

  # 2. Không gian tên API (API Namespace)
  # Gom nhóm các dịch vụ backend giúp URL sạch sẽ hơn (ví dụ: /api/suggest)
  namespace :api do
    # Các tính năng AI hiện tại
    get  'suggest',       to: 'ai#suggest'
    get  'message',       to: 'ai#generate_message'
    post 'analyze_style', to: 'ai#analyze_style'

    # Nếu sau này bạn muốn quản lý sản phẩm (Products)
    # Dòng dưới đây sẽ tự động tạo các đường dẫn: GET /api/products, GET /api/products/:id, v.v.
    # resources :products, only: [:index, :show]
  end

  # 3. Kiểm tra trạng thái hệ thống (Health Check)
  # Render và các bộ cân bằng tải sử dụng đường dẫn này để biết ứng dụng vẫn đang chạy.
  get "up" => "rails/health#show", as: :rails_health_check

  # 4. Cấu hình các tuyến đường cho các tệp tĩnh hoặc PWA nếu cần (Mặc định của Rails 8)
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end