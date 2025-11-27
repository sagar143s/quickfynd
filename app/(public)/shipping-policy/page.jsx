'use client'

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Delivery Policy</h1>
        <p className="text-gray-600 mb-8">
          This Shipping & Delivery Policy explains how orders placed on QuickFynd.com are processed, shipped, and delivered.
        </p>

        <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">

          {/* 1 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Order Processing Time</h2>
            <p className="text-gray-700">
              Most orders are processed within <strong>1–2 business days</strong>. During peak seasons, promotions, or high-volume periods, 
              processing times may be slightly longer. Orders placed on weekends or public holidays will be processed the next business day.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Shipping Methods & Delivery Timeline</h2>
            <p className="text-gray-700">
              QuickFynd offers Standard and Express delivery across the UAE. Estimated delivery times are shown at checkout 
              and depend on your location, product availability, and selected shipping method.
            </p>
            <ul className="list-disc ml-6 text-gray-700 mt-2">
              <li><strong>Standard Delivery:</strong> 2–4 business days</li>
              <li><strong>Express Delivery:</strong> 1–2 business days</li>
              <li><strong>Next-Day Delivery:</strong> Available on select items and locations</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Shipping Fees</h2>
            <p className="text-gray-700">
              Shipping fees vary depending on the weight, category, and destination of the product. Any applicable fees 
              will be clearly displayed at checkout before payment is completed.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Tracking Your Order</h2>
            <p className="text-gray-700">
              Once your order is shipped, you will receive a tracking link via email/SMS. You can also check your order’s 
              status anytime under <strong>My Orders</strong> on QuickFynd.com.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Delivery Attempts</h2>
            <p className="text-gray-700">
              Our courier partner will attempt delivery up to two times. If delivery is unsuccessful, the parcel may be 
              held at a pickup point or returned to our warehouse. Additional delivery attempts may require extra charges.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Damaged, Missing, or Wrong Items</h2>
            <p className="text-gray-700">
              If your order arrives damaged, incomplete, or incorrect, please contact us within <strong>48 hours</strong> at 
              <strong> support@QuickFynd.com</strong> with your order ID and photos/videos of the issue. We will assist you with a 
              replacement or solution as quickly as possible.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Address & Contact Accuracy</h2>
            <p className="text-gray-700">
              Please ensure that your shipping address and contact details are correct during checkout. QuickFynd is not 
              responsible for delays or failed deliveries caused by incorrect information provided by the customer.
            </p>
          </section>

          {/* 8 - NEW */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Delivery Restrictions</h2>
            <p className="text-gray-700">
              Some products may be restricted in certain locations due to size, weight, or courier limitations. 
              If your order cannot be delivered, our team will contact you for alternative arrangements or a refund.
            </p>
          </section>

          {/* 9 - NEW */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. Delays Beyond Our Control</h2>
            <p className="text-gray-700">
              Delivery delays may occur due to weather conditions, customs, courier issues, or unexpected circumstances. 
              While we do our best to avoid such delays, QuickFynd cannot be held responsible for external disruptions.
            </p>
          </section>

          {/* 10 - NEW */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">10. International Shipping</h2>
            <p className="text-gray-700">
              Currently, QuickFynd ships only within the UAE. International shipping will be added in the future, and 
              updates will be posted on QuickFynd.com.
            </p>
          </section>

          {/* 11 - NEW */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">11. Contact Us</h2>
            <p className="text-gray-700">
              For questions related to shipping or delivery, please contact us at:
            </p>
            <p className="text-gray-700 mt-2">
              📧 <strong>support@QuickFynd.com</strong><br />
              🌐 <strong>www.QuickFynd.com</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
