export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About HerStyleBox</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Where style meets simplicity
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              HerStyleBox was born from a simple idea: every girl deserves beautiful,
              well-designed clothing that reflects her unique style. We believe in
              minimalistic designs that stand the test of time, premium quality that
              lasts, and pieces that make you feel confident and comfortable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To provide thoughtfully curated clothing collections that celebrate
              individuality while maintaining timeless elegance. We're committed to
              quality, sustainability, and creating pieces that become wardrobe favorites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Carefully selected pieces for every occasion</li>
              <li>Premium quality fabrics and materials</li>
              <li>Minimalistic designs that never go out of style</li>
              <li>Easy self-service inventory management</li>
              <li>Fast and reliable shipping</li>
            </ul>
          </section>

          <section className="bg-primary-50 dark:bg-gray-800 rounded-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Have questions or feedback? We'd love to hear from you! Reach out to us
              through our contact page or follow us on social media for the latest
              updates and style inspiration.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
