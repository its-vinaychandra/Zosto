import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { COLORS, formatINR } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

const LOW_STOCK_DASH = [
  { name: 'Maggi Noodles', stock: 5, minimum: 20, emoji: '🍜' },
  { name: 'Coca Cola 500ml', stock: 8, minimum: 24, emoji: '🥤' },
  { name: 'Parle-G Biscuits', stock: 10, minimum: 30, emoji: '🍪' },
  { name: 'Sunflower Oil 1L', stock: 6, minimum: 20, emoji: '🫒' },
  { name: 'Aashirvaad Atta 5kg', stock: 4, minimum: 15, emoji: '🌾' },
];

const EXPIRING_DASH = [
  { name: 'Milk (Amul)', date: '20 Oct 2026', days: 5, emoji: '🥛' },
  { name: 'Bread', date: '22 Oct 2026', days: 7, emoji: '🍞' },
  { name: 'Curd', date: '24 Oct 2026', days: 9, emoji: '🥣' },
  { name: 'Yogurt Cup', date: '26 Oct 2026', days: 11, emoji: '🥛' },
  { name: 'Paneer', date: '28 Oct 2026', days: 13, emoji: '🧀' },
];

const NEARBY_EXCHANGE = [
  { name: 'Fresh Milk (Amul)', quantity: '10 packs available', shop: 'Venkatesh Store', distance: '2 km', emoji: '🥛' },
  { name: 'Parle-G Biscuits', quantity: '20 packets available', shop: 'Sai Kirana', distance: '3 km', emoji: '🍪' },
  { name: 'Sunflower Oil 1L', quantity: '5 bottles available', shop: 'Laxmi Stores', distance: '4 km', emoji: '🫒' },
];

const RECENT_ORDERS_DASH = [
  { id: '#OD1234', customer: 'Ravi Kumar', status: 'Delivered' },
  { id: '#OD1233', customer: 'Sita', status: 'Out for Delivery' },
  { id: '#OD1232', customer: 'Prakash', status: 'Processing' },
  { id: '#OD1231', customer: 'Local Customer', status: 'Delivered' },
];

const AI_RECS = [
  { title: 'Stock more', product: 'Maggi Noodles', description: 'High demand in your area', emoji: '🍜', type: 'green', icon: '↑' },
  { title: 'Increase stock', product: 'Coca Cola 500ml', description: 'Sales increased by 30%', emoji: '🥤', type: 'blue', icon: '↗' },
  { title: 'Consider exchanging', product: 'Milk (Amul)', description: 'High demand nearby', emoji: '🥛', type: 'purple', icon: '⇄' },
];

const SALES_BARS = [
  { day: 'Oct 9', val: 38 },
  { day: 'Oct 10', val: 52 },
  { day: 'Oct 11', val: 50 },
  { day: 'Oct 12', val: 68 },
  { day: 'Oct 13', val: 65 },
  { day: 'Oct 14', val: 88 },
  { day: 'Oct 15', val: 94 },
];

const CATEGORIES = [
  { label: 'Groceries', pct: 40, color: '#0866ff' },
  { label: 'Snacks', pct: 25, color: '#8435f7' },
  { label: 'Beverages', pct: 15, color: '#f03467' },
  { label: 'Dairy', pct: 10, color: '#079a66' },
  { label: 'Others', pct: 10, color: '#f18b00' },
];

