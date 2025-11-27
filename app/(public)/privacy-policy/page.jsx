'use client'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          This Privacy Policy explains how QuickFynd.com collects, uses, stores, and protects your personal information
          when you use our website and services.
        </p>

        <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">

          {/* 1 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p className="text-gray-700">
              We collect personal information you provide (such as name, mobile number, email, and delivery address),
              as well as technical data including IP address, device type, browser information, and usage analytics.
              Payment details are securely handled by trusted third-party payment processors.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p className="text-gray-700">
              Your information is used to process orders, authenticate users, send OTPs, provide customer support,
              personalize your experience, improve our platform, prevent fraud, and comply with legal requirements.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Sharing of Information</h2>
            <p className="text-gray-700">
              We only share your data with trusted service providers such as logistics partners, payment gateways,
              analytics tools, and customer support systems—strictly for operational purposes. We do not sell or trade
              your personal information.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Cookies & Tracking Technologies</h2>
            <p className="text-gray-700">
              Cookies help us enhance site functionality, remember user preferences, personalize offers, and analyze
              website performance. You may disable cookies in your browser settings, although some features may not work
              as intended.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Data Security</h2>
            <p className="text-gray-700">
              We use industry-standard security measures including encryption, firewalls, and secure servers.
              While we strive to protect your data, no method of transmission is completely risk-free.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Your Rights</h2>
            <p className="text-gray-700">
              Depending on local laws, you may request access, correction, deletion, or restriction of your
              personal data. To make a request, please contact us at: <strong>support@QuickFynd.com</strong>.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Data Retention</h2>
            <p className="text-gray-700">
              We retain your information only as long as necessary to fulfill the purposes described in this policy,
              comply with legal obligations, resolve disputes, or enforce agreements.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Children’s Privacy</h2>
            <p className="text-gray-700">
              Our services are not intended for individuals under 18. We do not knowingly collect personal information
              from minors. If we become aware of such collection, we will delete the data promptly.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. International Transfers</h2>
            <p className="text-gray-700">
              Some of our service providers may operate outside the UAE. When data is transferred internationally,
              we ensure that appropriate safeguards and compliance measures are in place.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">10. Third-Party Links & Services</h2>
            <p className="text-gray-700">
              Our website may contain links to third-party websites or services. We are not responsible for their
              privacy practices, and we encourage you to review their policies before sharing information.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">11. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. Any significant changes will be posted on this page with
              an updated \"Last Updated\" date.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
