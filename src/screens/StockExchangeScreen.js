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
import { COLORS } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

const TABS = ['All Transactions', 'Stock In', 'Stock Out', 'Transfer'];
const CATEGORIES = ['All Categories', 'Groceries', 'Dairy', 'Fruits', 'Bakery', 'Snacks', 'Beverages', 'Household'];

export default function StockExchangeScreen() {
  const { transactions, setTransactions } = useZosto();
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [showForm, setShowForm] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [form, setForm] = useState({
    product: '',
    sku: '',
    category: 'Groceries',
    type: 'Stock In',
    quantity: '',
    fromTo: '',
    notes: '',
  });

  const summary = useMemo(() => {
    const stockIn = transactions
      .filter((t) => t.type === 'Stock In')
      .reduce((acc, t) => acc + t.quantity, 0);
    const stockOut = transactions
      .filter((t) => t.type === 'Stock Out')
      .reduce((acc, t) => acc + Math.abs(t.quantity), 0);
    const transfers = transactions
      .filter((t) => t.type === 'Transfer')
      .reduce((acc, t) => acc + Math.abs(t.quantity), 0);
    return { stockIn, stockOut, transfers, net: stockIn - stockOut };
  }, [transactions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchTab = activeTab === 'All Transactions' || t.type === activeTab;
      const matchCat = category === 'All Categories' || t.category === category;
      const matchSearch = [t.product, t.sku, t.reference, t.fromTo, t.notes].some((f) =>
        (f || '').toLowerCase().includes(q)
      );
      return matchTab && matchCat && matchSearch;
    });
  }, [transactions, activeTab, category, search]);

  const handleAdd = () => {
    const qty = Number(form.quantity);
    if (!form.product.trim() || !form.sku.trim() || !form.fromTo.trim() || !Number.isInteger(qty) || qty <= 0) {
      Alert.alert('Invalid Details', 'Enter valid product, SKU, quantity, and source/destination.');
      return;
    }
    const newTxn = {
      id: Date.now(),
      date: '2026-10-16',
      time: '10:00 AM',
      product: form.product.trim(),
      emoji: '📦',
      category: form.category,
      sku: form.sku.trim(),
      type: form.type,
      quantity: form.type === 'Stock Out' ? -qty : qty,
      reference: `${form.type === 'Transfer' ? 'TRF' : 'TXN'}-${Date.now().toString().slice(-5)}`,
      fromTo: form.fromTo.trim(),
      notes: form.notes.trim() || 'Manual entry',
    };
    setTransactions((prev) => [newTxn, ...prev]);
    setForm({
      product: '',
      sku: '',
      category: 'Groceries',
      type: 'Stock In',
      quantity: '',
      fromTo: '',
      notes: '',
    });
    setShowForm(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 20, color: COLORS.primary, fontWeight: '800' }}>⇄</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Stock Exchange</Text>
          <Text style={styles.subtitle}>
            Track all stock movements (stock in, stock out, and transfers) in your store.
          </Text>
        </View>
      </View>

      {/* 4 Summary Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.statLabel}>↓ Total Stock In</Text>
          <Text style={[styles.statVal, { color: COLORS.success }]}>{summary.stockIn}</Text>
          <Text style={styles.statSub}>Items received</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.danger }]}>
          <Text style={styles.statLabel}>↑ Total Stock Out</Text>
          <Text style={[styles.statVal, { color: COLORS.danger }]}>{summary.stockOut}</Text>
          <Text style={styles.statSub}>Items sold or used</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.statLabel}>⇄ Stock Transfers</Text>
          <Text style={[styles.statVal, { color: COLORS.primary }]}>{summary.transfers}</Text>
          <Text style={styles.statSub}>Moved between stores</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.purple }]}>
          <Text style={styles.statLabel}>⬡ Net Stock Change</Text>
          <Text style={[styles.statVal, { color: COLORS.purple }]}>
            {summary.net > 0 ? `+${summary.net}` : summary.net}
          </Text>
          <Text style={styles.statSub}>Stock in minus out</Text>
        </View>
      </View>

      {/* Tabs + Add Button */}
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={{ color: COLORS.textMuted }}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search product, SKU, or reference..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.catChip, category === c && styles.catChipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Add Transaction Form */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add Stock Transaction</Text>
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Milk Packet"
                value={form.product}
                onChangeText={(v) => setForm({ ...form, product: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>SKU *</Text>
              <TextInput
                style={styles.input}
                placeholder="MIL-001"
                value={form.sku}
                onChangeText={(v) => setForm({ ...form, sku: v })}
              />
            </View>
          </View>

          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.typeRow}>
            {['Stock In', 'Stock Out', 'Transfer'].map((tp) => (
              <TouchableOpacity
                key={tp}
                style={[styles.typeBtn, form.type === tp && styles.typeBtnActive]}
                onPress={() => setForm({ ...form, type: tp })}
              >
                <Text style={[styles.typeBtnText, form.type === tp && styles.typeBtnTextActive]}>
                  {tp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Quantity *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="25"
                value={form.quantity}
                onChangeText={(v) => setForm({ ...form, quantity: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Source / Destination *</Text>
              <TextInput
                style={styles.input}
                placeholder="Supplier or Store"
                value={form.fromTo}
                onChangeText={(v) => setForm({ ...form, fromTo: v })}
              />
            </View>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Reason for transaction"
            value={form.notes}
            onChangeText={(v) => setForm({ ...form, notes: v })}
          />

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Save Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Transactions List */}
      {filtered.map((t) => {
        const isIn = t.type === 'Stock In';
        const isOut = t.type === 'Stock Out';
        const badgeBg = isIn ? COLORS.successBg : isOut ? COLORS.dangerBg : COLORS.primaryLight;
        const badgeColor = isIn ? COLORS.success : isOut ? COLORS.danger : COLORS.primary;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.txnCard}
            onPress={() => setSelectedTxn(t)}
          >
            <View style={styles.txnTop}>
              <Text style={{ fontSize: 24 }}>{t.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.txnProduct}>{t.product}</Text>
                <Text style={styles.txnMeta}>
                  {t.sku} • {t.category} • {t.reference}
                </Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: badgeBg }]}>
                <Text style={[styles.typeBadgeText, { color: badgeColor }]}>
                  {isIn ? '↓ ' : isOut ? '↑ ' : '⇄ '}
                  {t.type}
                </Text>
              </View>
            </View>
            <View style={styles.txnBottom}>
              <Text style={styles.txnDate}>
                {t.date} • {t.time}
              </Text>
              <Text style={styles.txnFromTo}>{t.fromTo}</Text>
              <Text style={[styles.txnQty, { color: badgeColor }]}>
                {t.quantity > 0 && !isOut ? `+${t.quantity}` : t.quantity} units
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Details Modal */}
      <Modal visible={!!selectedTxn} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Transaction Details</Text>
            {selectedTxn && (
              <>
                <Text style={styles.detailLine}>
                  Product: <Text style={styles.detailBold}>{selectedTxn.product}</Text>
                </Text>
                <Text style={styles.detailLine}>
                  SKU: <Text style={styles.detailBold}>{selectedTxn.sku}</Text>
                </Text>
                <Text style={styles.detailLine}>
                  Reference: <Text style={styles.detailBold}>{selectedTxn.reference}</Text>
                </Text>
                <Text style={styles.detailLine}>
                  Type: <Text style={styles.detailBold}>{selectedTxn.type}</Text>
                </Text>
                <Text style={styles.detailLine}>
                  Quantity: <Text style={styles.detailBold}>{selectedTxn.quantity}</Text>
                </Text>
                <Text style={styles.detailLine}>
                  Date & Time:{' '}
                  <Text style={styles.detailBold}>
                    {selectedTxn.date} {selectedTxn.time}
                  </Text>
                </Text>
                <Text style={styles.detailLine}>
                  From / To: <Text style={styles.detailBold}>{selectedTxn.fromTo}</Text>
                </Text>
                <Text style={styles.detailLine}>
                  Notes: <Text style={styles.detailBold}>{selectedTxn.notes}</Text>
                </Text>
              </>
            )}
            <TouchableOpacity style={[styles.addBtn, { marginTop: 16 }]} onPress={() => setSelectedTxn(null)}>
              <Text style={styles.addBtnText}>Close</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
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
    borderRadius: 13,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  statLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  statVal: { fontSize: 22, fontWeight: '800', marginVertical: 3 },
  statSub: { fontSize: 10, color: COLORS.textMuted },
  toolbar: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  tabScroll: { marginBottom: 10 },
  tabBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#f3f7fd',
    marginRight: 8,
  },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 12, color: COLORS.text, paddingVertical: 8 },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  catChip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 7,
  },
  catChipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  catChipText: { fontSize: 11, color: COLORS.textSecondary },
  catChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  formTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.text,
  },
  twoCol: { flexDirection: 'row', gap: 10 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  typeBtnTextActive: { color: '#fff' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  txnCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 13,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  txnTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  txnProduct: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  txnMeta: { fontSize: 11, color: COLORS.textMuted },
  typeBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  txnBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f4fa',
    paddingTop: 8,
  },
  txnDate: { fontSize: 11, color: COLORS.textMuted },
  txnFromTo: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  txnQty: { fontSize: 13, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,33,66,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  detailLine: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  detailBold: { color: COLORS.text, fontWeight: '700' },
});
