import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

const CATEGORIES = [
  'Groceries',
  'Dairy',
  'Fruits & Vegetables',
  'Bakery',
  'Snacks',
  'Beverages',
  'Household',
  'Personal Care',
  'Electronics',
  'Other',
];

const UNITS = ['Pieces', 'Kg', 'Grams', 'Litres', 'ML', 'Packets', 'Boxes', 'Dozens'];
const LOCATIONS = ['Main Store', 'Warehouse', 'Refrigerator', 'Display Shelf'];

export default function AddProductScreen() {
  const { addProduct, navigate } = useZosto();
  const [form, setForm] = useState({
    name: '',
    category: 'Groceries',
    brand: '',
    unit: 'Pieces',
    barcode: '',
    sku: '',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    mrp: '',
    quantity: '',
    lowStock: '10',
    expiryTracking: true,
    storageLocation: 'Main Store',
    supplier: '',
    tags: '',
    featured: false,
  });
  const [message, setMessage] = useState('');

  const update = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setMessage('');
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setMessage('Product name is required.');
      return;
    }
    if (!form.purchasePrice || !form.sellingPrice || !form.quantity) {
      setMessage('Please enter Purchase Price, Selling Price, and Initial Quantity.');
      return;
    }
    addProduct({
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
    });
    Alert.alert('Success', 'Product added to inventory successfully!', [
      { text: 'View Inventory', onPress: () => navigate('Inventory') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Breadcrumb & Header */}
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={() => navigate('Inventory')}>
          <Text style={styles.breadcrumbLink}>← Back to Inventory</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Add Product</Text>
      <Text style={styles.subtitle}>Add a new product to your inventory.</Text>

      {!!message && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{message}</Text>
        </View>
      )}

      {/* Card 1: Product Details */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={{ color: COLORS.primary, fontWeight: '800' }}>▣</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Product Details</Text>
            <Text style={styles.cardSub}>Enter basic information about the product.</Text>
          </View>
        </View>

        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Amul Milk 1L"
          value={form.name}
          onChangeText={(v) => update('name', v)}
        />

        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, form.category === c && styles.chipActive]}
              onPress={() => update('category', c)}
            >
              <Text style={[styles.chipText, form.category === c && styles.chipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Amul"
              value={form.brand}
              onChangeText={(v) => update('brand', v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>SKU (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AMUL001"
              value={form.sku}
              onChangeText={(v) => update('sku', v)}
            />
          </View>
        </View>

        <Text style={styles.label}>Unit *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {UNITS.map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.chip, form.unit === u && styles.chipActive]}
              onPress={() => update('unit', u)}
            >
              <Text style={[styles.chipText, form.unit === u && styles.chipTextActive]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Barcode (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8901262001234"
          value={form.barcode}
          onChangeText={(v) => update('barcode', v)}
        />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
          multiline
          placeholder="Enter product description..."
          value={form.description}
          onChangeText={(v) => update('description', v)}
        />
      </View>

      {/* Card 2: Pricing & Stock */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: COLORS.successBg }]}>
            <Text style={{ color: COLORS.success, fontWeight: '800' }}>₹</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Pricing & Stock</Text>
            <Text style={styles.cardSub}>Set pricing and stock details.</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Purchase Price (₹) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="45.00"
              value={form.purchasePrice}
              onChangeText={(v) => update('purchasePrice', v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Selling Price (₹) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="50.00"
              value={form.sellingPrice}
              onChangeText={(v) => update('sellingPrice', v)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>MRP (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="55.00"
              value={form.mrp}
              onChangeText={(v) => update('mrp', v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Initial Stock Qty *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="100"
              value={form.quantity}
              onChangeText={(v) => update('quantity', v)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Low Stock Alert *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.lowStock}
              onChangeText={(v) => update('lowStock', v)}
            />
          </View>
          <View style={[styles.switchRow, { flex: 1, marginTop: 22 }]}>
            <Text style={styles.label}>Expiry Tracking</Text>
            <Switch
              value={form.expiryTracking}
              onValueChange={(v) => update('expiryTracking', v)}
              trackColor={{ true: COLORS.primary }}
            />
          </View>
        </View>
      </View>

      {/* Card 3: Additional Settings */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={{ color: COLORS.primary, fontWeight: '800' }}>⚙</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Additional Settings</Text>
            <Text style={styles.cardSub}>Configure storage and supplier details.</Text>
          </View>
        </View>

        <Text style={styles.label}>Storage Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[styles.chip, form.storageLocation === loc && styles.chipActive]}
              onPress={() => update('storageLocation', loc)}
            >
              <Text style={[styles.chipText, form.storageLocation === loc && styles.chipTextActive]}>
                {loc}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Supplier (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Fresh Foods Co. or Dairy Mart"
          value={form.supplier}
          onChangeText={(v) => update('supplier', v)}
        />

        <Text style={styles.label}>Tags (Comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. dairy, breakfast, essential"
          value={form.tags}
          onChangeText={(v) => update('tags', v)}
        />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Featured Product</Text>
            <Text style={styles.cardSub}>Highlight this product on your dashboard.</Text>
          </View>
          <Switch
            value={form.featured}
            onValueChange={(v) => update('featured', v)}
            trackColor={{ true: COLORS.primary }}
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigate('Inventory')}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 34 },
  breadcrumb: { marginBottom: 8 },
  breadcrumbLink: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 14 },
  warningBox: {
    backgroundColor: COLORS.warningBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  warningText: { color: COLORS.warning, fontWeight: '700', fontSize: 13 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  cardSub: { fontSize: 11, color: COLORS.textSecondary },
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
  row: { flexDirection: 'row', gap: 10 },
  chipScroll: { marginVertical: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 9,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
