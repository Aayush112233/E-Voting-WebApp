import { API } from "../baseUrlProvider";

export const StepperService = (formData = {}) => {
  return (dispatch) => {
    dispatch({
      type: "SUBMIT_STEP_DATA",
      payload: formData,
    });
  };
};

export const PositionServices = (formData = []) => {
  return (dispatch) => {
    dispatch({
      type: "SUBMIT_STEP_POSITION",
      payload: formData,
    });
  };
};

export const CandidateServices = (formData = []) => {
  return (dispatch) => {
    dispatch({
      type: "SUBMIT_STEP_CANDIDATE",
      payload: formData,
    }); 
  };
};
export const DefineVoterServices = (formData = []) => {
  return (dispatch) => {
    dispatch({
      type: "SUBMIT_VOTERS",
      payload: formData,
    });
  };
};

export const SubmitServices = (formData = []) => {
  return (dispatch) => {   
    dispatch({
      type: "REQUEST_ELECTION_SUBMIT",
    });
    
    API.post("/election/create", formData)
      .then((response) => {
        if (response.status === 200) {
          dispatch({
            type: "SUBMIT_DATA"
          });
        } else {
          // TODO
        }
      })
      .catch((error) => {
        // dispatch({
        //   type: "CHANGE_PASSWORD_FAILURE",
        //   payload: error.response,
        // });
      });
    
    
  };
};
