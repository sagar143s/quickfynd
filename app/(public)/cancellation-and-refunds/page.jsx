export default function CancellationAndRefunds() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Cancellation & Refunds Policy</h1>

      <p className="mb-4">
        This Cancellation & Refunds Policy applies to all purchases made on
        <strong> QuickFynd.com</strong>, operating under the <strong>Nilaas</strong> brand.
        QuickFynd is an e-commerce platform delivering products across Kerala.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Order Cancellation</h2>
      <p className="mb-3">
        <strong>Before Shipment:</strong> Customers can cancel their order within 1–2 hours
        of placing it or before the order is shipped. A full refund will be issued for prepaid orders.
      </p>
      <p className="mb-3">
        <strong>After Shipment:</strong> Once shipped, orders cannot be cancelled. However,
        you may request a return after receiving the product (based on eligibility).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Return Eligibility</h2>
      <p className="mb-3">
        Returns are accepted if the product delivered is damaged, defective, incorrect,
        or not as described on our website.
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Wrong item received</li>
        <li>Damaged or defective product</li>
        <li>Product not matching description</li>
      </ul>
      <p className="mb-4">
        Proof such as clear photos or videos must be shared within <strong>24–48 hours</strong> of delivery.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">Non-Returnable Items:</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal care items</li>
        <li>Food & perishable goods</li>
        <li>Innerwear & hygiene-sensitive products</li>
        <li>Customized or personalized items</li>
        <li>Items marked as “Non-Returnable”</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Return Process</h2>
      <ol className="list-decimal pl-6 mb-4">
        <li>Contact support with order details and issue description.</li>
        <li>Submit photos/videos for verification.</li>
        <li>Once approved, pickup will be arranged (where available).</li>
        <li>Product must be unused and in original packaging.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Refund Policy</h2>
      <p className="mb-3">
        Refunds are processed through the same payment method used at checkout.
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>UPI / Wallet</li>
        <li>Net Banking</li>
        <li>Credit/Debit Card</li>
        <li>COD refunds are transferred to bank account</li>
      </ul>
      <p className="mb-4">
        Refunds usually take <strong>3–5 business days</strong> after the returned product is inspected.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Exchange Policy</h2>
      <p className="mb-3">
        Exchanges are allowed for defective items, wrong product delivered, or size issues
        (depending on product availability).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p className="mb-2">For cancellations, returns, or refund assistance:</p>

      <p className="mb-1"><strong>Email:</strong> support@quickfynd.com</p>
      <p className="mb-1"><strong>Website:</strong> www.quickfynd.com</p>

      <p className="text-sm text-gray-600">
        QuickFynd reserves the right to update or modify this policy at any time based on
        operational requirements.
      </p>
    </div>
  );
}
