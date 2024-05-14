import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

export const useNetworkSelectorStyles = createUseStyles((theme: Theme) => ({
  networkButton: {
    "&:hover": {
      backgroundColor: theme.palette.grey.main,
    },
    "&:hover p": {
      color: theme.palette.black,
    },
    "&:hover path": {
      fill: theme.palette.black,
    },
    alignItems: "center",
    background: theme.palette.primary.main,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "space-between",
    maxWidth: 200,
    padding: theme.spacing(1.25),
    transition: theme.hoverTransition,
  },
  networkButtonText: {
    display: "none",
    fontSize: "14px !important",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    [theme.breakpoints.upSm]: {
      display: "block",
    },
  },
}));
