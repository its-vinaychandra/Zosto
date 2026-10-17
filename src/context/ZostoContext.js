import React, { createContext, useContext, useState } from 'react';

const ZostoContext = createContext(null);

export const INITIAL_INVENTORY = [
  { id: 1, name: 'Ergonomic Office Chair', sku: 'CHR-001', category: 'Furniture', quantity: 25, price: 149.99, emoji: '🪑' },
  { id: 2, name: 'Wireless Mechanical Keyboard', sku: 'KBD-012', category: 'Electronics', quantity: 40, price: 89.5, emoji: '⌨️' },
  { id: 3, name: '4K Ultra HD Monitor', sku: 'MON-4K-27', category: 'Electronics', quantity: 15, price: 320, emoji: '🖥️' },
  { id: 4, name: 'Leather Bound Notebook', sku: 'NTB-L01', category: 'Office Supplies', quantity: 150, price: 19.99, emoji: '📓' },
  { id: 5, name: 'Standing Desk Converter', sku: 'DSK-S02', category: 'Furniture', quantity: 8, price: 250.75, emoji: '🗄️' },
  { id: 6, name: 'USB-C Docking Station', sku: 'HUB-C05', category: 'Electronics', quantity: 0, price: 75, emoji: '🔌' },
  { id: 7, name: 'Gel Pens (12-Pack)', sku: 'PEN-G12', category: 'Office Supplies', quantity: 200, price: 12.25, emoji: '🖊️' },
  { id: 8, name: 'Noise-Cancelling Headphones', sku: 'HDP-NC8', category: 'Electronics', quantity: 22, price: 199.99, emoji: '🎧' },
  { id: 9, name: 'Adjustable Monitor Stand', sku: 'MNT-ADJ1', category: 'Accessories', quantity: 3, price: 45.5, emoji: '📐' },
  { id: 10, name: 'Webcam with Ring Light', sku: 'CAM-RL01', category: 'Electronics', quantity: 30, price: 65, emoji: '📷' },
  { id: 11, name: 'Wireless Mouse', sku: 'MSE-021', category: 'Electronics', quantity: 18, price: 24.99, emoji: '🖱️' },
  { id: 12, name: 'Office Desk Lamp', sku: 'LMP-009', category: 'Accessories', quantity: 6, price: 35, emoji: '💡' },
];

