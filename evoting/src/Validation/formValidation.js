import { object, string, ref, mixed } from "yup";
const today = new Date();
today.setHours(0, 0, 0, 0);

export const RegisterSchema = object({
  firstName: string()
    .required("First Name is Required.")
    .min(1, "First Name is Too Short."),
  lastName: string()
    .required("Last Name is Required.")
    .min(1, "Last Name is Too Short."),
  email: string().email().required("Email is Required."),
  permanentAddress: string().required("Permanent Address is Required."),
  temporaryAddress: string().required("Temporary Address is Required."),
  password: string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number."),
  confirmPassword: string()
    .required("Confirm Password is required")
    .oneOf([ref("password"), null], "Confirm Password does not match"),
});

export const AddUserValidationSchema = object({
  firstName: string()
    .required("First Name is Required.")
    .min(1, "First Name is Too Short."),
  lastName: string()
    .required("Last Name is Required.")
    .min(1, "Last Name is Too Short."),
  email: string().email().required("Email is Required."),
  permanentAddress: string().required("Permanent Address is Required."),
  temporaryAddress: string().required("Temporary Address is Required."),
  password: string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number."),
});

export const EditUserValidationSchema = object({
  firstName: string()
    .required("First Name is Required.")
    .min(1, "First Name is Too Short."),
  lastName: string()
    .required("Last Name is Required.")
    .min(1, "Last Name is Too Short."),
  email: string().email().required("Email is Required."),
  permanentAddress: string().required("Permanent Address is Required."),
  temporaryAddress: string().required("Temporary Address is Required."),
});

export const LoginSchema = object({
  email: string().email().required("Email is Required."),
  password: string().required("Password is required."),
});

export const ChangePasswordSchema = object({
  oldPassword: string().required("No password provided."),

  newPassword: string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number."),
});

export const ElectionAddSchema = object({
  electionName: string().required("Provide an election name."),
  electionStartDate: string()
    .required("Starting Date is required.")
    .test("after-today", "Start date must be today or later", function (value) {
      return new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0));
    })
    .test(
      "two-hours-gap",
      "Start time must be at least 2 hours from now",
      function (value) {
        const startDateTime = new Date(value);
        const today = new Date();
        const twoHoursFromNow = new Date(today.getTime() + 2 * 60 * 60 * 1000);
        const isToday =
          startDateTime.toLocaleDateString() === today.toLocaleDateString();
        return !isToday || startDateTime >= twoHoursFromNow;
      }
    ),
  electionEndDate: string()
    .required("Ending Date is required.")
    .test(
      "after-start-date",
      "End date must be after start date",
      function (value) {
        return new Date(value) > new Date(this.parent.electionStartDate);
      }
    ),
  organizationName: string().required("Organization Name is required."),
});

export const ElectionUpdateSchema = object({
  electionName: string().required("Provide an election name."),
  electionStartDate: string()
    .required("Starting Date is required.")
    .test("after-today", "Start date must be today or later", function (value) {
      return new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0));
    }),
  electionEndDate: string()
    .required("Ending Date is required.")
    .test(
      "after-start-date",
      "End date must be after start date",
      function (value) {
        return new Date(value) > new Date(this.parent.electionStartDate);
      }
    ),
  organizationName: string().required("Organization Name is required."),
});

export const PositionAddSchema = object({
  positionName: string().required("Provide a position name."),
});
export const CandidateAddSchema = object({
  candidateName: string().required("Provide a canidate name."),
  candidateAddress: string().required("Provide a candidate Address."),
  candidateEmail: string().email().required("Provide candidate email."),
  candidatePosition: string().required("Provide a position for the candidate."),
  candidateDescription: string().required(
    "Provide a description for the candidate."
  ),
});
export const ResetSchema = object({
  newPassword: string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number."),
  confirmPassword: string()
    .required("Confirm Password is required")
    .oneOf([ref("newPassword"), null], "Confirm Password does not match"),
});


export const VoterAddSchema = object({
  voterId: string().required("Voter Id is required"),
  voterName: string().required("Voter Name is required"),
  voterEmail: string().email().required("Email of the voter is required"),
});
export const ContactUsSchema = object({
  fullName: string().required("Full Name is required"),
  email: string().required("Email is required"),
  message: string().required("Write Something!"),
});