import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { COLORS, formatINR } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

const STATUS_TABS = ['All Orders', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const ORDER_STATUSES = ['Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

function getStatusColors(status) {
  if (status === 'Delivered') return { bg: COLORS.successBg, color: COLORS.success };
  if (status === 'Processing') return { bg: COLORS.warningBg, color: COLORS.warning };
  if (status === 'Cancelled') return { bg: COLORS.dangerBg, color: COLORS.danger };
  return { bg: COLORS.primaryLight, color: COLORS.primary };
}

export default function OrdersScreen() {
  const { orders, setOrders } = useZosto();
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    customer: '',
    phone: '',
    address: '',
    product: '',
    quantity: '1',
    price: '',
    payment: 'UPI',
    delivery: 'Home Delivery',
  });

  const stats = useMemo(
    () => ({
      total: orders.length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      processing: orders.filter((o) => o.status === 'Processing').length,
      pending: orders.filter((o) => o.status === 'Out for Delivery').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    }),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchTab = statusFilter === 'All Orders' || o.status === statusFilter;
      const matchQ = [o.id, o.customer, o.phone].some((f) =>
        (f || '').toLowerCase().includes(q)
      );
      return matchTab && matchQ;
    });
  }, [orders, statusFilter, search]);

  const handleUpdateStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  const handleCreateOrder = () => {
    const qty = Number(form.quantity);
    const prc = Number(form.price);
    if (!form.customer.trim() || !form.phone.trim() || !form.product.trim() || qty < 1 || prc <= 0) {
      Alert.alert('Invalid Order', 'Please enter customer, phone, product, quantity, and price.');
      return;
    }
    const newId = `ORD-2026-${String(Date.now()).slice(-4)}`;
    const newOrder = {
      id: newId,
      date: '2026-10-16',
      time: '10:30 AM',
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || 'Nellore, AP',
      items: [{ name: form.product.trim(), emoji: '📦', qty, price: prc }],
      total: qty * prc,
      payment: form.payment,
      status: 'Processing',
      delivery: form.delivery,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setShowCreate(false);
    setForm({
      customer: '',
      phone: '',
      address: '',
      product: '',
      quantity: '1',
      price: '',
      payment: 'UPI',
      delivery: 'Home Delivery',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={{ fontSize: 20 }}>🛒</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Orders</Text>
            <Text style={styles.subtitle}>
              Manage customer orders, track status and fulfill them on time.
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowCreate(!showCreate)}>
          <Text style={styles.primaryBtnText}>+ New Order</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={[styles.statPill, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.statPillLabel}>Total Orders</Text>
          <Text style={styles.statPillVal}>{stats.total}</Text>
        </View>
        <View style={[styles.statPill, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.statPillLabel}>Delivered</Text>
          <Text style={[styles.statPillVal, { color: COLORS.success }]}>{stats.delivered}</Text>
        </View>
        <View style={[styles.statPill, { borderLeftColor: COLORS.warning }]}>
          <Text style={styles.statPillLabel}>Processing</Text>
          <Text style={[styles.statPillVal, { color: COLORS.warning }]}>{stats.processing}</Text>
        </View>
        <View style={[styles.statPill, { borderLeftColor: COLORS.orange }]}>
          <Text style={styles.statPillLabel}>Out for Delivery</Text>
          <Text style={[styles.statPillVal, { color: COLORS.orange }]}>{stats.pending}</Text>
        </View>
        <View style={[styles.statPill, { borderLeftColor: COLORS.danger }]}>
          <Text style={styles.statPillLabel}>Cancelled</Text>
          <Text style={[styles.statPillVal, { color: COLORS.danger }]}>{stats.cancelled}</Text>
        </View>
      </ScrollView>

      {/* Create Order Form */}
      {showCreate && (
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Create New Order</Text>
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Customer Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Customer name"
                value={form.customer}
                onChangeText={(v) => setForm({ ...form, customer: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChangeText={(v) => setForm({ ...form, phone: v })}
              />
            </View>
          </View>
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Product *</Text>
              <TextInput
                style={styles.input}
                placeholder="Milk Packet (1L)"
                value={form.product}
                onChangeText={(v) => setForm({ ...form, product: v })}
              />
            </View>
            <View style={{ width: 80 }}>
              <Text style={styles.label}>Qty *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.quantity}
                onChangeText={(v) => setForm({ ...form, quantity: v })}
              />
            </View>
            <View style={{ width: 100 }}>
              <Text style={styles.label}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="60"
                value={form.price}
                onChangeText={(v) => setForm({ ...form, price: v })}
              />
            </View>
          </View>
          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Main Road, Nellore, AP"
            value={form.address}
            onChangeText={(v) => setForm({ ...form, address: v })}
          />
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreate(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateOrder}>
              <Text style={styles.primaryBtnText}>Create Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Filter Tabs & Search */}
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {STATUS_TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabChip, statusFilter === t && styles.tabChipActive]}
              onPress={() => setStatusFilter(t)}
            >
              <Text style={[styles.tabChipText, statusFilter === t && styles.tabChipTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.searchBox}>
          <Text style={{ color: COLORS.textMuted }}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search order ID, customer name or phone..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Order Cards */}
      {filtered.map((ord) => {
        const stStyle = getStatusColors(ord.status);
        return (
          <TouchableOpacity
            key={ord.id}
            style={styles.orderCard}
            onPress={() => setSelectedOrder(ord)}
          >
            <View style={styles.orderTop}>
              <View>
                <Text style={styles.orderId}>{ord.id}</Text>
                <Text style={styles.orderDate}>
                  {ord.date} • {ord.time}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: stStyle.bg }]}>
                <Text style={[styles.statusBadgeText, { color: stStyle.color }]}>
                  {ord.status}
                </Text>
              </View>
            </View>

            <View style={styles.customerRow}>
              <Text style={styles.customerName}>👤 {ord.customer}</Text>
              <Text style={styles.customerPhone}>{ord.phone}</Text>
            </View>

            <View style={styles.orderBottom}>
              <View style={styles.emojiRow}>
                {ord.items.map((it, idx) => (
                  <Text key={idx} style={{ fontSize: 18 }}>
                    {it.emoji}
                  </Text>
                ))}
                <Text style={styles.itemCountText}>({ord.items.length} items)</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentTag}>{ord.payment}</Text>
                <Text style={styles.totalAmount}>{formatINR(ord.total)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Order Details Modal */}
      <Modal visible={!!selectedOrder} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedOrder.id}</Text>
                    <Text style={styles.orderDate}>
                      {selectedOrder.date}, {selectedOrder.time}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                    <Text style={styles.closeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeading}>Update Order Status</Text>
                <View style={styles.statusSwitchRow}>
                  {ORDER_STATUSES.map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusOption,
                        selectedOrder.status === st && styles.statusOptionActive,
                      ]}
                      onPress={() => handleUpdateStatus(selectedOrder.id, st)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          selectedOrder.status === st && styles.statusOptionTextActive,
                        ]}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionHeading}>Customer Information</Text>
                <Text style={styles.infoText}>👤 {selectedOrder.customer}</Text>
                <Text style={styles.infoText}>☎ {selectedOrder.phone}</Text>
                <Text style={styles.infoText}>📍 {selectedOrder.address}</Text>
                <Text style={styles.infoText}>
                  🚚 {selectedOrder.delivery} • Payment: {selectedOrder.payment}
                </Text>

                <Text style={styles.sectionHeading}>
                  Items ({selectedOrder.items.length})
                </Text>
                {selectedOrder.items.map((it, idx) => (
                  <View key={idx} style={styles.detailItemRow}>
                    <Text style={{ fontSize: 18 }}>{it.emoji}</Text>
                    <Text style={{ flex: 1, fontSize: 13, color: COLORS.text, fontWeight: '600' }}>
                      {it.name} (x{it.qty})
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>
                      {formatINR(it.qty * it.price)}
                    </Text>
                  </View>
                ))}

                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>Total Amount</Text>
                  <Text style={styles.grandTotalVal}>{formatINR(selectedOrder.total)}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: 14, alignItems: 'center' }]}
                  onPress={() =>
                    Alert.alert(
                      'Invoice Ready',
                      `Customer Invoice for ${selectedOrder.id} (${formatINR(selectedOrder.total)}) generated for printing/sharing.`
                    )
                  }
                >
                  <Text style={styles.primaryBtnText}>▣ Print / Share Invoice</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 11, color: COLORS.textSecondary },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  statsScroll: { marginBottom: 14 },
  statPill: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  statPillLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  statPillVal: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginTop: 3 },
  createCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  createTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.text,
  },
  twoCol: { flexDirection: 'row', gap: 8 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  toolbar: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  tabChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  tabChipTextActive: { color: '#fff' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text, paddingVertical: 8 },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  orderDate: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  customerName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  customerPhone: { fontSize: 12, color: COLORS.textSecondary },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f4fa',
    paddingTop: 9,
  },
  emojiRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemCountText: { fontSize: 11, color: COLORS.textMuted, marginLeft: 4 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentTag: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  totalAmount: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,33,66,0.5)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  closeBtn: { fontSize: 18, color: COLORS.textMuted },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statusSwitchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  statusOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  statusOptionText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  statusOptionTextActive: { color: '#fff' },
  infoText: { fontSize: 13, color: COLORS.text, marginBottom: 4 },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  grandTotalLabel: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  grandTotalVal: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
});
