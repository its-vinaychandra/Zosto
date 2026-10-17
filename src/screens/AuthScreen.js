import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useZosto } from '../context/ZostoContext';

export default function AuthScreen({ mode = 'login' }) {
  const { setUser, navigate, updateStoreLocation } = useZosto();
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [role, setRole] = useState('shopkeeper');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email address and password.');
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (isSignup && role === 'shopkeeper' && (!storeName.trim() || !storeLocation.trim())) {
      setError('Please enter your store name and store location.');
      return;
    }
    setLoading(true);
    try {
      const userObj = {
        uid: `uid-${Date.now()}`,
        name: name.trim() || email.split('@')[0] || 'Ramesh Kumar',
        email: email.trim().toLowerCase(),
        role,
        storeName: storeName.trim() || 'Ramesh Stores',
        storeLocation: storeLocation.trim() || 'Nellore, Andhra Pradesh',
      };
      setUser(userObj);
      if (storeLocation.trim()) {
        updateStoreLocation(storeLocation.trim());
      }
      navigate('Dashboard');
    } catch (e) {
      setError(e.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
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

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Enter your email address first to reset password.');
      return;
    }
    Alert.alert('Password Reset', `Password reset instructions sent to ${email.trim()}.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigate('Landing')}>
        <Text style={styles.backBtnText}>← Back to Home</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>▦</Text>
          </View>
          <Text style={styles.brandTitle}>
            Zos<Text style={{ color: COLORS.primary }}>to</Text>
          </Text>
        </View>

        <Text style={styles.title}>
          {isSignup ? 'Create Your Zosto Account' : 'Welcome to Zosto'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? 'Start managing your business smarter.'
            : 'Login to manage your inventory smarter.'}
        </Text>

        {isSignup && (
          <>
            <Text style={styles.label}>Account type</Text>
            <View style={styles.roleRow}>
              {[
                ['shopkeeper', '🏪 Shopkeeper'],
                ['deliveryAgent', '🚚 Delivery Agent'],
              ].map(([val, label]) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.roleChip, role === val && styles.roleChipActive]}
                  onPress={() => setRole(val)}
                >
                  <Text style={[styles.roleChipText, role === val && styles.roleChipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />

            {role === 'shopkeeper' && (
              <>
                <Text style={styles.label}>Store name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your store name"
                  value={storeName}
                  onChangeText={setStoreName}
                />
                <Text style={styles.label}>Store location / address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your store address"
                  value={storeLocation}
                  onChangeText={setStoreLocation}
                />
              </>
            )}
          </>
        )}

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!isSignup && (
          <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.primaryBtnText}>
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={handleDemoLogin}>
          <Text style={styles.googleBtnText}>⚡ Continue with Demo Shopkeeper Account</Text>
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.switchLink}>{isSignup ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, justifyContent: 'center', flexGrow: 1 },
  backBtn: { marginBottom: 14 },
  backBtnText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  brandTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 10, marginBottom: 6 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: '#fbfcff',
  },
  roleChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  roleChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  input: {
    backgroundColor: '#fbfcff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.text,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  errorText: {
    color: COLORS.danger,
    backgroundColor: COLORS.dangerBg,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    fontSize: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '700' },
  googleBtn: {
    borderWidth: 1,
    borderColor: '#bcd8ff',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  googleBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchText: { color: COLORS.textSecondary, fontSize: 13 },
  switchLink: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
});