export const INITIAL_EXPIRY = [
  { id: 1, name: 'Milk Packet (1L)', batch: 'MIL-2026-01', category: 'Dairy', expiryDate: '2026-10-12', quantity: 10, image: '🥛', sold: false },
  { id: 2, name: 'Yogurt (500g)', batch: 'YGT-2026-02', category: 'Dairy', expiryDate: '2026-10-17', quantity: 25, image: '🥣', sold: false },
  { id: 3, name: 'Bread (400g)', batch: 'BRD-2026-11', category: 'Bakery', expiryDate: '2026-10-19', quantity: 40, image: '🍞', sold: false },
  { id: 4, name: 'Cheese Slices', batch: 'CHS-2026-08', category: 'Dairy', expiryDate: '2026-10-21', quantity: 15, image: '🧀', sold: false },
  { id: 5, name: 'Apple (1kg)', batch: 'APL-2026-15', category: 'Fruits', expiryDate: '2026-10-29', quantity: 30, image: '🍎', sold: false },
  { id: 6, name: 'Potato Chips', batch: 'CHP-2026-22', category: 'Snacks', expiryDate: '2026-11-05', quantity: 50, image: '🍟', sold: false },
  { id: 7, name: 'Soft Drink (500ml)', batch: 'DRK-2026-30', category: 'Beverages', expiryDate: '2026-11-18', quantity: 60, image: '🥤', sold: false },
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-10-15', time: '10:30 AM', product: 'Milk Packet (1L)', emoji: '🥛', category: 'Dairy', sku: 'MIL-001', type: 'Stock In', quantity: 50, reference: 'PO-2026-001', fromTo: 'Supplier', notes: 'Monthly supply' },
  { id: 2, date: '2026-10-14', time: '04:15 PM', product: 'Banana (1kg)', emoji: '🍌', category: 'Fruits', sku: 'BAN-002', type: 'Stock Out', quantity: -20, reference: 'INV-2026-445', fromTo: 'Customer Sale', notes: 'Sold at counter' },
  { id: 3, date: '2026-10-14', time: '11:20 AM', product: 'Bread (400g)', emoji: '🍞', category: 'Bakery', sku: 'BRD-003', type: 'Stock In', quantity: 100, reference: 'PO-2026-002', fromTo: 'Supplier', notes: 'Fresh stock' },
  { id: 4, date: '2026-10-13', time: '02:45 PM', product: 'Potato Chips', emoji: '🍟', category: 'Snacks', sku: 'CHP-004', type: 'Transfer', quantity: 30, reference: 'TRF-2026-009', fromTo: 'Main Store → Branch 1', notes: 'Store transfer' },
  { id: 5, date: '2026-10-12', time: '09:10 AM', product: 'Soft Drink (500ml)', emoji: '🥤', category: 'Beverages', sku: 'DRK-005', type: 'Stock Out', quantity: -40, reference: 'INV-2026-432', fromTo: 'Customer Sale', notes: 'Sold at counter' },
  { id: 6, date: '2026-10-11', time: '03:30 PM', product: 'Yogurt (500g)', emoji: '🥣', category: 'Dairy', sku: 'YGT-006', type: 'Transfer', quantity: 15, reference: 'TRF-2026-008', fromTo: 'Branch 2 → Main Store', notes: 'Reallocation' },
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-045',
    date: '2026-10-15',
    time: '10:30 AM',
    customer: 'Ravi Kumar',
    phone: '+91 98765 43210',
    address: 'Main Road, Nellore, AP',
    items: [
      { name: 'Milk Packet (1L)', emoji: '🥛', qty: 2, price: 60 },
      { name: 'Bread (400g)', emoji: '🍞', qty: 1, price: 35 },
      { name: 'Potato Chips', emoji: '🍟', qty: 2, price: 20 },
      { name: 'Soft Drink (500ml)', emoji: '🥤', qty: 1, price: 40 },
    ],
    total: 540,
    payment: 'UPI',
    status: 'Processing',
    delivery: 'Home Delivery',
  },
  {
    id: 'ORD-2026-044',
    date: '2026-10-14',
    time: '04:15 PM',
    customer: 'Priya Sharma',
    phone: '+91 91234 56789',
    address: 'Dargamitta, Nellore, AP',
    items: [
      { name: 'Banana (1kg)', emoji: '🍌', qty: 1, price: 50 },
      { name: 'Apple (1kg)', emoji: '🍎', qty: 1, price: 140 },
      { name: 'Biscuits', emoji: '🍪', qty: 1, price: 30 },
    ],
    total: 320,
    payment: 'Card',
    status: 'Out for Delivery',
    delivery: 'Home Delivery',
  },
  {
    id: 'ORD-2026-043',
    date: '2026-10-14',
    time: '11:20 AM',
    customer: 'Suresh Babu',
    phone: '+91 99887 66554',
    address: 'Main Road, Nellore, AP',
    items: [
      { name: 'Potato Chips', emoji: '🍟', qty: 2, price: 20 },
      { name: 'Juice', emoji: '🧃', qty: 1, price: 45 },
      { name: 'Soft Drink', emoji: '🥤', qty: 1, price: 40 },
    ],
    total: 1250,
    payment: 'COD',
    status: 'Delivered',
    delivery: 'Home Delivery',
  },
  {
    id: 'ORD-2026-042',
    date: '2026-10-13',
    time: '02:45 PM',
    customer: 'Anjali Reddy',
    phone: '+91 78965 43211',
    address: 'Buchireddypalem, Nellore, AP',
    items: [
      { name: 'Cooking Oil', emoji: '🫒', qty: 1, price: 180 },
      { name: 'Flour', emoji: '🌾', qty: 1, price: 30 },
    ],
    total: 210,
    payment: 'UPI',
    status: 'Cancelled',
    delivery: 'Home Delivery',
  },
  {
    id: 'ORD-2026-041',
    date: '2026-10-12',
    time: '09:10 AM',
    customer: 'Mohammad Ali',
    phone: '+91 93456 78901',
    address: 'Stonehousepet, Nellore, AP',
    items: [
      { name: 'Milk Packet', emoji: '🥛', qty: 1, price: 30 },
      { name: 'Juice', emoji: '🧃', qty: 2, price: 45 },
    ],
    total: 980,
    payment: 'Card',
    status: 'Delivered',
    delivery: 'Store Pickup',
  },
  {
    id: 'ORD-2026-040',
    date: '2026-10-11',
    time: '03:30 PM',
    customer: 'Lakshmi Devi',
    phone: '+91 91122 33445',
    address: 'Vedayapalem, Nellore, AP',
    items: [
      { name: 'Apple', emoji: '🍎', qty: 1, price: 140 },
      { name: 'Banana', emoji: '🍌', qty: 2, price: 50 },
    ],
    total: 430,
    payment: 'COD',
    status: 'Processing',
    delivery: 'Home Delivery',
  },
  {
    id: 'ORD-2026-039',
    date: '2026-10-10',
    time: '01:05 PM',
    customer: 'Vijay Prasad',
    phone: '+91 90011 22334',
    address: 'Magunta Layout, Nellore, AP',
    items: [
      { name: 'Juice', emoji: '🧃', qty: 1, price: 40 },
      { name: 'Chips', emoji: '🍟', qty: 1, price: 30 },
    ],
    total: 150,
    payment: 'UPI',
    status: 'Delivered',
    delivery: 'Store Pickup',
  },
  {
    id: 'ORD-2026-038',
    date: '2026-10-09',
    time: '06:25 PM',
    customer: 'Neha Rani',
    phone: '+91 98777 66543',
    address: 'Trunk Road, Nellore, AP',
    items: [
      { name: 'Potato Chips', emoji: '🍟', qty: 2, price: 20 },
      { name: 'Biscuits', emoji: '🍪', qty: 2, price: 30 },
    ],
    total: 620,
    payment: 'Card',
    status: 'Out for Delivery',
    delivery: 'Home Delivery',
  },
];

