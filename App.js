import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { ZostoProvider, useZosto } from './src/context/ZostoContext';
import { COLORS } from './src/theme/colors';
import LandingScreen from './src/screens/LandingScreen';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ExpiryScreen from './src/screens/ExpiryScreen';
import StockExchangeScreen from './src/screens/StockExchangeScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import {
  SalesAnalysisScreen,
  AISuggestionsScreen,
  CustomersScreen,
  SuppliersScreen,
  ProfileScreen,
  SettingsScreen,
} from './src/screens/RemainingScreens';

const NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'Inventory', label: 'My Inventory', icon: '📦' },
  { id: 'AddProduct', label: 'Add Product', icon: '➕' },
  { id: 'Expiry', label: 'Expiry Alerts', icon: '◷' },
  { id: 'StockExchange', label: 'Stock Exchange', icon: '⇄' },
  { id: 'Orders', label: 'Orders', icon: '🛒', badge: '3' },
  { id: 'SalesAnalysis', label: 'Sales Analytics', icon: '📊' },
  { id: 'AISuggestions', label: 'AI Suggestions', icon: '🤖' },
  { id: 'Customers', label: 'Customers', icon: '👥' },
  { id: 'Suppliers', label: 'Suppliers', icon: '🚚' },
  { id: 'Profile', label: 'Profile & Location', icon: '👤' },
  { id: 'Settings', label: 'Settings', icon: '⚙' },
  { id: 'Landing', label: 'Landing Page', icon: '🌐' },
];

const BOTTOM_TABS = [
  { id: 'Dashboard', label: 'Home', icon: '🏠' },
  { id: 'Inventory', label: 'Inventory', icon: '📦' },
  { id: 'Orders', label: 'Orders', icon: '🛒' },
  { id: 'SalesAnalysis', label: 'Analytics', icon: '📊' },
  { id: 'AISuggestions', label: 'AI', icon: '🤖' },
];

function MainShell() {
  const { currentScreen, navigate, user, settings } = useZosto();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (currentScreen === 'Landing') return <LandingScreen />;
  if (currentScreen === 'Login') return <AuthScreen mode="login" />;
  if (currentScreen === 'Signup') return <AuthScreen mode="signup" />;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen />;
      case 'Inventory':
        return <InventoryScreen />;
      case 'AddProduct':
        return <AddProductScreen />;
      case 'Expiry':
        return <ExpiryScreen />;
      case 'StockExchange':
        return <StockExchangeScreen />;
      case 'Orders':
        return <OrdersScreen />;
      case 'SalesAnalysis':
        return <SalesAnalysisScreen />;
      case 'AISuggestions':
        return <AISuggestionsScreen />;
      case 'Customers':
        return <CustomersScreen />;
      case 'Suppliers':
        return <SuppliersScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.brandRow} onPress={() => navigate('Dashboard')}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandLogoText}>▦</Text>
          </View>
          <Text style={styles.brandTitle}>
            Zos<Text style={{ color: COLORS.primary }}>to</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.locPill}
            onPress={() => navigate('Profile')}
          >
            <Text style={styles.locPillText} numberOfLines={1}>
              📍 {user?.storeLocation || settings.storeLocation}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => setNotifOpen(!notifOpen)}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigate('Profile')}
          >
            <Text style={styles.avatarText}>
              {(user?.storeName || 'R')[0].toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Banner Dropdown */}
      {notifOpen && (
        <View style={styles.notifBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifTitle}>Notifications</Text>
            <Text style={styles.notifItem}>• 8 products are running low in stock.</Text>
            <Text style={styles.notifItem}>• 6 products are expiring soon.</Text>
          </View>
          <TouchableOpacity onPress={() => setNotifOpen(false)}>
            <Text style={{ fontSize: 16, color: COLORS.textMuted }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Screen Content */}
      <View style={styles.mainContent}>{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomBar}>
        {BOTTOM_TABS.map((t) => {
          const active = currentScreen === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={styles.bottomTab}
              onPress={() => navigate(t.id)}
            >
              <Text style={styles.bottomTabIcon}>{t.icon}</Text>
              <Text style={[styles.bottomTabLabel, active && styles.bottomTabLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={styles.bottomTabIcon}>☰</Text>
          <Text style={styles.bottomTabLabel}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Slide-out Navigation Drawer Modal */}
      <Modal visible={drawerOpen} transparent animationType="fade">
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandLogo}>
                  <Text style={styles.brandLogoText}>▦</Text>
                </View>
                <Text style={styles.brandTitle}>
                  Zos<Text style={{ color: COLORS.primary }}>to</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const active = currentScreen === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.drawerItem, active && styles.drawerItemActive]}
                    onPress={() => {
                      navigate(item.id);
                      setDrawerOpen(false);
                    }}
                  >
                    <Text style={styles.drawerItemIcon}>{item.icon}</Text>
                    <Text
                      style={[styles.drawerItemText, active && styles.drawerItemTextActive]}
                    >
                      {item.label}
                    </Text>
                    {item.badge && (
                      <View style={styles.drawerBadge}>
                        <Text style={styles.drawerBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.drawerAddBtn}
              onPress={() => {
                navigate('AddProduct');
                setDrawerOpen(false);
              }}
            >
              <Text style={styles.drawerAddBtnText}>+ Add Product</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ZostoProvider>
      <MainShell />
    </ZostoProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#f3f7fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: { fontSize: 18, color: COLORS.text, fontWeight: '800' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandLogo: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  brandTitle: { fontSize: 19, fontWeight: '800', color: COLORS.text },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locPill: {
    maxWidth: 130,
    backgroundColor: '#f3f7fd',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  locPillText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  notifBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#f3f7fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.danger,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  notifBanner: {
    flexDirection: 'row',
    backgroundColor: '#fff9eb',
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  notifTitle: { fontSize: 12, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  notifItem: { fontSize: 11, color: COLORS.textSecondary },
  mainContent: { flex: 1, backgroundColor: COLORS.background },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 6,
  },
  bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  bottomTabIcon: { fontSize: 17 },
  bottomTabLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  bottomTabLabelActive: { color: COLORS.primary, fontWeight: '800' },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(16,33,66,0.45)',
  },
  drawerPanel: {
    width: 270,
    backgroundColor: COLORS.surface,
    padding: 16,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeIcon: { fontSize: 18, color: COLORS.textMuted },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 3,
  },
  drawerItemActive: { backgroundColor: COLORS.primaryLight },
  drawerItemIcon: { fontSize: 16 },
  drawerItemText: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  drawerItemTextActive: { color: COLORS.primary, fontWeight: '800' },
  drawerBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  drawerBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  drawerAddBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  drawerAddBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
