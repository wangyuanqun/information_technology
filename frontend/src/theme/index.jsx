import React from "react";
import { createTheme } from "@mui/material/styles";

export const CuTheme = createTheme({
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
            // Name of the slot
            containedPrimary: {
                backgroundColor: '#59A7FF',
                "&:hover": {
                    backgroundColor: "#4785CC",
                },
            }
          }
      },
      MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: "#59A7FF"
            }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "#e2e2e2",
            },
            "&.Mui-selected": {
              backgroundColor: "#59A7FF",
              "&:hover": {
                  backgroundColor: "#4785CC",
              },
            }
          }
        }
      }
    },
  });