export const INITIAL_CUSTOMERS = [
  { id: 'CUS-001', name: 'Suresh Babu', phone: '+91 99887 66554', email: 'suresh@gmail.com', location: 'Nellore', orders: 28, spent: 12450, lastOrder: '14 Oct 2026', status: 'Active' },
  { id: 'CUS-002', name: 'Priya Sharma', phone: '+91 91234 56789', email: 'priya@gmail.com', location: 'Nellore', orders: 18, spent: 8320, lastOrder: '13 Oct 2026', status: 'Active' },
  { id: 'CUS-003', name: 'Ravi Kumar', phone: '+91 98765 43210', email: 'ravi@gmail.com', location: 'Vedayapalem', orders: 15, spent: 6540, lastOrder: '12 Oct 2026', status: 'Active' },
  { id: 'CUS-004', name: 'Anjali Reddy', phone: '+91 78965 43211', email: 'anjali@gmail.com', location: 'Stonehousepet', orders: 12, spent: 4230, lastOrder: '10 Oct 2026', status: 'Active' },
  { id: 'CUS-005', name: 'Mohammad Ali', phone: '+91 93456 78901', email: 'mohammad@gmail.com', location: 'Nellore', orders: 10, spent: 3980, lastOrder: '09 Oct 2026', status: 'Active' },
  { id: 'CUS-006', name: 'Lakshmi Devi', phone: '+91 91122 33445', email: 'lakshmi@gmail.com', location: 'Magunta Layout', orders: 8, spent: 2760, lastOrder: '08 Oct 2026', status: 'Inactive' },
  { id: 'CUS-007', name: 'Vijay Prasad', phone: '+91 90011 22334', email: 'vijay@gmail.com', location: 'Nellore', orders: 8, spent: 2450, lastOrder: '07 Oct 2026', status: 'Active' },
  { id: 'CUS-008', name: 'Neha Rani', phone: '+91 98777 66543', email: 'neha@gmail.com', location: 'Dargamitta', orders: 6, spent: 1980, lastOrder: '06 Oct 2026', status: 'Active' },
];

