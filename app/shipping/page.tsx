export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Shipping Info</h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery times</h2>
            <p className="text-gray-600">
              Orders are processed within 2–3 business days. Standard delivery typically takes 5–7 business days from dispatch.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipping options</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Standard shipping – 5–7 business days</li>
              <li>Express shipping – 2–3 business days (where available)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tracking</h2>
            <p className="text-gray-600">
              You will receive a tracking number once your order has been dispatched so you can follow your delivery.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
