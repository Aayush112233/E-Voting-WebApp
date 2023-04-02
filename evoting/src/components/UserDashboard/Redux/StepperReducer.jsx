import { toast } from "react-toastify";

const INITIAL_STATE = {
  formData: {},
  positions: {},
  isSubmitted:false,
  isLoading:false,
};
 
const StepperReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "REQUEST_ELECTION_SUBMIT": 
    return{
      ...state,
      isSubmitted:false,
      isLoading:true
    }
    case "SUBMIT_STEP_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };

    case "SUBMIT_STEP_POSITION":
      return {
        ...state,
        formData: {
          ...state.formData,
          position:action.payload,
        },
      };
    case "SUBMIT_STEP_CANDIDATE":
      return {
        ...state,
        formData: {
          ...state.formData,
          candidate:action.payload,
        },
      };
    case "SUBMIT_VOTERS":
      return {
        ...state,
        formData: {
          ...state.formData,
          voters:action.payload,
        },
      };
    
    case "SUBMIT_DATA":
      return {
        ...state,
        isSubmitted:true,
        formData: {},
        isLoading:false
      };
    case "SUBMIT_DATA_FAILURE":
      if (action.payload?.status === 401) {
        toast.error(action.payload.data.message);
      } else if (action.payload?.status === 400) {
        toast.error(action.payload.data.message);
      } else {
        toast.error("Server Error");
      }
      return {
        ...state,
        isSubmitted:true,
        formData: {},
      };
    default:
      return {
        ...state,
      };
  }
};
export default StepperReducer;
