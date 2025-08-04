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
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};

// Common styles
export const commonStyles = {
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,  // Reduced from xl to lg for more content space
    border: `2px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
    color: theme.colors.text,
    minHeight: '400px',
    height: '100%',  // Use full available height
    overflow: 'hidden'  // Prevent scrolling
  },
  header: {
    color: theme.colors.primary,
    fontSize: '1.4rem',  // Slightly reduced from 1.5rem
    fontWeight: '700',
    marginBottom: theme.spacing.md,  // Reduced from lg
    textAlign: 'center',
    letterSpacing: '1px'
  },
  formGroup: {
    marginBottom: theme.spacing.sm  // Reduced from md for tighter spacing
  },
  label: {
    display: 'block',
    color: theme.colors.text,
    fontSize: '0.85rem',  // Slightly reduced
    fontWeight: '600',
    marginBottom: theme.spacing.xs,  // Reduced from sm
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,  // Reduced padding
    backgroundColor: theme.colors.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text,
    fontSize: '0.95rem',  // Slightly reduced
    transition: theme.transitions.normal,
    outline: 'none',
    boxSizing: 'border-box',
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
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,  // Reduced padding
    backgroundColor: theme.colors.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text,
    fontSize: '0.95rem',  // Slightly reduced
    transition: theme.transitions.normal,
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
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
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,  // Reduced padding
      fontSize: '0.95rem',  // Slightly reduced
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
  },
  // Enhanced modal styles
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    },
    content: {
      background: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: '32px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: theme.shadows.lg,
      border: `2px solid ${theme.colors.border}`,
      position: 'relative',
      animation: 'modalSlideIn 0.3s ease-out'
    },
    header: {
      color: theme.colors.primary,
      marginBottom: '24px',
      fontSize: '1.5rem',
      fontWeight: '700',
      textAlign: 'center',
      borderBottom: `2px solid ${theme.colors.border}`,
      paddingBottom: '16px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      color: theme.colors.text,
      fontSize: '0.95rem',
      fontWeight: '600',
      marginBottom: '8px',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: theme.colors.secondary,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      color: theme.colors.text,
      fontSize: '1rem',
      transition: theme.transitions.normal,
      outline: 'none',
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primary}33`
      },
      '&:hover': {
        borderColor: theme.colors.borderHover
      }
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    button: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.secondary,
        border: `2px solid ${theme.colors.primary}`,
        borderRadius: theme.borderRadius.md,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: theme.transitions.normal,
        outline: 'none',
        letterSpacing: '0.5px',
        minWidth: '100px',
        '&:hover': {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.lg
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.primary}`,
        borderRadius: theme.borderRadius.md,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: theme.transitions.normal,
        outline: 'none',
        minWidth: '100px',
        '&:hover': {
          backgroundColor: theme.colors.primary,
          color: theme.colors.secondary
        }
      }
    }
  }
};

// Responsive utilities
export const responsive = {
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`
};

// Helper function to apply styles
export const applyStyles = (baseStyles, customStyles = {}) => {
  return { ...baseStyles, ...customStyles };
};

// Helper function to get responsive modal styles
export const getResponsiveModalStyles = (isMobile = false) => {
  const baseStyles = commonStyles.modal;
  
  if (isMobile) {
    return {
      ...baseStyles,
      content: {
        ...baseStyles.content,
        padding: '24px',
        maxWidth: '95vw',
        margin: '10px'
      },
      buttonGroup: {
        ...baseStyles.buttonGroup,
        flexDirection: 'column',
        gap: '12px'
      }
    };
  }
  
  return baseStyles;
};

export default { theme, commonStyles, applyStyles, responsive, getResponsiveModalStyles }; 