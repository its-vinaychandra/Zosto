import React, { useState } from 'react';
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

const FEATURES = [
  {
    icon: '📦',
    title: 'Inventory Management',
    description: 'Manage your products, monitor stock levels, and keep your inventory organized.',
  },
  {
    icon: '🔔',
    title: 'Smart Stock Alerts',
    description: 'Get notified when products run low and avoid unexpected stockouts.',
  },
  {
    icon: '📊',
    title: 'Sales Tracking',
    description: 'Track daily sales, understand business performance, and monitor growth.',
  },
  {
    icon: '🤝',
    title: 'Supplier Management',
    description: 'Connect with suppliers and simplify your ordering process.',
  },
  {
    icon: '📈',
    title: 'Reports & Analytics',
    description: 'Understand your business with clear reports and useful insights.',
  },
  {
    icon: '🏪',
    title: 'Business Dashboard',
    description: 'Access important inventory and sales information from one place.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Register as a shopkeeper, firm, or supplier to get started.',
  },
  {
    num: '02',
    title: 'Manage your inventory',
    desc: 'Organize products, monitor stock, and track your business activity.',
  },
  {
    num: '03',
    title: 'Grow with confidence',
    desc: 'Make informed decisions with inventory insights and sales reports.',
  },
];

export default function LandingScreen() {
  const { navigate, setUser } = useZosto();
  const [contact, setContact] = useState({ name: '', email: '', message: '' });

  const handleDemoEnter = () => {
    setUser({
      uid: 'demo-ramesh-001',
      name: 'Ramesh Kumar',
      email: 'rameshstore@gmail.com',
      role: 'shopkeeper',
      storeName: 'Ramesh Stores',
      storeLocation: 'Nellore, Andhra Pradesh',
    });
    navigate('Dashboard');
  };

  const handleSendContact = () => {
    if (!contact.name.trim() || !contact.email.trim() || !contact.message.trim()) {
      Alert.alert('Missing Info', 'Please fill out your name, email, and message.');
      return;
    }
    Alert.alert('Message Sent', 'Thank you for reaching out! Our team will contact you shortly.');
    setContact({ name: '', email: '', message: '' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>▦</Text>
          </View>
          <Text style={styles.logoText}>
            Zos<Text style={{ color: COLORS.primary }}>to</Text>
          </Text>
        </View>
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigate('Login')}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigate('Signup')}>
            <Text style={styles.ctaBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroCard}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>SMART INVENTORY. SMARTER BUSINESS.</Text>
        </View>
        <Text style={styles.heroTitle}>
          Smart Inventory{'\n'}for Every <Text style={{ color: COLORS.primary }}>Shop.</Text>
        </Text>
        <Text style={styles.heroSub}>
          Manage stock, track sales, connect with suppliers, and grow your business with Zosto.
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.primaryHeroBtn} onPress={handleDemoEnter}>
            <Text style={styles.primaryHeroBtnText}>Open Live Dashboard →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryHeroBtn} onPress={() => navigate('Signup')}>
            <Text style={styles.secondaryHeroBtnText}>Create Account ↗</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trustRow}>
          <Text style={styles.trustItem}>✓ Simple to use</Text>
          <Text style={styles.trustDivider}>|</Text>
          <Text style={styles.trustItem}>✓ Built for businesses</Text>
        </View>
      </View>

      {/* Mini Interactive Dashboard Preview */}
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <View>
            <Text style={styles.previewBrand}>▦ Zosto</Text>
            <Text style={styles.previewSub}>Business Overview</Text>
          </View>
          <View style={styles.previewAvatar}>
            <Text style={styles.previewAvatarText}>S</Text>
          </View>
        </View>
        <View style={styles.previewWelcome}>
          <Text style={styles.previewWelcomeTitle}>Good morning! 👋</Text>
          <Text style={styles.previewWelcomeSub}>Here is what's happening in your store.</Text>
        </View>
        <View style={styles.previewStatsGrid}>
          <View style={styles.previewStat}>
            <Text style={styles.previewStatLabel}>Total Products 📦</Text>
            <Text style={styles.previewStatVal}>1,248</Text>
            <Text style={styles.previewStatNote}>Products in inventory</Text>
          </View>
          <View style={styles.previewStat}>
            <Text style={styles.previewStatLabel}>Today's Sales ₹</Text>
            <Text style={[styles.previewStatVal, { color: COLORS.success }]}>₹12,450</Text>
            <Text style={styles.previewStatNote}>Sales overview</Text>
          </View>
          <View style={styles.previewStat}>
            <Text style={styles.previewStatLabel}>Low Stock ⚠️</Text>
            <Text style={[styles.previewStatVal, { color: COLORS.warning }]}>08</Text>
            <Text style={styles.previewStatNote}>Needs attention</Text>
          </View>
          <View style={styles.previewStat}>
            <Text style={styles.previewStatLabel}>Orders 🛒</Text>
            <Text style={styles.previewStatVal}>36</Text>
            <Text style={styles.previewStatNote}>Orders to manage</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ABOUT ZOSTO</Text>
        <Text style={styles.sectionTitle}>
          Your business deserves{'\n'}
          <Text style={{ color: COLORS.primary }}>a smarter way.</Text>
        </Text>
        <Text style={styles.sectionDesc}>
          Zosto brings shopkeepers, suppliers, and businesses together through one simple inventory
          management platform. Spend less time managing stock and more time growing your business.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>WHAT ZOSTO OFFERS</Text>
        <Text style={styles.sectionTitle}>
          Everything you need.{'\n'}
          <Text style={{ color: COLORS.primary }}>All in one place.</Text>
        </Text>
        {FEATURES.map((f, idx) => (
          <View key={f.title} style={styles.featureCard}>
            <View style={styles.featureTop}>
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </View>
              <Text style={styles.featureNum}>0{idx + 1}</Text>
            </View>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.description}</Text>
          </View>
        ))}
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <Text style={styles.sectionTitle}>
          Three steps to a <Text style={{ color: COLORS.primary }}>better business.</Text>
        </Text>
        {STEPS.map((s) => (
          <View key={s.num} style={styles.stepCard}>
            <Text style={styles.stepNum}>{s.num}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.contactCard}>
        <Text style={styles.sectionLabel}>GET IN TOUCH</Text>
        <Text style={styles.sectionTitle}>Let's grow your business together.</Text>
        <Text style={styles.inputLabel}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={contact.name}
          onChangeText={(v) => setContact({ ...contact, name: v })}
        />
        <Text style={styles.inputLabel}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          value={contact.email}
          onChangeText={(v) => setContact({ ...contact, email: v })}
        />
        <Text style={styles.inputLabel}>Your message</Text>
        <TextInput
          style={[styles.input, { height: 84, textAlignVertical: 'top' }]}
          placeholder="How can we help?"
          multiline
          value={contact.message}
          onChangeText={(v) => setContact({ ...contact, message: v })}
        />
        <TouchableOpacity style={styles.primaryHeroBtn} onPress={handleSendContact}>
          <Text style={styles.primaryHeroBtnText}>Send Message →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLogo}>▦ Zosto</Text>
        <Text style={styles.footerCopy}>Smarter inventory. Stronger businesses. © 2026 Zosto</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  logoText: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loginBtnText: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
  ctaBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  badgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: COLORS.text, lineHeight: 36, marginBottom: 10 },
  heroSub: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21, marginBottom: 16 },
  heroButtons: { gap: 10, marginBottom: 14 },
  primaryHeroBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryHeroBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryHeroBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryHeroBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustItem: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  trustDivider: { color: COLORS.border },
  previewCard: {
    backgroundColor: '#102142',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewBrand: { color: '#fff', fontSize: 17, fontWeight: '800' },
  previewSub: { color: '#9ab0d0', fontSize: 12 },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: { color: '#fff', fontWeight: '800' },
  previewWelcome: {
    backgroundColor: '#1b315c',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  previewWelcomeTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  previewWelcomeSub: { color: '#b5c6e0', fontSize: 12, marginTop: 2 },
  previewStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  previewStat: {
    width: '48%',
    backgroundColor: '#1b315c',
    borderRadius: 12,
    padding: 12,
  },
  previewStatLabel: { color: '#b5c6e0', fontSize: 11 },
  previewStatVal: { color: '#fff', fontSize: 20, fontWeight: '800', marginVertical: 4 },
  previewStatNote: { color: '#8ea4c8', fontSize: 10 },
  section: { marginBottom: 22 },
  sectionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  sectionDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
  featureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { fontSize: 20 },
  featureNum: { fontSize: 18, fontWeight: '800', color: '#d0dceb' },
  featureTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  featureDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepNum: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  stepTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  stepDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginTop: 10, marginBottom: 5 },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  footer: { alignItems: 'center', paddingVertical: 14 },
  footerLogo: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  footerCopy: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
});
