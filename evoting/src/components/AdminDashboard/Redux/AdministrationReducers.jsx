import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const INITIAL_STATE = {
  allUser: [],
  isLoading: false,
};

const AdminReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "FETCH_ALL_USER":
    case "EDIT_USER":
      return {
        ...state,
        isLoading: true,
      };
    case "ADD_NEW_USER":
      return {
        ...state,
        isLoading: true,
        userAddedStatus: false,
      };

    case "FETCH_USER_DATA_SUCCESS":
      return {
        ...state,
        allUser: action.payload,
        isLoading: false,
      };
    case "ADD_NEW_USER_SUCCESS":
      toast.success("User Added Successfully!");
      return {
        ...state,
        userAddedStatus: true,
        isLoading: false,
      };
    case "DELETE_USER_SUCCESS":
      toast.success("User deleted successfully");
      return {
        ...state,
      };
    case "EDIT_USER_SUCCESS":
      toast.success("User Updated Successfully");
      return {
        ...state,
      };

    case "FETCH_USER_DATA_FAIL":
    case "ADD_NEW_USER_FAIL":
    case "EDIT_USER_FAIL":
      if (action.payload.status === 400 || action.payload.status === 401) {
        toast.error(action.payload.data.message);
      } else {
        toast.error("Server Error. Try Again");
      }
      return {
        ...state,
        isLoading: false,
        userAddedStatus: false,
      };
    case "DELETE_USER_FAIL":
      if (action.payload.status === 400 || action.payload.status === 401) {
        toast.error(action.payload.message);
      } else {
        toast.error("Server Error. Try Again");
      }
      return {
        ...state,
        isLoading: false,
        userAddedStatus: false,
      };
    default:
      return state;
  }
};
export default AdminReducer;
