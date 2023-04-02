import { toast } from "react-toastify";

const INITIAL_STATE = {
  userData: [],
  isLoading: false,
};

const UserInfoReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "USER_INFO_REQUEST":
      return {
        ...state,
        isLoading: true,
      };

    case "USER_INFO_SUCCESS":
      return {
        ...state,
        isLoading: false,
        userData: action.payload,
      };

    case "USER_INFO_FAILURE":
      if (action.payload?.status === 401) {
        toast.error(action.payload.message);
      } else if (action.payload?.status === 400) {
        toast.error(action.payload.data.message);
      } else {
        toast.error("Internal Server Error. Try Again later !!!");
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

export default UserInfoReducer;
