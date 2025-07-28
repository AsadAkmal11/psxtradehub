import React from 'react';

// Theme configuration
export const theme = {
  colors: {
    primary: '#F0B90B',
    secondary: '#181A20',
    background: '#23262F',
    surface: '#2A2D3A',
    text: '#F5F6FA',
    textSecondary: '#A0AEC0',
    success: '#38a169',
    error: '#F6465D',
    warning: '#F0B90B',
    border: '#F0B90B33',
    borderHover: '#F0B90B66'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  shadows: {
    sm: '0 2px 8px rgba(240, 185, 11, 0.12)',
    md: '0 4px 16px rgba(240, 185, 11, 0.18)',
    lg: '0 8px 32px rgba(240, 185, 11, 0.24)'
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  }
};

// Common styles
export const commonStyles = {
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    border: `2px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
    color: theme.colors.text,
    minHeight: '400px'
  },
  header: {
    color: theme.colors.primary,
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    letterSpacing: '1px'
  },
  formGroup: {
    marginBottom: theme.spacing.md
  },
  label: {
    display: 'block',
    color: theme.colors.text,
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text,
    fontSize: '1rem',
    transition: theme.transitions.normal,
    outline: 'none',
    '&:focus': {
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primary}33`
    },
    '&:hover': {
      borderColor: theme.colors.borderHover
    }
  },
  select: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text,
    fontSize: '1rem',
    transition: theme.transitions.normal,
    outline: 'none',
    cursor: 'pointer',
    '&:focus': {
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primary}33`
    },
    '&:hover': {
      borderColor: theme.colors.borderHover
    }
  },
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.secondary,
      border: `2px solid ${theme.colors.primary}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      outline: 'none',
      letterSpacing: '0.5px',
      '&:hover': {
        backgroundColor: theme.colors.secondary,
        color: theme.colors.primary,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.lg
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none'
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      outline: 'none',
      '&:hover': {
        backgroundColor: theme.colors.primary,
        color: theme.colors.secondary
      }
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: 'white',
      border: `2px solid ${theme.colors.error}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      outline: 'none',
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.colors.error
      }
    }
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    boxShadow: theme.shadows.sm
  },
  tableHeader: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    padding: theme.spacing.md,
    textAlign: 'left',
    fontWeight: '700',
    fontSize: '0.9rem',
    letterSpacing: '0.5px'
  },
  tableCell: {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: '0.9rem'
  },
  tableRow: {
    transition: theme.transitions.fast,
    '&:hover': {
      backgroundColor: theme.colors.border
    }
  },
  message: {
    success: {
      backgroundColor: theme.colors.success,
      color: 'white',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
      textAlign: 'center'
    },
    error: {
      backgroundColor: theme.colors.error,
      color: 'white',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
      textAlign: 'center'
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: theme.colors.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
      textAlign: 'center'
    }
  }
};

// Helper function to apply styles
export const applyStyles = (baseStyles, customStyles = {}) => {
  return { ...baseStyles, ...customStyles };
};

export default { theme, commonStyles, applyStyles }; 