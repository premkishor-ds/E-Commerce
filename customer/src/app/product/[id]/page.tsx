'use client';

import React, { use } from 'react';
import { PRODUCTS } from '../../../data/mockData';
import { useStore } from '../../../store/store';
import { Star, ShoppingCart, Heart, ShieldCheck, CheckCircle2, ChevronRight, Loader2, MapPin, Truck, RotateCcw, Lock, BadgeCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedColor, setSelectedColor] = React.useState('');
  const [selectedConfig, setSelectedConfig] = React.useState('');
  const [activeImg, setActiveImg] = React.useState('');
  const [withExchange, setWithExchange] = React.useState(false);

  const [userPincode, setUserPincode] = React.useState('308708');
  const [userLocation, setUserLocation] = React.useState({ city: 'Bhant', state: 'Rajasthan', country: 'India' });
  const [tempPincode, setTempPincode] = React.useState('308708');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = React.useState(false);

  const PINCODE_MAP: Record<string, { city: string, state: string, country: string }> = {
    '308708': { city: 'Bhant', state: 'Rajasthan', country: 'India' },
    '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '110001': { city: 'New Delhi', state: 'Delhi', country: 'India' },
    '560001': { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India' },
    '94103': { city: 'San Francisco', state: 'California', country: 'USA' }
  };

  const getAddressFromPincode = (pin: string) => {
    const normalized = pin.trim();
    if (PINCODE_MAP[normalized]) {
      return PINCODE_MAP[normalized];
    }
    if (normalized.startsWith('30') || normalized.startsWith('31')) {
      return { city: 'Jaipur', state: 'Rajasthan', country: 'India' };
    } else if (normalized.startsWith('40') || normalized.startsWith('41')) {
      return { city: 'Pune', state: 'Maharashtra', country: 'India' };
    } else if (normalized.startsWith('11') || normalized.startsWith('12')) {
      return { city: 'Noida', state: 'Uttar Pradesh', country: 'India' };
    } else if (normalized.startsWith('56')) {
      return { city: 'Mysuru', state: 'Karnataka', country: 'India' };
    }
    return { city: 'Remote City', state: 'Other Region', country: 'India' };
  };

  const handleApplyPincode = () => {
    const loc = getAddressFromPincode(tempPincode);
    setUserPincode(tempPincode);
    setUserLocation(loc);
    setIsLocationPickerOpen(false);
  };

  // Calculate dynamic delivery estimate
  const sellerLoc = product?.seller?.location || { pincode: '308708', city: 'Bhant', state: 'Rajasthan', country: 'India' };
  
  let days = 3;
  if (sellerLoc.pincode === userPincode) {
    days = 1;
  } else if (sellerLoc.state === userLocation.state) {
    days = 2;
  } else if (sellerLoc.country !== userLocation.country) {
    days = 8;
  } else {
    days = 4;
  }

  const cutoffHour = 18;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  let timeString = '';
  let dayAdjustment = 0;

  if (currentHour < cutoffHour) {
    const diffHrs = cutoffHour - 1 - currentHour;
    const diffMins = 60 - currentMin;
    timeString = `${diffHrs} hrs ${diffMins} mins`;
  } else {
    dayAdjustment = 1;
    const diffHrs = 24 - currentHour + cutoffHour - 1;
    const diffMins = 60 - currentMin;
    timeString = `${diffHrs} hrs ${diffMins} mins`;
  }

  const estimateDate = new Date();
  estimateDate.setDate(now.getDate() + days + dayAdjustment);
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const deliveryDateString = estimateDate.toLocaleDateString('en-IN', dateOptions);

  React.useEffect(() => {
    if (product) {
      const v = product.variants || {};
      const cols = v.colors || v.color || v.Colors || [];
      const confs = v.storage || v.configurations || v.RAM || v.Storage || [];
      setSelectedColor(cols[0] || 'Default');
      setSelectedConfig(confs[0] || 'Standard');
      
      const imgs = product.images || [];
      setActiveImg(imgs[0] || 'https://picsum.photos/seed/product/600/600');
    }
  }, [product]);

  React.useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/v1/catalog/products/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Product not found in database');
        }
        return res.json();
      })
      .then((data) => {
        const resolvedProd = data.data || data;
        if (!resolvedProd || resolvedProd.statusCode || !resolvedProd.title) {
          throw new Error('Product payload is invalid');
        }
        setProduct(resolvedProd);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to static mock data
        const prod = PRODUCTS.find((p) => p.id === productId);
        setProduct(prod || null);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-12 animate-pulse">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />

          {/* Product Info Section Skeleton */}
          <div className="grid lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
            <div className="aspect-square w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
                <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-4">
                  <div className="flex-1 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                </div>
                <div className="h-8 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Specs & Reviews Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg border-b pb-2" />
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0 border-zinc-100 dark:border-zinc-800">
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg border-b pb-2" />
              <div className="space-y-4">
                {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b last:border-0 border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                      <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    </div>
                    <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Not Found</h2>
          <p className="text-zinc-500 mt-2">The product you are looking for does not exist in our catalog.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const catName = typeof product.category === 'object' && product.category !== null ? (product.category.name || '') : product.category;
  const brandName = typeof product.brand === 'object' && product.brand !== null ? (product.brand.name || '') : product.brand;
  const pId = product.id || product._id;
  const imgUrl = product.images?.[0] || 'https://picsum.photos/seed/product/600/600';

  const reviews = product.reviews || [];
  const specifications = product.specifications || [];
  const faqs = product.faqs || [];
  const price = typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0);

  // Related products logic (same category)
  const relatedProducts = PRODUCTS.filter((p) => p.category === catName && p.id !== pId);
  const isWishlisted = wishlist.includes(pId);

  const v = product.variants || {};
  const colors = v.colors || v.color || v.Colors || [];
  const activeColors = Array.isArray(colors) && colors.length > 0 ? colors : ['Default'];

  const confs = v.storage || v.configurations || v.RAM || v.Storage || [];
  const activeConfigs = Array.isArray(confs) && confs.length > 0 ? confs : ['Standard'];

  const highlights = specifications.length > 0 
    ? specifications.slice(0, 4).map((spec: any) => ({ title: spec.name, desc: spec.value }))
    : [
        { title: 'Ultra Fast Charging', desc: 'Supports advanced charging protocols for immediate power response.' },
        { title: 'Optics with OIS', desc: 'Captures vivid, high-fidelity images even in low light.' },
        { title: 'Smooth Refresh Display', desc: 'High refresh rate screen ensures liquid smooth scrolling and gaming.' },
        { title: 'Next-Gen Connectivity', desc: 'Fully optimized for 5G network speeds and latency response.' }
      ];

  const comparisonItems = relatedProducts.slice(0, 2);

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Link href="/">Catalog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{catName}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-900 dark:text-white">{product.title}</span>
        </nav>

        {/* Product Info Section (3-Column Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: Image Panel & Gallery (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnail Gallery (vertical layout on larger devices) */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible shrink-0 pb-2 md:pb-0">
                {(product.images && product.images.length > 0 ? product.images : [imgUrl, imgUrl, imgUrl]).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveImg(img)}
                    onClick={() => setActiveImg(img)}
                    className={`w-12 h-12 rounded-lg border-2 overflow-hidden bg-zinc-50 dark:bg-zinc-800 transition-all ${
                      activeImg === img ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Active Image with Zoom effect */}
              <div className="relative flex-1 aspect-square overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center p-4">
                <img
                  src={activeImg || imgUrl}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transform hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2: Details Column (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Visit the {brandName} Store
                </span>
                <span className="text-xs text-zinc-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-semibold leading-snug text-zinc-900 dark:text-white">
                {product.title}
              </h1>

              {/* Ratings and reviews */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center text-amber-500 font-bold gap-1 text-sm">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{product.averageRating}</span>
                </div>
                <span className="text-zinc-300">|</span>
                <span className="text-xs text-zinc-500">{reviews.length} Customer Reviews</span>
                <span className="text-zinc-300">|</span>
                <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-medium">
                  {(() => {
                    const count = product.salesCount || (reviews && reviews.length ? reviews.length * 450 : 0);
                    if (!count || count <= 0) return 'Recently launched';
                    if (count >= 1000) return `${Math.floor(count / 1000)}K+ bought in past month`;
                    if (count >= 100) return `${Math.floor(count / 100) * 100}+ bought in past month`;
                    if (count >= 50) return '50+ bought in past month';
                    return `${count} bought in past month`;
                  })()}
                </span>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Pricing Details */}
            <div className="space-y-1">
              <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide inline-block">
                Limited time deal
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[#cc0c39] text-3xl font-light">-22%</span>
                <span className="text-3xl font-semibold text-zinc-950 dark:text-white">
                  ₹{price.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                M.R.P.: <span className="line-through">₹{Math.round(price / 0.78).toLocaleString()}</span>
              </div>
              <div className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold mt-1">
                Inclusive of all taxes
              </div>
              <div className="text-xs text-zinc-800 dark:text-zinc-200 mt-1">
                <strong>EMI</strong> starts at ₹{Math.round(price / 24).toLocaleString()}. No Cost EMI available. <span className="text-cyan-600 hover:text-orange-500 dark:text-cyan-400 cursor-pointer hover:underline">EMI options</span>
              </div>
            </div>

            {/* Offers Slider / Grid */}
            <div className="border-t border-b border-zinc-200 dark:border-zinc-800 py-4 space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-850 dark:text-zinc-150">
                <span className="text-orange-500 font-extrabold text-lg">%</span> Offers
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                <div className="bg-white dark:bg-zinc-900 min-w-[160px] max-w-[160px] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Cashback</span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">Upto ₹959.00 cashback as Amazon Pay Balance when...</p>
                  <span className="text-[11px] text-cyan-600 font-semibold block pt-1 cursor-pointer">1 offer &gt;</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 min-w-[160px] max-w-[160px] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">No Cost EMI</span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">Upto ₹1,786.60 EMI interest savings on select Credit Cards...</p>
                  <span className="text-[11px] text-cyan-600 font-semibold block pt-1 cursor-pointer">3 offers &gt;</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 min-w-[160px] max-w-[160px] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Bank Offer</span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">Upto ₹2,000.00 discount on HDFC Bank Credit Cards...</p>
                  <span className="text-[11px] text-cyan-600 font-semibold block pt-1 cursor-pointer">1 offer &gt;</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 min-w-[160px] max-w-[160px] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Partner Offers</span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">Jio OnePlus Nord CE6 Series benefits up to...</p>
                  <span className="text-[11px] text-cyan-600 font-semibold block pt-1 cursor-pointer">2 offers &gt;</span>
                </div>
              </div>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-4 gap-2 py-2 text-center text-[10px] md:text-[11px] text-zinc-650 dark:text-zinc-350">
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <RotateCcw className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="leading-tight">10 days Replacement</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <Truck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="leading-tight">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="leading-tight">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <Lock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="leading-tight">Secure Transaction</span>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Variants Selector */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Select Color</span>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {activeColors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedColor === color
                          ? 'border-2 border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Select Configuration</span>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {activeConfigs.map((config: string) => (
                    <button
                      key={config}
                      onClick={() => setSelectedConfig(config)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedConfig === config
                          ? 'border-2 border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      {config}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Description & Specs Highlights */}
            <div className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{product.description}</p>
              
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">About this item</h4>
                <ul className="list-disc list-inside text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5 leading-relaxed">
                  {highlights.map((h: any, index: number) => (
                    <li key={index}><strong>{h.title}:</strong> {h.desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Checkout Column / Sticky Sidebar (lg:col-span-3) */}
          <div className="lg:col-span-3 lg:sticky lg:top-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Exchange Toggle */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <label className={`flex items-start justify-between p-3 border-b border-zinc-150 dark:border-zinc-800 cursor-pointer transition-all ${withExchange ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''}`}>
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="exchangeOption"
                    checked={withExchange}
                    onChange={() => setWithExchange(true)}
                    className="mt-1 text-amber-500 focus:ring-amber-500 border-zinc-300 dark:border-zinc-700"
                  />
                  <div>
                    <span className="text-xs font-bold block text-zinc-800 dark:text-zinc-200">With Exchange</span>
                    <span className="text-[11px] text-[#cc0c39] font-medium">Up to ₹{Math.round(price * 0.9).toLocaleString()} off</span>
                  </div>
                </div>
              </label>

              <label className={`flex items-start justify-between p-3 cursor-pointer transition-all ${!withExchange ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''}`}>
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="exchangeOption"
                    checked={!withExchange}
                    onChange={() => setWithExchange(false)}
                    className="mt-1 text-amber-500 focus:ring-amber-500 border-zinc-300 dark:border-zinc-700"
                  />
                  <div>
                    <span className="text-xs font-bold block text-zinc-800 dark:text-zinc-200">Without Exchange</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">₹{price.toLocaleString()}</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Delivery Estimation */}
            <div className="space-y-2 text-xs leading-relaxed relative">
              <div className="text-zinc-850 dark:text-zinc-200">
                <strong>FREE delivery</strong> {deliveryDateString}. Order within <span className="text-emerald-600 font-bold">{timeString}</span>. <span className="text-cyan-600 hover:underline cursor-pointer">Details</span>
              </div>
              <div 
                onClick={() => {
                  setTempPincode(userPincode);
                  setIsLocationPickerOpen(!isLocationPickerOpen);
                }}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-cyan-600 cursor-pointer transition-colors pt-1"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Delivering to {userLocation.city} {userPincode} - Update location</span>
              </div>

              {/* Inline Pincode Picker popover */}
              {isLocationPickerOpen && (
                <div className="absolute left-0 right-0 top-12 z-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl p-4 shadow-xl space-y-3">
                  <h5 className="font-bold text-zinc-900 dark:text-white text-xs">Choose your delivery location</h5>
                  <p className="text-[10px] text-zinc-500">Delivery speeds may vary based on seller location.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter pincode (e.g. 400001)"
                      value={tempPincode}
                      onChange={(e) => setTempPincode(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-zinc-300 dark:border-zinc-705 rounded-lg text-xs bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleApplyPincode}
                      className="bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-900 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-tight">
                    Try: 308708 (Local), 400001 (Mumbai), 110001 (Delhi), 560001 (Bengaluru)
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="text-emerald-600 font-bold text-sm">In stock</div>

            {/* Quantity / Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => addToCart({ id: pId, title: product.title, price: price, image: imgUrl })}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-900 font-medium py-2 px-4 rounded-full text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={() => alert('Proceeding to checkout with ' + product.title)}
                className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-zinc-900 font-medium py-2 px-4 rounded-full text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Meta stats */}
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px] pt-3 border-t border-zinc-150 dark:border-zinc-800">
              <span className="text-zinc-500">Ships from</span>
              <span className="text-zinc-850 dark:text-zinc-200 font-medium">{product.shipsFrom || 'Amazon'}</span>

              <span className="text-zinc-500">Sold by</span>
              <span className="text-zinc-850 dark:text-zinc-200 font-medium">{product.seller?.name || brandName || 'Darshita Etei'}</span>

              <span className="text-zinc-500">Payment</span>
              <span className="text-cyan-600 hover:underline cursor-pointer">Secure transaction</span>

              <span className="text-zinc-500">Gift options</span>
              <span className="text-zinc-850 dark:text-zinc-200 font-medium">Available at checkout</span>
            </div>

            {/* Wish List Toggler */}
            <button
              onClick={() => toggleWishlist(pId)}
              className={`w-full py-2 px-4 rounded-lg border text-xs font-semibold shadow-sm text-center transition-all ${
                isWishlisted
                  ? 'border-red-500 text-red-600 bg-red-50/50'
                  : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {isWishlisted ? 'Remove from Wish List' : 'Add to Wish List'}
            </button>
          </div>
        </section>

        {/* A+ Content / Product Highlights Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider border-b pb-2">Product Description & Highlights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-900 to-indigo-950 p-8 text-white relative group shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">Processor Performance</span>
              <h4 className="text-2xl font-black mt-2">Snapdragon 5G Engine</h4>
              <p className="text-indigo-100 text-sm mt-3 leading-relaxed">
                Supercharged by the octa-core Snapdragon processor, offering ultra-fast 5G speeds, seamless multi-tasking response times, and optimized energy efficiency for daily usage.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden bg-gradient-to-tr from-zinc-900 to-zinc-950 p-8 text-white relative group shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-500/10 rounded-full blur-2xl group-hover:bg-zinc-500/20 transition-all duration-500" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">Power Delivery</span>
              <h4 className="text-2xl font-black mt-2">80W SUPERVOOC Charge</h4>
              <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                Recharge your 5500 mAh battery from 1% to 60% in just 18 minutes. Optimized battery health management engine preserves capacity lifespan over years of cycles.
              </p>
            </div>
          </div>
        </section>

        {/* Product Comparison Matrix */}
        <section className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Compare with similar items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-3 font-bold text-zinc-500 w-1/4">Feature</th>
                  <th className="py-3 font-bold text-indigo-600 dark:text-indigo-400 w-1/4">This Item</th>
                  {comparisonItems.map((item: any) => (
                    <th key={item.id} className="py-3 font-medium text-zinc-800 dark:text-zinc-200 w-1/4 line-clamp-1 truncate max-w-[150px]">{item.title}</th>
                  ))}
                  {Array.from({ length: Math.max(0, 2 - comparisonItems.length) }).map((_, i) => (
                    <th key={i} className="py-3 font-medium text-zinc-400 w-1/4">—</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr>
                  <td className="py-3 font-semibold text-zinc-500">Price</td>
                  <td className="py-3 font-bold text-zinc-900 dark:text-white">${price.toFixed(2)}</td>
                  {comparisonItems.map((item: any) => (
                    <td key={item.id} className="py-3 text-zinc-600 dark:text-zinc-400">${item.price.toFixed(2)}</td>
                  ))}
                  {Array.from({ length: Math.max(0, 2 - comparisonItems.length) }).map((_, i) => (
                    <td key={i} className="py-3 text-zinc-400">—</td>
                  ))}
                </tr>
                {['Processor', 'Display', 'Battery', 'Camera'].map((specKey) => {
                  const getSpecVal = (pObj: any) => {
                    const specsList = pObj.specifications || [];
                    const found = specsList.find((s: any) => s.name.toLowerCase().includes(specKey.toLowerCase()) || specKey.toLowerCase().includes(s.name.toLowerCase()));
                    return found ? found.value : 'N/A';
                  };
                  return (
                    <tr key={specKey}>
                      <td className="py-3 font-semibold text-zinc-500">{specKey}</td>
                      <td className="py-3 text-zinc-600 dark:text-zinc-400">{getSpecVal(product)}</td>
                      {comparisonItems.map((item: any) => (
                        <td key={item.id} className="py-3 text-zinc-600 dark:text-zinc-400">{getSpecVal(item)}</td>
                      ))}
                      {Array.from({ length: Math.max(0, 2 - comparisonItems.length) }).map((_, i) => (
                        <td key={i} className="py-3 text-zinc-400">—</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Specifications & Reviews Stacking */}
        <section className="space-y-8">
          {/* Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Technical Specifications</h3>
            <table className="w-full text-sm text-left">
              <tbody>
                {specifications.map((spec: any) => (
                  <tr key={spec.name} className="border-b last:border-0">
                    <td className="py-2.5 font-semibold text-zinc-500 w-1/3">{spec.name}</td>
                    <td className="py-2.5 text-zinc-900 dark:text-white">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Customer Reviews</h3>
            {reviews.map((rev: any, index: number) => (
              <div key={index} className="space-y-2 border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{rev.user}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 italic">&quot;{rev.comment}&quot;</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Recommendations: Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-bold">Frequently Bought Together</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-zinc-200/80 hover:shadow transition-all dark:bg-zinc-900 dark:border-zinc-800">
                  <img src={p.images[0]} alt={p.title} className="h-40 w-full object-cover rounded-lg" />
                  <h4 className="font-semibold text-sm mt-3 line-clamp-1">
                    <Link href={`/product/${p.id}`} className="hover:text-indigo-600">{p.title}</Link>
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-sm">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.images[0] })}
                      className="rounded bg-zinc-100 hover:bg-indigo-600 hover:text-white px-2 py-1 text-xs font-semibold dark:bg-zinc-800"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
