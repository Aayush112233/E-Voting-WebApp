import { combineReducers } from "redux";
import LoginReducer from "../Reducers/loginReducer";
import AdminReducer from "../components/AdminDashboard/Redux/AdministrationReducers";
import UserInfoReducer from "../Reducers/UserInfoReducer";
import { DarkModeReducer } from "../components/AdminDashboard/Redux/DarkModeReducer";
import ProfileManagementReducer from "../components/AdminDashboard/Redux/ProfileManagementReducer";
import StepperReducer from "../components/UserDashboard/Redux/StepperReducer";
import JoinElectionReducer from "../components/UserDashboard/Redux/JoinElectionReducer";
export  const rootReducer = combineReducers({
    loginState: LoginReducer,
    userState : UserInfoReducer,
    adminState : AdminReducer,
    darkModeState : DarkModeReducer,
    changePasswordState : ProfileManagementReducer,
    stepperState : StepperReducer,
    joinElectionState:JoinElectionReducer
  });
