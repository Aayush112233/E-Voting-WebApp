import { toast } from "react-toastify";

const INITIAL_STATE = {
  isLoading: false,
  electionbyId: [],
  electionbyJoin: [],
};

const JoinElectionReducer = (state, action) => {
  state = state || INITIAL_STATE;

  switch (action.type) {
    case "REQUEST_JOIN_ELECTION":
    case "REQUEST_FETCH_ELECTION_ID":
    case "REQUEST_ELECTION_BY_JOIN":
      return {
        ...state,
        isLoading: true,
      };
    case "SUCCESS_JOIN_ELECTION":
      return {
        ...state,
        isLoading: false,
      };
    case "SUCCESS_FETCH_ELECTION_ID":
      return {
        ...state,
        isLoading: false,
        electionbyId: action.payload,
      };
    case "SUCCESS_ELECTION_BY_JOIN":
      return {
        ...state,
        isLoading: false,
        electionbyJoin: action.payload,
      };
    case "FAILURE_FETCH_ELECTION_ID":
    case "FAILURE_ELECTION_BY_JOIN":
      toast(action.payload);
      return {
        ...state,
        isLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};
export default JoinElectionReducer;
