import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

const CATEGORIES = ['All Categories', 'Dairy', 'Bakery', 'Fruits', 'Snacks', 'Beverages'];
const STATUSES = ['All Status', 'Expired', 'Expiring Soon', 'Good', 'Sold'];

function getDaysLeft(dateStr) {
  const today = new Date('2026-10-16T00:00:00');
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

function getExpiryStatus(item) {
  if (item.sold) return 'Sold';
  const d = getDaysLeft(item.expiryDate);
  if (d < 0) return 'Expired';
  if (d <= 7) return 'Expiring Soon';
  return 'Good';
}

export default function ExpiryScreen() {
  const { expiryItems, setExpiryItems } = useZosto();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Status');
  const [sortDir, setSortDir] = useState('asc');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    batch: '',
    category: 'Dairy',
    expiryDate: '2026-10-25',
    quantity: '',
  });

  const stats = useMemo(() => {
    const unsold = expiryItems.filter((i) => !i.sold);
    return {
      expired: unsold.filter((i) => getExpiryStatus(i) === 'Expired').length,
      soon: unsold.filter((i) => {
        const d = getDaysLeft(i.expiryDate);
        return d >= 0 && d <= 7;
      }).length,
      month: unsold.filter((i) => {
        const d = getDaysLeft(i.expiryDate);
        return d >= 0 && d <= 30;
      }).length,
      tracked: expiryItems.length,
    };
  }, [expiryItems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expiryItems
      .filter((item) => {
        const matchQ =
          item.name.toLowerCase().includes(q) || item.batch.toLowerCase().includes(q);
        const matchCat = category === 'All Categories' || item.category === category;
        const matchSt = status === 'All Status' || getExpiryStatus(item) === status;
        return matchQ && matchCat && matchSt;
      })
      .sort((a, b) => {
        const cmp = a.expiryDate.localeCompare(b.expiryDate);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [expiryItems, search, category, status, sortDir]);

  const handleAdd = () => {
    const qty = Number(form.quantity);
    if (!form.name.trim() || !form.batch.trim() || !form.expiryDate || !Number.isInteger(qty) || qty < 0) {
      Alert.alert('Invalid Details', 'Please enter valid product name, batch, expiry date, and quantity.');
      return;
    }
    setExpiryItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        batch: form.batch.trim(),
        category: form.category,
        expiryDate: form.expiryDate,
        quantity: qty,
        image: '📦',
        sold: false,
      },
    ]);
    setForm({ name: '', batch: '', category: 'Dairy', expiryDate: '2026-10-25', quantity: '' });
    setShowAdd(false);
  };

  const handleMarkSold = (item) => {
    setExpiryItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, sold: true } : i))
    );
  };

  const handleRemove = (item) => {
    setExpiryItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 20 }}>◷</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Expiry Alerts</Text>
          <Text style={styles.subtitle}>
            Track products nearing expiry and take action to reduce waste.
          </Text>
        </View>
      </View>

      {/* Summary Grid */}
      <View style={styles.summaryGrid}>
        <View style={[styles.statCard, { borderLeftColor: COLORS.danger }]}>
          <Text style={styles.statLabel}>⚠ Expired Items</Text>
          <Text style={[styles.statVal, { color: COLORS.danger }]}>{stats.expired}</Text>
          <Text style={styles.statSub}>Remove or dispose</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.orange }]}>
          <Text style={styles.statLabel}>◷ Expiring Soon</Text>
          <Text style={[styles.statVal, { color: COLORS.orange }]}>{stats.soon}</Text>
          <Text style={styles.statSub}>Within 7 days</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.statLabel}>▦ Expiring This Month</Text>
          <Text style={[styles.statVal, { color: COLORS.primary }]}>{stats.month}</Text>
          <Text style={styles.statSub}>Within 30 days</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.statLabel}>▣ Total Tracked</Text>
          <Text style={[styles.statVal, { color: COLORS.success }]}>{stats.tracked}</Text>
          <Text style={styles.statSub}>With expiry dates</Text>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <Text style={{ color: COLORS.textMuted }}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product name or batch number..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {STATUSES.map((st) => (
            <TouchableOpacity
              key={st}
              style={[styles.chip, status === st && styles.chipActive]}
              onPress={() => setStatus(st)}
            >
              <Text style={[styles.chipText, status === st && styles.chipTextActive]}>{st}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, category === c && styles.chipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          >
            <Text style={styles.sortBtnText}>
              Sort: Expiry Date {sortDir === 'asc' ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
            <Text style={styles.addBtnText}>+ Add Expiry Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Expiry Form */}
      {showAdd && (
        <View style={styles.addCard}>
          <Text style={styles.addCardTitle}>Add Product Expiry Details</Text>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Butter 200g"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Batch Number</Text>
              <TextInput
                style={styles.input}
                placeholder="BTR-2026-04"
                value={form.batch}
                onChangeText={(v) => setForm({ ...form, batch: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Stock Qty</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="20"
                value={form.quantity}
                onChangeText={(v) => setForm({ ...form, quantity: v })}
              />
            </View>
          </View>
          <Text style={styles.label}>Expiry Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-10-25"
            value={form.expiryDate}
            onChangeText={(v) => setForm({ ...form, expiryDate: v })}
          />
          <View style={styles.formBtnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Save Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List */}
      <View style={styles.listPanel}>
        {filtered.map((item) => {
          const days = getDaysLeft(item.expiryDate);
          const st = getExpiryStatus(item);
          const stBg =
            st === 'Expired'
              ? COLORS.dangerBg
              : st === 'Expiring Soon'
              ? COLORS.warningBg
              : st === 'Sold'
              ? COLORS.primaryLight
              : COLORS.successBg;
          const stColor =
            st === 'Expired'
              ? COLORS.danger
              : st === 'Expiring Soon'
              ? COLORS.warning
              : st === 'Sold'
              ? COLORS.primary
              : COLORS.success;

          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <Text style={{ fontSize: 24 }}>{item.image}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>
                    Batch: {item.batch} • {item.category}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: stBg }]}>
                  <Text style={[styles.statusText, { color: stColor }]}>● {st}</Text>
                </View>
              </View>
              <View style={styles.itemBottom}>
                <View>
                  <Text style={styles.metaLabel}>Expiry Date</Text>
                  <Text style={styles.metaVal}>{item.expiryDate}</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>Days Left</Text>
                  <Text style={[styles.metaVal, { color: stColor }]}>
                    {st === 'Sold' ? '—' : `${days} days`}
                  </Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>Stock Qty</Text>
                  <Text style={styles.metaVal}>{item.quantity}</Text>
                </View>
                {st === 'Expired' ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.dangerBg }]}
                    onPress={() => handleRemove(item)}
                  >
                    <Text style={{ color: COLORS.danger, fontSize: 11, fontWeight: '700' }}>
                      ▣ Remove
                    </Text>
                  </TouchableOpacity>
                ) : st !== 'Sold' && days <= 7 ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.successBg }]}
                    onPress={() => handleMarkSold(item)}
                  >
                    <Text style={{ color: COLORS.success, fontSize: 11, fontWeight: '700' }}>
                      ✓ Mark Sold
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.primaryLight }]}
                    onPress={() =>
                      Alert.alert(
                        item.name,
                        `Batch: ${item.batch}\nQuantity: ${item.quantity}\nExpiry: ${item.expiryDate}\nStatus: ${st}`
                      )
                    }
                  >
                    <Text style={{ color: COLORS.primary, fontSize: 11, fontWeight: '700' }}>
                      ◉ View
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
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
    backgroundColor: COLORS.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
  summaryGrid: {
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text },
  filterScroll: { marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 4 },
  sortBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  sortBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 9,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  addCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  addCardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.text,
  },
  twoCol: { flexDirection: 'row', gap: 10 },
  formBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  listPanel: { gap: 10 },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 13,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  itemSub: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '700' },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f4fa',
    paddingTop: 9,
  },
  metaLabel: { fontSize: 10, color: COLORS.textMuted },
  metaVal: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
});
