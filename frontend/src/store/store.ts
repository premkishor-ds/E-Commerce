import { create } from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface ECommerceState {
  // Auth
  user: { id?: string; email: string; role: string; token: string } | null;
  login: (email: string, role: string, token: string, id?: string) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; discountType: string; value: number } | null;
  applyCoupon: (coupon: { code: string; discountType: string; value: number } | null) => void;

  // Wishlist
  wishlist: string[]; // array of product ids
  toggleWishlist: (productId: string) => void;

  // Active dashboard tabs
  activeDashboardTab: string;
  setActiveDashboardTab: (tab: string) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Orders
  orders: Array<{
    id: string;
    items: CartItem[];
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    status: 'Pending' | 'Shipped' | 'Delivered';
    createdAt: string;
  }>;
  addOrder: (order: {
    id: string;
    items: CartItem[];
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
  }) => void;
  updateOrderStatus: (id: string, status: 'Pending' | 'Shipped' | 'Delivered') => void;
}

export const useStore = create<ECommerceState>((set) => ({
  user: null,
  login: (email, role, token, id) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apex_token', token);
    }
    set({ user: { id, email, role, token } });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apex_token');
    }
    set({ user: null, cart: [], wishlist: [], appliedCoupon: null, orders: [] });
  },

  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id),
  })),
  updateCartQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ),
  })),
  clearCart: () => set({ cart: [], appliedCoupon: null }),
  appliedCoupon: null,
  applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

  wishlist: [],
  toggleWishlist: (productId) => set((state) => {
    const exists = state.wishlist.includes(productId);
    return {
      wishlist: exists
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId],
    };
  }),

  activeDashboardTab: 'overview',
  setActiveDashboardTab: (tab) => set({ activeDashboardTab: tab }),

  theme: 'light',
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),

  // Orders initialization (with a seed delivered order for headphones product to test chatbot review)
  orders: [
    {
      id: 'ORD-999999',
      items: [
        {
          id: 'prod-1',
          title: 'Apex Sound-Pro ANC Headphones',
          price: 299.99,
          image: 'https://picsum.photos/seed/headphones/600/600',
          quantity: 1
        }
      ],
      fullName: 'Test Buyer',
      address: '123 Tech Lane',
      city: 'Silicon Valley',
      zipCode: '94025',
      status: 'Delivered',
      createdAt: '6/1/2026'
    }
  ],
  addOrder: (order) => set((state) => ({
    orders: [
      ...state.orders,
      {
        ...order,
        status: 'Delivered', // For ease of checkout testing, let's mark it Delivered immediately so chatbot can rate it
        createdAt: new Date().toLocaleDateString()
      }
    ]
  })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => o.id === id ? { ...o, status } : o)
  }))
}));

