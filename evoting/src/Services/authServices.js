import { API } from "../baseUrlProvider";
import { authenticateAdmin, removeCookies } from "../config/storageUtil";

export const fetchUserListService = (formData = {}) => {
  return (dispatch) => {
    dispatch({
      type: "USER_INFO_REQUEST",
    });

    API.get("/user/loggedInInfo")
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: "USER_INFO_SUCCESS", payload: response.data });
        } else {
          // TODO
        }
      })
      .catch((error) => {
        dispatch({
          type: "LOGIN_INFO_FAILURE",
          payload: error.response.data,
        });
      });
  };
};

export const loginService = (formData = {}) => {
  return async (dispatch) => {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    API.post("/user/login", formData)
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: "LOGIN_REQUEST_SUCCESS", payload: response });
          authenticateAdmin(response);
          dispatch(fetchUserListService());
        } else {
          // TODO
        }
      })
      .catch((error) => {
        dispatch({
          type: "LOGIN_REQUEST_FAILURE",
          payload: error.response,
        });
      });
  };
};
export const loginOutService = () => {
  return async (dispatch) => {
    removeCookies("token");
    dispatch({
      type: "LOGOUT_REQUEST_SUCCESS",
    });
  };
};
export const ChangeUserPassword = (id, formData = {}) => {
  return async (dispatch) => {
    dispatch({
      type: "CHANGE_PASSWORD_REQUEST",
    });

    API.post("/user/changePassword/" + id, formData)
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: "CHANGE_PASSWORD_SUCCESS", payload: response });
        } else {
          // TODO
        }
      })
      .catch((error) => {
        dispatch({
          type: "CHANGE_PASSWORD_FAILURE",
          payload: error.response,
        });
      });
  };
};
