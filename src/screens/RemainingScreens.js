import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { COLORS, formatINR } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

// 1. SALES ANALYSIS SCREEN
const PERIOD_DATA = {
  '7D': { sales: 7450, orders: 36, average: 207, units: 358, margin: 21, bars: [45, 62, 50, 90, 72, 100, 95] },
  '30D': { sales: 28450, orders: 120, average: 237, units: 1342, margin: 22, bars: [35, 55, 48, 68, 82, 75, 92, 100] },
  '3M': { sales: 84200, orders: 365, average: 231, units: 3860, margin: 23, bars: [50, 60, 55, 72, 85, 95, 100] },
  '1Y': { sales: 425600, orders: 1820, average: 234, units: 18950, margin: 24, bars: [40, 52, 60, 68, 78, 88, 100] },
};

const TOP_PRODUCTS = [
  { name: 'Milk Packet (1L)', emoji: '🥛', units: 320, pct: 24 },
  { name: 'Bread (400g)', emoji: '🍞', units: 240, pct: 18 },
  { name: 'Potato Chips', emoji: '🍟', units: 180, pct: 13 },
  { name: 'Soft Drink (500ml)', emoji: '🥤', units: 160, pct: 12 },
  { name: 'Yogurt (500g)', emoji: '🥣', units: 140, pct: 10 },
];

