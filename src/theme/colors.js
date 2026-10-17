export const COLORS = {
  primary: '#0866ff',
  primaryDark: '#0052cc',
  primaryLight: '#e8f3ff',
  background: '#f3f8ff',
  surface: '#ffffff',
  text: '#102142',
  textSecondary: '#536783',
  textMuted: '#74869f',
  border: '#e4ebf5',
  success: '#079a66',
  successBg: '#e2f9ef',
  warning: '#d88700',
  warningBg: '#fff3db',
  danger: '#e82b46',
  dangerBg: '#ffe9ed',
  purple: '#8435f7',
  purpleBg: '#f0e5ff',
  pink: '#f03467',
  pinkBg: '#ffe7ef',
  orange: '#f18b00',
  orangeBg: '#fff3e3',
};

export const formatINR = (val, decimals = 0) => {
  const num = Number(val) || 0;
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
