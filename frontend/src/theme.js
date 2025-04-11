import { createTheme } from '@mui/material/styles';

// Define custom color palette with dark theme inspired by Blacksmith UI
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#9c27b0',
      dark: '#6a1b9a',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      darker: '#0f0f0f',
      card: '#252525',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#aaaaaa',
      disabled: '#666666',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: 'rgba(255, 255, 255, 0.7)',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.3),0px 1px 1px 0px rgba(0,0,0,0.2),0px 1px 3px 0px rgba(0,0,0,0.1)',
    '0px 3px 1px -2px rgba(0,0,0,0.3),0px 2px 2px 0px rgba(0,0,0,0.2),0px 1px 5px 0px rgba(0,0,0,0.1)',
    '0px 3px 3px -2px rgba(0,0,0,0.3),0px 3px 4px 0px rgba(0,0,0,0.2),0px 1px 8px 0px rgba(0,0,0,0.1)',
    '0px 2px 4px -1px rgba(0,0,0,0.3),0px 4px 5px 0px rgba(0,0,0,0.2),0px 1px 10px 0px rgba(0,0,0,0.1)',
    '0px 3px 5px -1px rgba(0,0,0,0.3),0px 5px 8px 0px rgba(0,0,0,0.2),0px 1px 14px 0px rgba(0,0,0,0.1)',
    '0px 3px 5px -1px rgba(0,0,0,0.3),0px 6px 10px 0px rgba(0,0,0,0.2),0px 1px 18px 0px rgba(0,0,0,0.1)',
    '0px 4px 5px -2px rgba(0,0,0,0.3),0px 7px 10px 1px rgba(0,0,0,0.2),0px 2px 16px 1px rgba(0,0,0,0.1)',
    '0px 5px 5px -3px rgba(0,0,0,0.3),0px 8px 10px 1px rgba(0,0,0,0.2),0px 3px 14px 2px rgba(0,0,0,0.1)',
    '0px 5px 6px -3px rgba(0,0,0,0.3),0px 9px 12px 1px rgba(0,0,0,0.2),0px 3px 16px 2px rgba(0,0,0,0.1)',
    '0px 6px 6px -3px rgba(0,0,0,0.3),0px 10px 14px 1px rgba(0,0,0,0.2),0px 4px 18px 3px rgba(0,0,0,0.1)',
    '0px 6px 7px -4px rgba(0,0,0,0.3),0px 11px 15px 1px rgba(0,0,0,0.2),0px 4px 20px 3px rgba(0,0,0,0.1)',
    '0px 7px 8px -4px rgba(0,0,0,0.3),0px 12px 17px 2px rgba(0,0,0,0.2),0px 5px 22px 4px rgba(0,0,0,0.1)',
    '0px 7px 8px -4px rgba(0,0,0,0.3),0px 13px 19px 2px rgba(0,0,0,0.2),0px 5px 24px 4px rgba(0,0,0,0.1)',
    '0px 7px 9px -4px rgba(0,0,0,0.3),0px 14px 21px 2px rgba(0,0,0,0.2),0px 5px 26px 4px rgba(0,0,0,0.1)',
    '0px 8px 9px -5px rgba(0,0,0,0.3),0px 15px 22px 2px rgba(0,0,0,0.2),0px 6px 28px 5px rgba(0,0,0,0.1)',
    '0px 8px 10px -5px rgba(0,0,0,0.3),0px 16px 24px 2px rgba(0,0,0,0.2),0px 6px 30px 5px rgba(0,0,0,0.1)',
    '0px 8px 11px -5px rgba(0,0,0,0.3),0px 17px 26px 2px rgba(0,0,0,0.2),0px 6px 32px 5px rgba(0,0,0,0.1)',
    '0px 9px 11px -5px rgba(0,0,0,0.3),0px 18px 28px 2px rgba(0,0,0,0.2),0px 7px 34px 6px rgba(0,0,0,0.1)',
    '0px 9px 12px -6px rgba(0,0,0,0.3),0px 19px 29px 2px rgba(0,0,0,0.2),0px 7px 36px 6px rgba(0,0,0,0.1)',
    '0px 10px 13px -6px rgba(0,0,0,0.3),0px 20px 31px 3px rgba(0,0,0,0.2),0px 8px 38px 7px rgba(0,0,0,0.1)',
    '0px 10px 13px -6px rgba(0,0,0,0.3),0px 21px 33px 3px rgba(0,0,0,0.2),0px 8px 40px 7px rgba(0,0,0,0.1)',
    '0px 10px 14px -6px rgba(0,0,0,0.3),0px 22px 35px 3px rgba(0,0,0,0.2),0px 8px 42px 7px rgba(0,0,0,0.1)',
    '0px 11px 14px -7px rgba(0,0,0,0.3),0px 23px 36px 3px rgba(0,0,0,0.2),0px 9px 44px 8px rgba(0,0,0,0.1)',
    '0px 11px 15px -7px rgba(0,0,0,0.3),0px 24px 38px 3px rgba(0,0,0,0.2),0px 9px 46px 8px rgba(0,0,0,0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease-in-out',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(90deg, #7b1fa2 0%, #9c27b0 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #6a1b9a 0%, #7b1fa2 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#252525',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 16px 70px rgba(0, 0, 0, 0.4)',
          },
          border: '1px solid rgba(255, 255, 255, 0.1)'
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#252525',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease-in-out',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.3)',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.2)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: '8px',
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#1976d2',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
  },
});

export default theme; 