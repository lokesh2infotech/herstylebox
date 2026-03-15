export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Returns & Exchanges</h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Return policy</h2>
            <p className="text-gray-600">
              We want you to love your purchase. If something isn’t right, you may return unworn, unwashed items with tags attached within 14 days of delivery for a refund or exchange.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How to return</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Contact us via WhatsApp or email to request a return.</li>
              <li>Pack the item securely and ship it to the address we provide.</li>
              <li>Once we receive and inspect the item, we’ll process your refund or exchange.</li>
            </ol>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Refunds</h2>
            <p className="text-gray-600">
              Refunds are issued to the original payment method within 5–7 business days after we receive your return.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