export const INITIAL_SUPPLIERS = [
  { id: 'SUP-001', name: 'Fresh Foods Co.', contact: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@freshfoods.com', category: 'Fruits & Vegetables', purchases: 48320, orders: 24, lastOrder: '14 Oct 2026', status: 'Active', location: '12-4-56, Market Road, Nellore, AP', credit: 50000 },
  { id: 'SUP-002', name: 'Dairy Mart', contact: 'Suresh Reddy', phone: '+91 91234 56789', email: 'suresh@dairymart.com', category: 'Dairy Products', purchases: 32450, orders: 18, lastOrder: '12 Oct 2026', status: 'Active', location: 'Nellore, AP', credit: 40000 },
  { id: 'SUP-003', name: 'Grain Baskets', contact: 'Anil Verma', phone: '+91 93456 78901', email: 'anil@grainbaskets.com', category: 'Grains & Pulses', purchases: 18760, orders: 14, lastOrder: '10 Oct 2026', status: 'Active', location: 'Nellore, AP', credit: 30000 },
  { id: 'SUP-004', name: 'Snacks Bazaar', contact: 'Priya Sharma', phone: '+91 99887 66554', email: 'priya@snacksbazaar.com', category: 'Snacks', purchases: 12980, orders: 12, lastOrder: '09 Oct 2026', status: 'Active', location: 'Vedayapalem, AP', credit: 25000 },
  { id: 'SUP-005', name: 'Beverage Corp', contact: 'Vikram Singh', phone: '+91 90011 22334', email: 'vikram@beveragecorp.com', category: 'Beverages', purchases: 9540, orders: 8, lastOrder: '08 Oct 2026', status: 'Pending', location: 'Nellore, AP', credit: 20000 },
  { id: 'SUP-006', name: 'Clean Home Supplies', contact: 'Lakshmi Devi', phone: '+91 91122 33445', email: 'lakshmi@cleanhome.com', category: 'Household Items', purchases: 7850, orders: 7, lastOrder: '05 Oct 2026', status: 'Active', location: 'Nellore, AP', credit: 15000 },
  { id: 'SUP-007', name: 'Stationery World', contact: 'Mohammad Ali', phone: '+91 78965 43211', email: 'ali@stationeryworld.com', category: 'Office Supplies', purchases: 6430, orders: 6, lastOrder: '02 Oct 2026', status: 'Active', location: 'Nellore, AP', credit: 12000 },
  { id: 'SUP-008', name: 'Electro Mart', contact: 'Ravi Teja', phone: '+91 98776 55443', email: 'ravi@electromart.com', category: 'Electronics', purchases: 5220, orders: 4, lastOrder: '28 Sep 2026', status: 'Inactive', location: 'Dargamitta, AP', credit: 10000 },
  { id: 'SUP-009', name: 'Packaging Hub', contact: 'Neha Rani', phone: '+91 98877 66543', email: 'neha@packaginghub.com', category: 'Packaging', purchases: 3980, orders: 3, lastOrder: '22 Sep 2026', status: 'Active', location: 'Nellore, AP', credit: 10000 },
  { id: 'SUP-010', name: 'Milk Land Distributors', contact: 'Kiran Reddy', phone: '+91 94455 66778', email: 'kiran@milkland.com', category: 'Dairy Products', purchases: 2760, orders: 2, lastOrder: '18 Sep 2026', status: 'Active', location: 'Nellore, AP', credit: 8000 },
];

export const INITIAL_SETTINGS = {
  storeName: 'Ramesh Stores',
  ownerName: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  email: 'rameshstore@gmail.com',
  address: 'D.No 12-4-56, Main Road, Nellore, Andhra Pradesh - 524001',
  storeLocation: 'Nellore, Andhra Pradesh',
  storeType: 'Retail Store',
  role: 'Shopkeeper',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  language: 'English',
  tax: '5',
  lowStock: '10',
};

export const INITIAL_NOTIFICATIONS = {
  lowStock: true,
  expiry: true,
  orders: true,
  delivery: true,
  ai: true,
  marketing: false,
};

export function ZostoProvider({ children }) {
  const [user, setUser] = useState({
    uid: 'demo-ramesh-001',
    name: 'Ramesh Kumar',
    email: 'rameshstore@gmail.com',
    role: 'shopkeeper',
    storeName: 'Ramesh Stores',
    storeLocation: 'Nellore, Andhra Pradesh',
  });
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [expiryItems, setExpiryItems] = useState(INITIAL_EXPIRY);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reorderedIds, setReorderedIds] = useState([]);

  const navigate = (screen) => {
    setCurrentScreen(screen);
  };

  const addProduct = (product) => {
    const newItem = {
      id: Date.now(),
      name: product.name,
      sku: product.sku || `SKU-${String(Date.now()).slice(-5)}`,
      category: product.category || 'Groceries',
      quantity: Number(product.quantity) || 0,
      price: Number(product.sellingPrice ?? product.price) || 0,
      emoji: product.emoji || '📦',
      brand: product.brand || '',
      unit: product.unit || 'Pieces',
      lowStock: Number(product.lowStock) || 10,
      supplier: product.supplier || '',
    };
    setInventory((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateProduct = (id, updated) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteProduct = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStoreLocation = (newLocation) => {
    setSettings((prev) => ({ ...prev, storeLocation: newLocation, address: newLocation }));
    setUser((prev) => (prev ? { ...prev, storeLocation: newLocation } : prev));
  };

  return (
    <ZostoContext.Provider
      value={{
        user,
        setUser,
        currentScreen,
        navigate,
        inventory,
        setInventory,
        addProduct,
        updateProduct,
        deleteProduct,
        expiryItems,
        setExpiryItems,
        transactions,
        setTransactions,
        orders,
        setOrders,
        customers,
        setCustomers,
        suppliers,
        setSuppliers,
        settings,
        setSettings,
        notifications,
        setNotifications,
        reorderedIds,
        setReorderedIds,
        updateStoreLocation,
      }}
    >
      {children}
    </ZostoContext.Provider>
  );
}

export const useZosto = () => useContext(ZostoContext);
