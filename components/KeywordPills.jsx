"use client";

import { useRouter } from "next/navigation";
import React from "react";

const keywords = [
  // Top Categories
  "Smart Watches", "Wireless Earbuds", "Bluetooth Neckband", "Gaming Mouse",
  "LED Strip Light", "Portable Fan", "Power Bank", "Hair Dryer", "Beard Trimmer",
  "Mobile Covers", "Smart Fitness Bands", "Action Cameras", "Ring Lights",
  "Tripods", "Fast Chargers", "USB Cables", "Bluetooth Speakers", "Smart TV Deals",
  "Trending Gifts", "Home Decor & DIY Tools",

  // Mobiles & Accessories
  "Smartphones", "iPhone", "OnePlus", "Samsung Galaxy", "Realme", "Vivo",
  "Xiaomi Redmi", "Poco", "Motorola", "Mobile Back Covers", "Camera Lens Protector",
  "Fast Charging Cable", "20W & 65W Chargers", "Mobile Stand", "Gaming Trigger",
  "Transparent Silicone Case", "Type-C Cable", "Wireless PowerBanks",

  // Laptops & Electronics
  "Laptops", "i5 / i7 / Ryzen Systems", "Business Laptops", "Student Laptops",
  "Tablets", "Mini PC", "Mechanical Keyboard", "Wireless Mouse", "SSD / HDD Storage",
  "Printers", "Scanners", "Webcams", "Headphones", "Graphic Tablets", "WiFi Router",
  "Dongles", "HDMI Cables", "Projectors", "Smart Home Gadgets",

  // Home, Kitchen & Lifestyle
  "Kitchen Essentials", "Gas Stove", "Mixer Grinder", "Water Kettle", "Air Fryer",
  "Cookware Sets", "Dinner Plates", "Home Cleaning Supplies", "Storage Organizers",
  "Curtains", "Bedsheets", "Towels", "Pillow Set", "Home Lighting", "Wall Mount Shelf",
  "Kitchen Knives", "Lunch Boxes", "Aroma Diffusers", "Room Fragrance Candles",

  // Fashion & Clothing
  "Men's T-Shirts", "Oversized Tees", "Cargo Pants", "Jeans", "Women's Kurtis",
  "Sarees", "Abaya", "Hoodies", "Jackets", "Kids Wear", "Shoes", "Sneakers",
  "Sandals", "Caps", "Watches", "Sunglasses", "Backpacks", "Handbags", "Wallets",

  // Grooming
  "Face Wash", "Sunscreen", "Hair Serum", "Lip Balm", "Perfume & Attar",
  "Shaving Kit", "Makeup Combo", "Beard Growth Oil", "Hair Straightener",
  "Hair Curler", "Skin Care Essentials", "Nail Polish", "Spa & Bath Products",

  // Grocery
  "Snacks & Beverages", "Tea", "Coffee", "Organic Honey", "Dry Fruits",
  "Detergent", "Dish Wash Liquid", "Floor Cleaner", "Breakfast Cereals",
  "Instant Noodles", "Biscuits & Chocolates", "Baby Food Essentials",
  "Health Supplements",

  // Fitness
  "Yoga Mats", "Dumbbells", "Resistance Bands", "Skipping Rope", "Shaker Bottle",
  "Sports T-Shirts", "Running Shoes", "Badminton Rackets", "Football",
  "Cricket Bat", "Massage Gun", "Gym Gloves", "Exercise Equipment",
];

export default function FlipkartStyleBottom() {
  const router = useRouter();

  return (
    <div className="w-full bg-[#f3f3f3] py-6">
      <div className="max-w-[1300px] mx-auto px-3">
        
        {/* Title – Slight Grey Text */}
        <h2 className="text-[17px] font-semibold text-gray-700 pb-3">
          Popular Searches
        </h2>

        {/* Pills Section */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <button
              key={i}
              className="px-3 py-[6px] rounded-full bg-gray-200 
              text-gray-700 text-sm hover:bg-gray-300 hover:text-gray-900
              transition border border-gray-300"
              onClick={() => router.push(`/shop?search=${encodeURIComponent(kw)}`)}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
