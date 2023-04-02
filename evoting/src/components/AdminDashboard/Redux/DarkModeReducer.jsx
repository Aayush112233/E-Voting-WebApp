import { toast } from "react-toastify";

const INITIAL_STATE = {
  darkTheme: true,
};

export const DarkModeReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return { ...state, darkTheme: !state.darkTheme };
    default:
      return state;
  }
};
