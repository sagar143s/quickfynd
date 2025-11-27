import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

// Admin-editable grid section for dashboard: title + manual product selection
export default function AdminGridSectionEditor({ sectionId, onSave }) {
  const [title, setTitle] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch all products for selection
    axios.get("/api/admin/products").then(res => setAllProducts(res.data.products || []));
    // If editing, fetch section data
    if (sectionId) {
      axios.get(`/api/admin/grid-products/${sectionId}`).then(res => {
        setTitle(res.data.title || "");
        setSelectedProductIds(res.data.productIds || []);
      });
    }
  }, [sectionId]);

  const handleProductToggle = (id) => {
    setSelectedProductIds(ids =>
      ids.includes(id) ? ids.filter(pid => pid !== id) : [...ids, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await axios.post("/api/admin/grid-products", {
      sectionId,
      title,
      productIds: selectedProductIds
    });
    setSaving(false);
    if (onSave) onSave();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Grid Section</h2>
      <label className="block mb-2 font-medium">Section Title</label>
      <input
        className="border rounded px-3 py-2 w-full mb-4"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="e.g. Winter Essentials for You"
      />
      <label className="block mb-2 font-medium">Select Products (max 3)</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {allProducts.map(product => (
          <div
            key={product.id}
            className={`border rounded p-2 flex flex-col items-center cursor-pointer ${selectedProductIds.includes(product.id) ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
            onClick={() => handleProductToggle(product.id)}
          >
            <Image src={product.image} alt={product.name} width={60} height={60} className="object-contain mb-1" />
            <div className="text-xs text-center">{product.name}</div>
            {product.label && (
              <div className="text-xs font-semibold mt-1 text-green-600">{product.label}</div>
            )}
            <input
              type="checkbox"
              checked={selectedProductIds.includes(product.id)}
              readOnly
              className="mt-1"
            />
          </div>
        ))}
      </div>
      <button
        className="bg-orange-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-60"
        onClick={handleSave}
        disabled={saving || !title || selectedProductIds.length === 0 || selectedProductIds.length > 3}
      >
        {saving ? "Saving..." : "Save Section"}
      </button>
    </div>
  );
}
