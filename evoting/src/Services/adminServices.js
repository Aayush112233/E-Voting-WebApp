import { API } from "../baseUrlProvider";
import { fetchUserListService } from "./authServices";

export const fetchAllUser = () => {
  return (dispatch) => {
    dispatch({
      type: "FETCH_ALL_USER",
    });

    API.get("/user/getAll").then((response) => {
      if (response.status === 200) {
        dispatch({ type: "FETCH_USER_DATA_SUCCESS", payload: response.data });
      } else {
        dispatch({ type: "FETCH_USER_DATA_FAIL", payload: response.data });
      }
    });
  };
};
export const AddNewUser = (formData = {}) => {
  return (dispatch) => {
    dispatch({
      type: "ADD_NEW_USER",
    });

    API.post("/user/register", formData).then((response) => {
      if (response.status === 200) {
        dispatch({ type: "ADD_NEW_USER_SUCCESS", payload: response.data });
      } 
    })
    .catch((err)=>{
      dispatch({ type: "ADD_NEW_USER_FAIL", payload: err.response });

    })
    ;
  };
};

export const DeleteUser = (id) => {
  return (dispatch) => {
    API.delete(`/user/delete/${id}`).then((response) => {
      if (response.status === 200) {
        dispatch({ type: "DELETE_USER_SUCCESS", payload: response.data });
        dispatch(fetchAllUser());
      } else {
        dispatch({ type: "DELETE_USER_FAIL", payload: response.data });
      }
    });
  };
};

export const EditUserDetails = (id, formData = {}) => {
  return (dispatch) => {
    dispatch({
      type: "EDIT_USER",
    });

    API.put(`/user/update/${id}`, formData).then((response) => {
      if (response.status === 200) {
        dispatch({ type: "EDIT_USER_SUCCESS", payload: response.data });
        dispatch(fetchAllUser());
      } else {
      }
    })
    .catch((error)=>{
      dispatch({ type: "EDIT_USER_FAIL", payload: error.response.data });
    })
  };
};
export const SaveUserDetails = (id, formData = {}) => {
  return (dispatch) => {
    dispatch({
      type: "EDIT_USER",
    });

    API.put(`/user/update/${id}`, formData).then((response) => {
      if (response.status === 200) {
        dispatch({ type: "EDIT_USER_SUCCESS", payload: response.data });
        dispatch(fetchUserListService());
      } else {
      }
    })
    .catch((error)=>{
      dispatch({ type: "EDIT_USER_FAIL", payload: error.response.data });
    })
  };
};