export function SalesAnalysisScreen() {
  const [period, setPeriod] = useState('30D');
  const data = PERIOD_DATA[period];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>▥ Sales Analysis</Text>
          <Text style={styles.subtitle}>Track sales performance & top products.</Text>
        </View>
        <View style={styles.periodRow}>
          {['7D', '30D', '3M', '1Y'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.statLabel}>Total Sales</Text>
          <Text style={styles.statVal}>{formatINR(data.sales)}</Text>
          <Text style={styles.statChange}>↑ 12% vs last month</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.statLabel}>Total Orders</Text>
          <Text style={styles.statVal}>{data.orders}</Text>
          <Text style={styles.statChange}>↑ 8% vs last month</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.orange }]}>
          <Text style={styles.statLabel}>Avg Order Value</Text>
          <Text style={styles.statVal}>{formatINR(data.average)}</Text>
          <Text style={styles.statChange}>↑ 5% vs last month</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.purple }]}>
          <Text style={styles.statLabel}>Units Sold ({data.margin}% Margin)</Text>
          <Text style={styles.statVal}>{data.units}</Text>
          <Text style={styles.statChange}>↑ 15% vs last month</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sales Trend ({period})</Text>
        <View style={styles.barChartRow}>
          {data.bars.map((b, i) => (
            <View key={i} style={styles.barWrap}>
              <View style={[styles.barFill, { height: `${b}%` }]} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Selling Products</Text>
        {TOP_PRODUCTS.map((p, idx) => (
          <View key={p.name} style={styles.listRow}>
            <Text style={styles.rankBadge}>#{idx + 1}</Text>
            <Text style={{ fontSize: 20 }}>{p.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{p.name}</Text>
              <Text style={styles.rowSub}>{p.units} units sold</Text>
            </View>
            <Text style={styles.pctText}>{p.pct}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// 2. AI SUGGESTIONS SCREEN
const RESTOCK_RECS = [
  { id: 1, name: 'Milk Packet (1L)', emoji: '🥛', stock: 10, demand: 60, order: 50, reason: 'High demand, low stock' },
  { id: 2, name: 'Bread (400g)', emoji: '🍞', stock: 15, demand: 40, order: 30, reason: 'Demand increasing' },
  { id: 3, name: 'Potato Chips', emoji: '🍟', stock: 20, demand: 80, order: 60, reason: 'Weekend spike expected' },
  { id: 4, name: 'Soft Drink (500ml)', emoji: '🥤', stock: 30, demand: 100, order: 70, reason: 'High seasonal demand' },
  { id: 5, name: 'Yogurt (500g)', emoji: '🥣', stock: 8, demand: 35, order: 40, reason: 'Likely to run out' },
];

export function AISuggestionsScreen() {
  const { reorderedIds, setReorderedIds } = useZosto();

  const toggleReorder = (id, name) => {
    if (!reorderedIds.includes(id)) {
      setReorderedIds([...reorderedIds, id]);
      Alert.alert('Added to Reorder', `${name} added to your reorder list.`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🤖 AI Suggestions (AI Powered)</Text>
      <Text style={styles.subtitle}>Smart insights and demand forecast for your store.</Text>

      <View style={styles.grid}>
        <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.statLabel}>Products to Reorder</Text>
          <Text style={styles.statVal}>5</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.statLabel}>Expected High Demand</Text>
          <Text style={styles.statVal}>6</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.orange }]}>
          <Text style={styles.statLabel}>Possible Stockouts</Text>
          <Text style={styles.statVal}>2</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.purple }]}>
          <Text style={styles.statLabel}>Potential Revenue +</Text>
          <Text style={styles.statVal}>₹12,450</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Recommended Restock Items</Text>
          <TouchableOpacity
            style={styles.smallPrimaryBtn}
            onPress={() => {
              setReorderedIds(RESTOCK_RECS.map((r) => r.id));
              Alert.alert('Applied', 'All recommended items added to reorder list.');
            }}
          >
            <Text style={styles.smallPrimaryBtnText}>✦ Apply All</Text>
          </TouchableOpacity>
        </View>

        {RESTOCK_RECS.map((item) => {
          const added = reorderedIds.includes(item.id);
          return (
            <View key={item.id} style={styles.listRow}>
              <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowSub}>
                  Stock: {item.stock} • Demand: {item.demand} • Rec Order: +{item.order}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.orange }}>{item.reason}</Text>
              </View>
              <TouchableOpacity
                style={[styles.actionBtn, added && { backgroundColor: COLORS.successBg }]}
                onPress={() => toggleReorder(item.id, item.name)}
              >
                <Text style={[styles.actionBtnText, added && { color: COLORS.success }]}>
                  {added ? '✓ Added' : '+ Order'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// 3. CUSTOMERS SCREEN
export function CustomersScreen() {
  const { customers, setCustomers } = useZosto();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '' });

  const filtered = customers.filter((c) =>
    [c.name, c.phone, c.location].some((f) => (f || '').toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert('Required', 'Customer name and phone are required.');
      return;
    }
    setCustomers([
      {
        id: `CUS-${Date.now().toString().slice(-4)}`,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        location: form.location.trim() || 'Nellore',
        orders: 0,
        spent: 0,
        lastOrder: 'No orders yet',
        status: 'Active',
      },
      ...customers,
    ]);
    setForm({ name: '', phone: '', email: '', location: '' });
    setShowAdd(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.title}>👥 Customers</Text>
          <Text style={styles.subtitle}>Manage customer relationships & history.</Text>
        </View>
        <TouchableOpacity style={styles.smallPrimaryBtn} onPress={() => setShowAdd(!showAdd)}>
          <Text style={styles.smallPrimaryBtnText}>+ Add Customer</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add New Customer</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Location (e.g. Nellore)"
            value={form.location}
            onChangeText={(v) => setForm({ ...form, location: v })}
          />
          <TouchableOpacity style={styles.smallPrimaryBtn} onPress={handleAdd}>
            <Text style={styles.smallPrimaryBtnText}>Save Customer</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={[styles.input, { marginBottom: 12 }]}
        placeholder="⌕ Search customers by name, phone or location..."
        value={search}
        onChangeText={setSearch}
      />

      {filtered.map((c, idx) => (
        <View key={c.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>
                {c.name} {idx === 0 ? '♛' : ''}
              </Text>
              <Text style={styles.rowSub}>
                {c.phone} • {c.location}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.pctText}>{formatINR(c.spent)}</Text>
              <Text style={styles.rowSub}>{c.orders} orders</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// 4. SUPPLIERS SCREEN
export function SuppliersScreen() {
  const { suppliers, setSuppliers } = useZosto();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', phone: '', category: 'Dairy Products' });

  const filtered = suppliers.filter((s) =>
    [s.name, s.contact, s.category].some((f) => (f || '').toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    if (!form.name.trim() || !form.contact.trim() || !form.phone.trim()) {
      Alert.alert('Required', 'Supplier name, contact person, and phone are required.');
      return;
    }
    setSuppliers([
      {
        id: `SUP-${Date.now().toString().slice(-4)}`,
        name: form.name.trim(),
        contact: form.contact.trim(),
        phone: form.phone.trim(),
        category: form.category,
        purchases: 0,
        orders: 0,
        lastOrder: 'No orders yet',
        status: 'Active',
      },
      ...suppliers,
    ]);
    setForm({ name: '', contact: '', phone: '', category: 'Dairy Products' });
    setShowAdd(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.title}>🚚 Suppliers</Text>
          <Text style={styles.subtitle}>Manage suppliers & purchase orders.</Text>
        </View>
        <TouchableOpacity style={styles.smallPrimaryBtn} onPress={() => setShowAdd(!showAdd)}>
          <Text style={styles.smallPrimaryBtnText}>+ Add Supplier</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add New Supplier</Text>
          <TextInput
            style={styles.input}
            placeholder="Supplier Company Name *"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Person *"
            value={form.contact}
            onChangeText={(v) => setForm({ ...form, contact: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
          />
          <TouchableOpacity style={styles.smallPrimaryBtn} onPress={handleAdd}>
            <Text style={styles.smallPrimaryBtnText}>Save Supplier</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={[styles.input, { marginBottom: 12 }]}
        placeholder="⌕ Search suppliers by name, contact, or category..."
        value={search}
        onChangeText={setSearch}
      />

      {filtered.map((s) => (
        <View key={s.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{s.name}</Text>
              <Text style={styles.rowSub}>
                👤 {s.contact} • ☎ {s.phone}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.primary, marginTop: 2 }}>
                {s.category}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.pctText}>{formatINR(s.purchases)}</Text>
              <TouchableOpacity
                style={[styles.actionBtn, { marginTop: 6 }]}
                onPress={() =>
                  Alert.alert('Purchase Order', `Selected ${s.name} for a new purchase order.`)
                }
              >
                <Text style={styles.actionBtnText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// 5. PROFILE & CHANGE LOCATION SCREEN
export function ProfileScreen() {
  const { settings, setSettings, updateStoreLocation } = useZosto();
  const [locInput, setLocInput] = useState(settings.storeLocation);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>👤 Store Profile</Text>
      <Text style={styles.subtitle}>Manage your shopkeeper profile and store location.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{settings.storeName}</Text>
        <Text style={styles.rowSub}>
          {settings.role} • Joined 12 Jan 2026 • Active
        </Text>

        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={styles.input}
          value={settings.ownerName}
          onChangeText={(v) => setSettings({ ...settings, ownerName: v })}
        />

        <Text style={styles.label}>Store Name</Text>
        <TextInput
          style={styles.input}
          value={settings.storeName}
          onChangeText={(v) => setSettings({ ...settings, storeName: v })}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={settings.phone}
          onChangeText={(v) => setSettings({ ...settings, phone: v })}
        />

        <Text style={styles.label}>Store Location / Address</Text>
        <TextInput
          style={styles.input}
          value={locInput}
          onChangeText={setLocInput}
        />

        <TouchableOpacity
          style={[styles.smallPrimaryBtn, { marginTop: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            updateStoreLocation(locInput);
            Alert.alert('Saved', 'Profile and Store Location updated successfully!');
          }}
        >
          <Text style={styles.smallPrimaryBtnText}>Save Profile & Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 6. SETTINGS SCREEN
export function SettingsScreen() {
  const { settings, setSettings, notifications, setNotifications } = useZosto();

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙ Settings</Text>
      <Text style={styles.subtitle}>Manage your store preferences and notifications.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Business Preferences</Text>
        <Text style={styles.label}>Currency</Text>
        <TextInput
          style={styles.input}
          value={settings.currency}
          onChangeText={(v) => setSettings({ ...settings, currency: v })}
        />
        <Text style={styles.label}>Default Tax Rate (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={settings.tax}
          onChangeText={(v) => setSettings({ ...settings, tax: v })}
        />
        <Text style={styles.label}>Low Stock Alert Threshold (units)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={settings.lowStock}
          onChangeText={(v) => setSettings({ ...settings, lowStock: v })}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notification Settings</Text>
        {[
          ['lowStock', 'Low Stock Alerts'],
          ['expiry', 'Expiry Alerts'],
          ['orders', 'New Order Notifications'],
          ['delivery', 'Delivery Updates'],
          ['ai', 'AI Suggestions'],
        ].map(([k, label]) => (
          <View key={k} style={styles.switchRow}>
            <Text style={styles.rowTitle}>{label}</Text>
            <Switch
              value={!!notifications[k]}
              onValueChange={() => toggleNotif(k)}
              trackColor={{ true: COLORS.primary }}
            />
          </View>
        ))}
      </View>
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
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 21, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },
  periodRow: { flexDirection: 'row', gap: 6 },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  periodTextActive: { color: '#fff' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
  },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  statVal: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginVertical: 2 },
  statChange: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: 10,
  },
  barWrap: {
    flex: 1,
    height: 85,
    marginHorizontal: 4,
    backgroundColor: '#eef4fc',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },
  rankBadge: { fontSize: 12, fontWeight: '800', color: COLORS.primary, width: 22 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  rowSub: { fontSize: 11, color: COLORS.textMuted },
  pctText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  smallPrimaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  smallPrimaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  actionBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },
});
