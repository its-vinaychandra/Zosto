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

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Office Supplies',
  'Accessories',
  'Groceries',
  'Beverages',
  'Other',
];

function getStockStatus(qty) {
  if (qty === 0) return { label: 'Out of Stock', bg: COLORS.dangerBg, color: COLORS.danger };
  if (qty <= 10) return { label: 'Low Stock', bg: COLORS.warningBg, color: COLORS.warning };
  return { label: 'In Stock', bg: COLORS.successBg, color: COLORS.success };
}

export default function InventoryScreen() {
  const { inventory, addProduct, updateProduct, deleteProduct, navigate } = useZosto();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    quantity: '',
    price: '',
  });
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inventory.filter((item) =>
      [item.name, item.sku, item.category].some((f) => (f || '').toLowerCase().includes(q))
    );
  }, [inventory, search]);

  const openQuickAdd = () => {
    setEditingId(null);
    setForm({ name: '', sku: '', category: 'Electronics', quantity: '', price: '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: String(item.quantity),
      price: String(item.price),
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = () => {
    setError('');
    if (!form.name.trim() || !form.sku.trim()) {
      setError('Product name and SKU are required.');
      return;
    }
    const qty = Number(form.quantity);
    const prc = Number(form.price);
    if (form.quantity === '' || !Number.isInteger(qty) || qty < 0 || form.price === '' || !Number.isFinite(prc) || prc < 0) {
      setError('Enter a valid quantity and price.');
      return;
    }
    const duplicate = inventory.some(
      (i) => i.sku.toLowerCase() === form.sku.trim().toLowerCase() && i.id !== editingId
    );
    if (duplicate) {
      setError('This SKU already exists.');
      return;
    }
    if (editingId !== null) {
      updateProduct(editingId, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        quantity: qty,
        price: prc,
      });
    } else {
      addProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        quantity: qty,
        price: prc,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    Alert.alert('Delete Product', `Delete "${item.name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(item.id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Text style={{ fontSize: 20 }}>📦</Text>
          </View>
          <View>
            <Text style={styles.title}>Inventory Management</Text>
            <Text style={styles.subtitle}>Manage and track your store products.</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={openQuickAdd}>
          <Text style={styles.primaryBtnText}>+ Quick Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => navigate('AddProduct')}>
          <Text style={styles.outlineBtnText}>📋 Full Add Product Form</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Count */}
      <View style={styles.panel}>
        <View style={styles.toolbarHeader}>
          <View style={styles.listLabelRow}>
            <View style={styles.dot} />
            <Text style={styles.listTitle}>Product List</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{filtered.length} items</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Text style={{ color: COLORS.textMuted }}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Product Cards */}
        {filtered.map((item) => {
          const st = getStockStatus(item.quantity);
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <View style={styles.itemAvatar}>
                  <Text style={{ fontSize: 20 }}>{item.emoji || '📦'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    SKU: {item.sku} • {item.category}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>
              <View style={styles.itemBottom}>
                <View>
                  <Text style={styles.itemStatLabel}>Quantity</Text>
                  <Text style={styles.itemStatVal}>{item.quantity} units</Text>
                </View>
                <View>
                  <Text style={styles.itemStatLabel}>Unit Price</Text>
                  <Text style={styles.itemStatVal}>${Number(item.price).toFixed(2)}</Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                    <Text style={styles.editBtnText}>✎ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                    <Text style={styles.deleteBtnText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <Text style={styles.emptyText}>
            No products found. Try another search or add a new item.
          </Text>
        )}
      </View>

      {/* Add / Edit Modal */}
      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId === null ? 'Add New Item' : 'Edit Product'}
              </Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            <Text style={styles.label}>SKU *</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: PRD-001"
              value={form.sku}
              onChangeText={(v) => setForm({ ...form, sku: v })}
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catChip, form.category === c && styles.catChipActive]}
                  onPress={() => setForm({ ...form, category: c })}
                >
                  <Text style={[styles.catChipText, form.category === c && styles.catChipTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  value={form.quantity}
                  onChangeText={(v) => setForm({ ...form, quantity: v })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  value={form.price}
                  onChangeText={(v) => setForm({ ...form, price: v })}
                />
              </View>
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {editingId === null ? '+ Add Product' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 32 },
  headerRow: { marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titleIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
  actionsBar: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  outlineBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  outlineBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toolbarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  listLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  listTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  countBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countBadgeText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text },
  itemCard: {
    borderWidth: 1,
    borderColor: '#edf1f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fcfdff',
  },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  itemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  itemMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
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
  itemStatLabel: { fontSize: 10, color: COLORS.textMuted },
  itemStatVal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  rowActions: { flexDirection: 'row', gap: 8 },
  editBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 7,
  },
  editBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  deleteBtn: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  deleteBtnText: { color: COLORS.danger, fontSize: 12, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: COLORS.textMuted, padding: 24, fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,33,66,0.5)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  closeBtn: { fontSize: 18, color: COLORS.textMuted },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginTop: 10, marginBottom: 5 },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.text,
  },
  catScroll: { marginVertical: 4 },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  catChipTextActive: { color: '#fff' },
  twoCol: { flexDirection: 'row', gap: 10 },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 13 },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
