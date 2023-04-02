import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const INITIAL_STATE = {
  allUser: [],
  isLoading: false,
};
const ProfileManagementReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "CHANGE_PASSWORD_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "CHANGE_PASSWORD_SUCCESS":
      toast.success("Password Changed Successfully");
      return {
        ...state,
      };
    case "CHANGE_PASSWORD_FAILURE":
      if (action.payload?.status === 401) {
        toast.error(action.payload.message);
      } else if (action.payload?.status === 400) {
        toast.error(action.payload.data.message);
      } else {
        toast.error("Server Error. Please Try Again");
      }
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default ProfileManagementReducer;
