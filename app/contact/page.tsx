export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          We&apos;d love to hear from you. Get in touch for orders, support, or feedback.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Email</h2>
            <a href="mailto:hello@herstylebox.com" className="text-primary-600 hover:underline">
              hello@herstylebox.com
            </a>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h2>
            <p className="text-gray-600">
              Order or chat with us on WhatsApp for the quickest response.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Response time</h2>
            <p className="text-gray-600">We typically respond within 24 hours on business days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
