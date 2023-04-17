import * as Yup from "yup";
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const SignupSchema = Yup.object().shape({
  Firstname: Yup.string()
    .min(2, "Firstname Too Short!")
    .max(15, "Firstname Too Long!")
    .required("Firstname is Required"),
  Lastname: Yup.string()
    .min(2, "Lastname Too Short!")
    .max(15, "Lastname Too Long!")
    .required("Lastname is Required"),
  Email: Yup.string()
    .email("Please Enter a Valid Email")
    .required("Email is Required"),
  Password: Yup.string()
    .min(7)
    .matches(passwordRules, {
      message:
        "Please create a stronger password(1 upper case letter, 1 lower case letter, 1 numeric digit)",
    })
    .required("Password is required"),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("Password"), null], "Passwords must match")
    .required("Please Confirm your Password"),
});

export const LoginSchema = Yup.object().shape({
  Email: Yup.string()
    .email("Please Enter a Valid Email")
    .required("Email is Required"),
  Password: Yup.string()
    .min(7)
    .matches(passwordRules, {
      message:
        "Please enter a stronger password(1 upper case letter, 1 lower case letter, 1 numeric digit)",
    })
    .required("Password is required"),
});

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const updateSchema = Yup.object().shape({
  Firstname: Yup.string()
    .min(2, "Firstname Too Short!")
    .max(15, "Firstname Too Long!")
    .required("Firstname is Required"),
  Lastname: Yup.string()
    .min(2, "Lastname Too Short!")
    .max(15, "Lastname Too Long!")
    .required("Lastname is Required"),
  Email: Yup.string()
    .email("Please Enter a Valid Email")
    .required("Email is Required"),
  Address: Yup.string()
    .min(2, "Address Too Short!")
    .max(35, "Address Too Long!")
    .required("Address is Required"),
  Phone: Yup.string()
    .min(7, "Phone Number Too Short!")
    .max(15, "Phone Number Too Long")
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Please enter your valid phone number"),
});

export const updatePasswordSchema = Yup.object().shape({
  Password: Yup.string()
    .min(7)
    .matches(passwordRules, {
      message:
        "Please create a stronger password(1 upper case letter, 1 lower case letter, 1 numeric digit)",
    })
    .required("Password is required"),
  NewPassword: Yup.string()
    .min(7)
    .matches(passwordRules, {
      message:
        "Please create a stronger password(1 upper case letter, 1 lower case letter, 1 numeric digit)",
    })
    .required("New Password is required"),
  ConfirmNewPassword: Yup.string()
    .oneOf([Yup.ref("NewPassword"), null], "Passwords must match")
    .required("Please Confirm your Password"),
});

export const productSchema = Yup.object().shape({
  Name: Yup.string().required("Product Name is Required"),
  Location: Yup.string().required("Product Location is Required"),
  Weight: Yup.string().required("Product Weight is Required"),
  Quantity: Yup.string().required("Product Quantity is required"),
  Others: Yup.string(),
});

export const completeTradeSchema = Yup.object().shape({
  Price: Yup.number('"Please Enter a Valid Price"').required(
    "Price Paid is Required"
  ),
  Comment: Yup.string()
    .min(7)
    .required("Comment on this transaction is required"),
});

export const cancelTradeSchema = Yup.object().shape({
  Comment: Yup.string()
    .min(7)
    .required("Comment on this transaction is required"),
});