export default function DashboardScreen() {
  const { user, navigate, inventory } = useZosto();
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);

  const firstName = user?.name?.split(' ')[0] || 'Shopkeeper';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, orders, or shopkeepers..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Welcome Banner */}
      <View style={styles.welcomeRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeTitle}>
            Welcome Back, <Text style={{ color: COLORS.primary }}>{firstName}!</Text> 👋
          </Text>
          <Text style={styles.welcomeSub}>Here's what's happening in your shop today.</Text>
        </View>
        <View style={styles.datePill}>
          <Text style={styles.datePillText}>▦ Mon, 15 Oct 2026</Text>
        </View>
      </View>

      {/* 4 KPI Stat Cards */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[styles.statCard, { borderLeftColor: COLORS.primary }]}
          onPress={() => navigate('Inventory')}
        >
          <View style={styles.statTop}>
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={styles.statIcon}>📦</Text>
            </View>
            <Text style={[styles.statChange, { color: COLORS.success }]}>↑ +12%</Text>
          </View>
          <Text style={styles.statLabel}>Total Products</Text>
          <Text style={styles.statValue}>{120 + inventory.length - 12}</Text>
          <Text style={styles.statSub}>vs last month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { borderLeftColor: COLORS.success }]}
          onPress={() => navigate('SalesAnalysis')}
        >
          <View style={styles.statTop}>
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.successBg }]}>
              <Text style={styles.statIcon}>₹</Text>
            </View>
            <Text style={[styles.statChange, { color: COLORS.success }]}>↑ 8%</Text>
          </View>
          <Text style={styles.statLabel}>Total Stock Value</Text>
          <Text style={styles.statValue}>₹28,450</Text>
          <Text style={styles.statSub}>vs last month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { borderLeftColor: COLORS.danger }]}
          onPress={() => navigate('Inventory')}
        >
          <View style={styles.statTop}>
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.dangerBg }]}>
              <Text style={styles.statIcon}>⚠️</Text>
            </View>
            <Text style={[styles.statChange, { color: COLORS.danger }]}>+ 2</Text>
          </View>
          <Text style={styles.statLabel}>Low Stock Items</Text>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statSub}>items need restock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { borderLeftColor: COLORS.orange }]}
          onPress={() => navigate('Expiry')}
        >
          <View style={styles.statTop}>
            <View style={[styles.statIconWrap, { backgroundColor: COLORS.orangeBg }]}>
              <Text style={styles.statIcon}>◷</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Expiring Soon</Text>
          <Text style={styles.statValue}>6</Text>
          <Text style={styles.statSub}>within 30 days</Text>
        </TouchableOpacity>
      </View>

      {/* Sales Overview Card */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Sales Overview</Text>
          <TouchableOpacity
            onPress={() =>
              setNotice({
                title: 'Sales Period',
                message: 'Showing last 7 days performance. Open Sales Analytics for 7D, 30D, 3M, and 1Y views.',
              })
            }
          >
            <Text style={styles.viewAllText}>Last 7 Days ⌄</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.salesSummaryRow}>
          <View>
            <Text style={styles.salesTotalLabel}>Total Sales</Text>
            <Text style={styles.salesTotalValue}>{formatINR(24530)}</Text>
          </View>
          <View style={styles.salesBadge}>
            <Text style={styles.salesBadgeText}>↗ 18% vs last week</Text>
          </View>
        </View>
        <View style={styles.chartBarsRow}>
          {SALES_BARS.map((b, i) => (
            <View key={b.day} style={styles.chartCol}>
              <View style={styles.chartBarTrack}>
                <View
                  style={[
                    styles.chartBarFill,
                    {
                      height: `${b.val}%`,
                      backgroundColor: i === SALES_BARS.length - 1 ? COLORS.primary : '#7eb3ff',
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartXLabel}>{b.day.replace('Oct ', '')}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Category Wise Sales */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Category Wise Sales</Text>
          <Text style={styles.categoryCenterTag}>120 Products</Text>
        </View>
        {CATEGORIES.map((c) => (
          <View key={c.label} style={styles.catRow}>
            <View style={[styles.catDot, { backgroundColor: c.color }]} />
            <Text style={styles.catName}>{c.label}</Text>
            <View style={styles.catBarTrack}>
              <View style={[styles.catBarFill, { width: `${c.pct}%`, backgroundColor: c.color }]} />
            </View>
            <Text style={styles.catPct}>{c.pct}%</Text>
          </View>
        ))}
      </View>

      {/* Nearby Stock Exchange */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Nearby Stock Exchange</Text>
          <TouchableOpacity onPress={() => navigate('StockExchange')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        {NEARBY_EXCHANGE.map((item) => (
          <View key={item.name} style={styles.nearbyRow}>
            <View style={styles.nearbyEmojiWrap}>
              <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nearbyName}>{item.name}</Text>
              <Text style={styles.nearbyQty}>{item.quantity}</Text>
              <Text style={styles.nearbyShop}>
                {item.shop} ({item.distance})
              </Text>
            </View>
            <TouchableOpacity
              style={styles.requestBtn}
              onPress={() =>
                setNotice({
                  title: 'Stock Exchange Request',
                  message: `Exchange request sent for ${item.name} (${item.quantity}) from ${item.shop} (${item.distance}).`,
                })
              }
            >
              <Text style={styles.requestBtnText}>Request</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Low Stock Items */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Low Stock Items</Text>
          <TouchableOpacity onPress={() => navigate('Inventory')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        {LOW_STOCK_DASH.map((item) => (
          <View key={item.name} style={styles.listRow}>
            <Text style={styles.rowEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSub}>
                Current: {item.stock} • Min: {item.minimum}
              </Text>
            </View>
            <View style={styles.lowStockPill}>
              <Text style={styles.lowStockPillText}>Low Stock</Text>
            </View>
            <TouchableOpacity
              style={styles.restockBtn}
              onPress={() =>
                setNotice({
                  title: 'Restock Request',
                  message: `Restock initiated for ${item.name}. Current stock: ${item.stock}, Minimum required: ${item.minimum}.`,
                })
              }
            >
              <Text style={styles.restockBtnText}>Restock</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Expiring Soon */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Expiring Soon</Text>
          <TouchableOpacity onPress={() => navigate('Expiry')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        {EXPIRING_DASH.map((item) => (
          <View key={item.name} style={styles.listRow}>
            <Text style={styles.rowEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSub}>Expires: {item.date}</Text>
            </View>
            <View
              style={[
                styles.daysPill,
                item.days <= 5
                  ? { backgroundColor: COLORS.dangerBg }
                  : item.days <= 9
                  ? { backgroundColor: COLORS.warningBg }
                  : { backgroundColor: COLORS.successBg },
              ]}
            >
              <Text
                style={[
                  styles.daysPillText,
                  item.days <= 5
                    ? { color: COLORS.danger }
                    : item.days <= 9
                    ? { color: COLORS.warning }
                    : { color: COLORS.success },
                ]}
              >
                {item.days} days
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Orders */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigate('Orders')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        {RECENT_ORDERS_DASH.map((ord) => (
          <View key={ord.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{ord.id}</Text>
              <Text style={styles.rowSub}>{ord.customer}</Text>
            </View>
            <View
              style={[
                styles.daysPill,
                ord.status === 'Delivered'
                  ? { backgroundColor: COLORS.successBg }
                  : ord.status === 'Processing'
                  ? { backgroundColor: COLORS.warningBg }
                  : { backgroundColor: COLORS.primaryLight },
              ]}
            >
              <Text
                style={[
                  styles.daysPillText,
                  ord.status === 'Delivered'
                    ? { color: COLORS.success }
                    : ord.status === 'Processing'
                    ? { color: COLORS.warning }
                    : { color: COLORS.primary },
                ]}
              >
                {ord.status}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.smallOutlineBtn}
              onPress={() =>
                setNotice({
                  title: 'Order Details',
                  message: `Order ${ord.id} for ${ord.customer}. Current Status: ${ord.status}.`,
                })
              }
            >
              <Text style={styles.smallOutlineBtnText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* AI Assistant Banner */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <View style={styles.aiRobot}>
            <Text style={{ fontSize: 22 }}>🤖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>AI Assistant</Text>
            <Text style={styles.aiSub}>
              Recommendations based on recent sales and local demand
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigate('AISuggestions')}>
            <Text style={styles.aiLink}>More →</Text>
          </TouchableOpacity>
        </View>
        {AI_RECS.map((rec) => (
          <TouchableOpacity
            key={rec.product}
            style={styles.aiRecRow}
            onPress={() => navigate('AISuggestions')}
          >
            <Text style={{ fontSize: 24 }}>{rec.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiRecTag}>{rec.title}</Text>
              <Text style={styles.aiRecProduct}>{rec.product}</Text>
              <Text style={styles.aiRecDesc}>{rec.description}</Text>
            </View>
            <Text style={styles.aiRecIcon}>{rec.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notice Modal */}
      <Modal visible={!!notice} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🤖</Text>
            <Text style={styles.modalTitle}>{notice?.title}</Text>
            <Text style={styles.modalMessage}>{notice?.message}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setNotice(null)}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 32 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    gap: 8,
  },
  searchIcon: { fontSize: 16, color: COLORS.textMuted },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  welcomeTitle: { fontSize: 21, fontWeight: '800', color: COLORS.text },
  welcomeSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  datePill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  datePillText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '48.2%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statIconWrap: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  statIcon: { fontSize: 16 },
  statChange: { fontSize: 11, fontWeight: '700' },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  statValue: { fontSize: 21, fontWeight: '800', color: COLORS.text, marginVertical: 2 },
  statSub: { fontSize: 10, color: COLORS.textMuted },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  viewAllText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  salesSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salesTotalLabel: { fontSize: 11, color: COLORS.textSecondary },
  salesTotalValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  salesBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  salesBadgeText: { color: COLORS.success, fontSize: 11, fontWeight: '700' },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBarTrack: {
    width: 18,
    height: 90,
    backgroundColor: '#eef4fc',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: { width: '100%', borderRadius: 6 },
  chartXLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 5 },
  categoryCenterTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { width: 80, fontSize: 12, color: COLORS.text, fontWeight: '600' },
  catBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#eef3fa',
    borderRadius: 4,
    overflow: 'hidden',
  },
  catBarFill: { height: '100%', borderRadius: 4 },
  catPct: { width: 34, textAlign: 'right', fontSize: 12, fontWeight: '700', color: COLORS.text },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },
  nearbyEmojiWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#f4f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  nearbyQty: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  nearbyShop: { fontSize: 11, color: COLORS.textMuted },
  requestBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  requestBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },
  rowEmoji: { fontSize: 20 },
  rowTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  rowSub: { fontSize: 11, color: COLORS.textMuted },
  lowStockPill: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockPillText: { color: COLORS.danger, fontSize: 10, fontWeight: '700' },
  restockBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  restockBtnText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  daysPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12 },
  daysPillText: { fontSize: 11, fontWeight: '700' },
  smallOutlineBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  smallOutlineBtnText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  aiCard: {
    backgroundColor: '#102142',
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  aiRobot: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1e3a6e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  aiSub: { color: '#9ab0d0', fontSize: 11 },
  aiLink: { color: '#60a5fa', fontSize: 12, fontWeight: '700' },
  aiRecRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1a2f57',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  aiRecTag: { color: '#60a5fa', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  aiRecProduct: { color: '#fff', fontSize: 14, fontWeight: '700' },
  aiRecDesc: { color: '#b0c4de', fontSize: 11 },
  aiRecIcon: { color: '#fff', fontSize: 18, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,33,66,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 34, marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  modalMessage: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  modalBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 9,
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
