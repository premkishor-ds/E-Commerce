import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number,
      },
    ],
    status: String,
    shippingAddress: Object,
    totalPrice: Number,
    trackingCode: String,
  },
  { timestamps: true },
);

const TicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    status: String,
    priority: String,
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    messages: [
      {
        senderId: mongoose.Schema.Types.ObjectId,
        message: String,
        sentAt: Date,
      },
    ],
  },
  { timestamps: true },
);

const LiveChatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    status: String,
    queueType: String,
    messages: [Object],
    rating: Number,
    transcript: String,
  },
  { timestamps: true },
);

// ─── Models ───────────────────────────────────────────────────────────────────

const Order = mongoose.model('Order', OrderSchema);
const Ticket = mongoose.model('Ticket', TicketSchema);
const LiveChatSession = mongoose.model('LiveChatSession', LiveChatSessionSchema, 'livechatsessions');

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.\n');

  // 1. Find test2@mail.com
  const userDoc = await mongoose.connection.db!.collection('users').findOne({ email: 'test2@mail.com' });
  if (!userDoc) {
    console.error('❌ User test2@mail.com not found in database!');
    process.exit(1);
  }
  const userId = userDoc._id;
  console.log(`✅ Found user: test2@mail.com  (_id: ${userId})`);

  // 2. Find a few products to reference in orders
  const products = await mongoose.connection.db!
    .collection('products')
    .find({})
    .limit(6)
    .toArray();

  if (products.length === 0) {
    console.warn('⚠️  No products found — orders will use placeholder product IDs');
  }

  const getProduct = (i: number) =>
    products.length > 0
      ? { productId: products[i % products.length]._id, title: products[i % products.length].title }
      : { productId: new mongoose.Types.ObjectId(), title: `Product ${i + 1}` };

  // ─── 3. Create 6 Orders in Different Statuses ───────────────────────────────

  const shippingAddress = {
    name: 'Test User Two',
    street: '42 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
    phone: '+919876543210',
  };

  const orderStatuses = [
    { status: 'Pending',   trackingCode: null,        label: 'Recently placed, not yet confirmed' },
    { status: 'Confirmed', trackingCode: 'TRK-CONF22', label: 'Payment confirmed, preparing to ship' },
    { status: 'Shipped',   trackingCode: 'TRK-SHIP77', label: 'In transit with courier' },
    { status: 'Delivered', trackingCode: 'TRK-DLVR41', label: 'Delivered to customer' },
    { status: 'Cancelled', trackingCode: null,         label: 'Cancelled by customer' },
    { status: 'Refunded',  trackingCode: 'TRK-REF99',  label: 'Return processed and refunded' },
  ];

  console.log('\n📦 Creating orders...');
  const createdOrders: any[] = [];
  for (let i = 0; i < orderStatuses.length; i++) {
    const s = orderStatuses[i];
    const p = getProduct(i);
    const qty = i + 1;
    const price = 500 + i * 250;
    const order = await Order.create({
      userId,
      items: [{ productId: p.productId, quantity: qty, price }],
      status: s.status,
      shippingAddress,
      totalPrice: qty * price,
      trackingCode: s.trackingCode,
    });
    createdOrders.push(order);
    console.log(`  ✅ ${s.status.padEnd(10)} → Order ID: ${order._id}  (${s.label})`);
  }

  // ─── 4. Create 4 Support Tickets in Different Statuses ─────────────────────

  const ticketData = [
    {
      subject: 'My order has not arrived yet',
      status: 'Open',
      priority: 'High',
      message: 'I placed an order 10 days ago and it still has not arrived. Please help!',
    },
    {
      subject: 'Wrong item was delivered',
      status: 'In Progress',
      priority: 'High',
      message: 'I received a completely different product than what I ordered. Requesting replacement.',
    },
    {
      subject: 'Refund not credited to my account',
      status: 'Resolved',
      priority: 'Medium',
      message: 'My order was cancelled but the refund has not been credited yet.',
    },
    {
      subject: 'Product quality feedback',
      status: 'Closed',
      priority: 'Low',
      message: 'The product quality was below expectations. Please improve quality control.',
    },
  ];

  console.log('\n🎫 Creating support tickets...');
  const createdTickets: any[] = [];
  for (const td of ticketData) {
    const ticket = await Ticket.create({
      userId,
      subject: td.subject,
      status: td.status,
      priority: td.priority,
      messages: [
        {
          senderId: userId,
          message: td.message,
          sentAt: new Date(),
        },
      ],
    });
    createdTickets.push(ticket);
    console.log(`  ✅ ${td.status.padEnd(12)} → Ticket ID: ${ticket._id}  "${td.subject}"`);
  }

  // ─── 5. Close any active live-chat session (prevents LIVE_AGENT interception) ─

  console.log('\n🔒 Closing any active live-chat sessions for this user...');
  const closedResult = await mongoose.connection.db!
    .collection('livechatsessions')
    .updateMany(
      { userId, status: 'Active' },
      { $set: { status: 'Closed', transcript: 'Auto-closed by seed script.' } },
    );
  console.log(`  Sessions closed: ${closedResult.modifiedCount}`);

  // ─── 6. Summary ─────────────────────────────────────────────────────────────

  console.log('\n══════════════════════════════════════════════════════');
  console.log('✅ SEED COMPLETE for test2@mail.com');
  console.log('══════════════════════════════════════════════════════');
  console.log(`Orders created  : ${createdOrders.length} (Pending, Confirmed, Shipped, Delivered, Cancelled, Refunded)`);
  console.log(`Tickets created : ${createdTickets.length} (Open, In Progress, Resolved, Closed)`);
  console.log('\nChatbot can now answer:');
  console.log('  • "Show my orders"          → lists all 6 orders');
  console.log('  • "Track my order"          → shows latest order status');
  console.log('  • "Where is my package"     → tracking + status');
  console.log('  • "Show my support tickets" → lists all 4 tickets');
  console.log('  • "View my open tickets"    → filters by Open status');
  console.log('══════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
