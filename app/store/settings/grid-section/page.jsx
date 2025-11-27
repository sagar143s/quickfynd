"use client";
import { useState, useEffect } from "react";
import ProductSelect from "@/components/ProductSelect";
import axios from "axios";
import Image from "next/image";

export default function StoreGridSectionPage() {
  const [sections, setSections] = useState([
    { title: '', path: '', productIds: [] },
    { title: '', path: '', productIds: [] },
    { title: '', path: '', productIds: [] }
  ]);
  const [saving, setSaving] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gridRes, prodRes] = await Promise.all([
          axios.get('/api/admin/grid-products'),
          axios.get('/api/products')
        ]);
        if (Array.isArray(gridRes.data.sections) && gridRes.data.sections.length > 0) {
          setSections([
            ...gridRes.data.sections.map(s => ({ title: s.title || '', path: s.path || '', productIds: s.productIds || [] })),
            ...Array(3 - gridRes.data.sections.length).fill({ title: '', path: '', productIds: [] })
          ]);
        }
        setAllProducts(prodRes.data.products || []);
        // Debug: log product IDs and all products
        console.log('[DEBUG] allProducts:', prodRes.data.products);
        console.log('[DEBUG] gridSections:', gridRes.data.sections);
      } catch (e) {
        console.error('[DEBUG] fetchData error:', e);
      }
    };
    fetchData();
  }, []);

  const handleTitleChange = (idx, value) => {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, title: value } : s));
  };
  const handlePathChange = (idx, value) => {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, path: value } : s));
  };
  const handleProductsChange = (idx, productId) => {
    setSections(sections => sections.map((s, i) =>
      i === idx && s.productIds.length < 4 && !s.productIds.includes(productId)
        ? { ...s, productIds: [...s.productIds, productId] }
        : s
    ));
  };
  const removeProduct = (idx, productId) => {
    setSections(sections => sections.map((s, i) =>
      i === idx ? { ...s, productIds: s.productIds.filter(id => id !== productId) } : s
    ));
  };
  const saveGrid = async () => {
    setSaving(true);
    try {
      await axios.post('/api/admin/grid-products', { sections });
      alert('Grid products saved!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Homepage Grid Sections</h1>
      {sections.map((section, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6 mb-4">
          <label className="block text-sm font-medium mb-2">Section {idx + 1} Title</label>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            value={section.title}
            onChange={e => handleTitleChange(idx, e.target.value)}
            placeholder={`Title for section ${idx + 1}`}
            maxLength={40}
          />
          <label className="block text-sm font-medium mb-2">Section {idx + 1} Path (URL)</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={section.path}
            onChange={e => handlePathChange(idx, e.target.value)}
            placeholder={`/shop?category=example`}
            maxLength={100}
          />
          <label className="block text-sm font-medium mb-2">Add Products (max 4)</label>
          <ProductSelect
            value={''}
            onChange={id => handleProductsChange(idx, id)}
            selectedIds={section.productIds}
            products={allProducts}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex flex-wrap gap-2 mt-3">
              {section.productIds.map(pid => {
                const prod = allProducts.find(p => p.id === pid);
                if (!prod) {
                  return (
                    <span key={pid} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2 min-w-[100px] text-xs text-gray-500">
                      Product not found
                      <button type="button" className="text-red-500 ml-2" onClick={() => removeProduct(idx, pid)}>x</button>
                    </span>
                  );
                }
                return (
                  <span key={pid} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2 min-w-[100px]">
                    {prod.images && prod.images[0] ? (
                      <Image src={prod.images[0]} alt={prod.name} width={24} height={24} className="rounded object-cover border" />
                    ) : (
                      <span className="w-6 h-6 rounded bg-gray-300 flex items-center justify-center text-xs text-gray-500">?</span>
                    )}
                    <span className="truncate max-w-[70px] text-xs">{prod.name}</span>
                    <button type="button" className="text-red-500 ml-2" onClick={() => removeProduct(idx, pid)}>x</button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <button
        className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold"
        onClick={saveGrid}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Grid Sections'}
      </button>
    </div>
  );
}
