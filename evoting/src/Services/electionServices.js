import { API } from "../baseUrlProvider";

export const getAllElectionById = (id) => {
    return (dispatch) => {
      dispatch({
        type: "REQUEST_FETCH_ELECTION_ID",
      });
  
      API.get(`/election/getElectionByUser/${id}`)
        .then((response) => {
          if (response.status === 200) {
            dispatch({ type: "SUCCESS_FETCH_ELECTION_ID", payload: response.data });
          } else {
            // TODO
          }
        })
        .catch((error) => {
          dispatch({
            type: "FAILURE_FETCH_ELECTION_ID",
            payload: error.response.data,
          });
        });
    };
  };
export const getAllElectionByJoin = (id) => {
    return (dispatch) => {
      dispatch({
        type: "REQUEST_ELECTION_BY_JOIN",
      });
  
      API.get(`/election/getElectionByJoin/${id}`)
        .then((response) => {
          if (response.status === 200) {
            dispatch({ type: "SUCCESS_ELECTION_BY_JOIN", payload: response.data });
          } else {
            // TODO
          }
        })
        .catch((error) => {
          dispatch({
            type: "FAILURE_ELECTION_BY_JOIN",
            payload: error.response.data,
          });
        });
    };
  };

  