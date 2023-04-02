import { toast } from "react-toastify";

const INITIAL_STATE = {
  isLoading: false,
  isLogedIn: false,
  errorMsg: null,
};

const LoginReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "LOGIN_REQUEST":
    case "RESET_REQUEST":
      return {
        ...state,
        isLoading: true,
        isLogedIn: false,
      };

    case "LOGIN_REQUEST_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isLogedIn: true,
      };

    case "LOGOUT_REQUEST_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isLogedIn: false,
      };
    case "RESET_REQUEST":
      return {
        ...state,
      };

    case "LOGIN_REQUEST_FAILURE":
      if (action.payload?.status === 401) {
        toast.error(action.payload.data.message);
      } else if (action.payload?.status === 400) {
        toast.error(action.payload.data.message);
      } else {
        toast.error("Server Error");
      }
      return {
        ...state,
        isLoading: false,
        isLogedIn: false,
        errorMsg: action.payload,
      };

    default:
      return state;
  }
};

export default LoginReducer;
