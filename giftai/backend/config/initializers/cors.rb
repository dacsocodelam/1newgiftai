Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # Cho demo, sau restrict
    resource '*', headers: :any, methods: [:get, :post, :options]
  end
end