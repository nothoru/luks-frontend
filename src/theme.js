// src/theme.js (Refactored)

import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const colorTokens = {
  orange: {
    100: "#FFEADD",
    200: "#FFD5B8",
    300: "#FFC194",
    400: "#FFAC70",
    500: "#FD8204",
    600: "#EE6B18",
    700: "#D45A15",
    800: "#BB4A12",
    900: "#A1390F",
  },
  red: {
    500: "#ED3649",
  },
  grey: {
    100: "#F5F5F5",
    200: "#EAEAEA",
    300: "#CCCCCC",
    400: "#B3B3B3",
    500: "#808080",
    600: "#403838",
    700: "#272727",
    800: "#1E1E1E",
    900: "#141414",
  },
  background: {
    light: "#FEFBF6",
    dark: "#1E1E1E",
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colorTokens.orange[500],
              light: colorTokens.orange[400],
            },
            secondary: {
              main: colorTokens.orange[600],
            },
            error: {
              main: colorTokens.red[500],
            },
            background: {
              default: colorTokens.background.dark,
              paper: colorTokens.grey[800],
            },
            text: {
              primary: colorTokens.grey[100],
              secondary: colorTokens.grey[300],
            },
          }
        : {
            primary: {
              main: colorTokens.orange[600],
              contrastText: "#FFFFFF",
            },
            secondary: {
              main: colorTokens.orange[500],
            },
            error: {
              main: colorTokens.red[500],
            },
            background: {
              default: colorTokens.background.light,
              paper: "#FFFFFF",
            },
            text: {
              primary: colorTokens.grey[700],
              secondary: colorTokens.grey[600],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 48,
        fontWeight: 700,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 700,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "10px 24px",
          },
          containedPrimary: {
            boxShadow: `0 4px 15px -5px ${colorTokens.grey[500]}`,
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
