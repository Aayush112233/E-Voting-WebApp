import React from "react";

export const useDarkTheme = ({dark}) =>
  useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
        },
      }),
    [dark]
  );
