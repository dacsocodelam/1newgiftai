"use client";
import { useTranslation } from "react-i18next";

export default function BlogSection() {
  const { t } = useTranslation();
  const blogPosts = [
    {
      title: "彼女を夢中にさせる誕生日ギフトトップ10",
      excerpt:
        "彼女の誕生日を特別にするユニークで意味のあるギフトアイデアを発見してください...",
      image:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "誕生日",
      readTime: "5分で読める",
      date: "2025年7月15日",
    },
    {
      title: "恋人へのバレンタインギフト：クラシックからモダンまで",
      excerpt:
        "パートナーの性格と好みに基づいて完璧なバレンタインギフトを選ぶ方法...",
      image:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "バレンタイン",
      readTime: "7分で読める",
      date: "2025年7月10日",
    },
    {
      title: "母親へのギフト：2025年最も意味のあるギフト",
      excerpt: "最も大切な女性のための実用的で愛情溢れるギフトリスト...",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "家族",
      readTime: "6分で読める",
      date: "2025年7月5日",
    },
    {
      title: "ギフト選びの心理学：専門家からの秘訣",
      excerpt:
        "受取人の心理を理解することで、美しいだけでなく心に響くギフトを選べます...",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "心理学",
      readTime: "8分で読める",
      date: "2025年7月1日",
    },
    {
      title: "同僚へのギフト：プロフェッショナルとフレンドリーのバランス",
      excerpt:
        "特別な機会に同僚にギフトを贈る際、プロフェッショナリズムを保ちながらの賢いアイデア...",
      image:
        "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "職場",
      readTime: "4分で読める",
      date: "2025年6月28日",
    },
    {
      title: "2025年ギフトトレンド：テクノロジーから体験まで",
      excerpt:
        "テックガジェットからユニークな体験まで、2025年最新のギフトトレンドをアップデート...",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "トレンド",
      readTime: "6分で読める",
      date: "2025年6月25日",
    },
  ];

  return (
    <section
      id="blog"
      className="py-16 bg-gradient-to-br from-[#F0F8FF] to-[#FFFDD0]"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#001f3f]">
            📚 {t("blog.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#FFD700] text-[#001f3f] px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ 注目
                  </span>
                  <span className="text-gray-500 text-sm">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#001f3f] hover:text-[#FFD700] transition-colors cursor-pointer">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    {blogPosts[0].date}
                  </span>
                  <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] px-6 py-2 rounded-full font-bold hover:from-[#001f3f] hover:to-[#003366] hover:text-white transition-all duration-300">
                    続きを読む →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#FFD700] text-[#001f3f] px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold mb-3 text-[#001f3f] hover:text-[#FFD700] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <button className="text-[#FFD700] hover:text-[#001f3f] font-medium text-sm transition-colors">
                  続きを読む →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#001f3f] to-[#003366] text-white px-8 py-3 rounded-full font-bold hover:from-[#FFD700] hover:to-[#FFA500] hover:text-[#001f3f] transition-all duration-300 transform hover:scale-105">
            📖 すべての記事を見る
          </button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            🔔 最新のギフト選び秘訣を受け取る
          </h3>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            毎週、ギフトアートの有用なコツと最新のギフトトレンドをお送りします
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="メールアドレスを入力してください..."
              className="flex-1 px-4 py-3 bg-[#ffffff] rounded-full text-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
            <button className="bg-[#FFD700] text-[#001f3f] px-6 py-3 rounded-full font-bold hover:bg-white transition-colors">
              登録
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
