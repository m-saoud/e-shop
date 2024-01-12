"use client";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { Button, Input } from "@material-tailwind/react";
// import AuthFormContainer from "@/app/components/AuthFormContainer";
// import { formikhelpr } from "@/app/utilites/formikhelpr";
// import React from "react";
// import { Formik, FormikHelpers, FormikValues, useFormik } from "formik";
// import Link from "next/link";
// import * as yup from "yup";
// import { SignInOptions, signIn } from "next-auth/react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// const validationSchema = yup.object().shape({
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .required("Password is required"),
// });

// export default function SignIn() {
//   const router = useRouter();
//   const {
//     values,
//     touched,
//     errors,
//     isValid,
//     isSubmitting,
//     handleSubmit,
//     handleBlur,
//     handleChange,
//   } = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema,
//     onSubmit: async (values: any, action: any) => {
//       action.setSubmitting(true)
//       const signRespose = await signIn("credentials", {
//         ...values,
//         redirect: false,
//       });
//       console.log("signRespos:", signRespose);

//       if (signRespose?.error === "CredentialsSignin") {
//         toast.error("Email/password not match!");
//       }
//       if (!signRespose?.error) {
//         router.refresh();
//       }
//     }
//   })

//   const errorsToRender = formikhelpr(touched, errors, values);

//   type valueKeys = keyof typeof values;

//   const { email, password } = values;
//   const error = (name: valueKeys) => {
//     return errors[name] && touched[name] ? true : false;
//   };

//   return (
//     <AuthFormContainer
//       title="Sign In"
//       onSubmit={handleSubmit}
//       handleSubmit={function (_event: React.FormEvent<HTMLFormElement>): void {
//         throw new Error("Function not implemented.");
//       }}
//     >
//       <Input
//         name="email"
//         label="Email"
//         value={email}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         error={error("email")}
//         crossOrigin={undefined}
//       />
//       <Input
//         name="password"
//         label="Password"
//         value={password}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         error={error("password")}
//         type="password"
//         crossOrigin={undefined}
//       />
//       <Button
//         type="submit"
//         className="w-full bg-blue-600"
//         placeholder=" Sign in"
//         disabled={isSubmitting}
//       >
//         Sign in
//       </Button>
//       <div className="flex items-center justify-between ">
//         <Link href="/auth/signup">Sign up</Link>
//         <Link href="/auth/forget-password">Forget password</Link>
//       </div>
//       <div className="">
//         {errorsToRender.map((item) => {
//           return (
//             <div
//               key={item}
//               className="space-x-1 flex items-center text-red-500"
//             >
//               <XMarkIcon className="w-4 h-4" />
//               <p className="text-xs">{item}</p>
//             </div>
//           );
//         })}
//       </div>
//     </AuthFormContainer>
//   );
// }
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthFormContainer from "@/app/components/AuthFormContainer";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import * as yup from "yup";
import Error from "next/error";

interface SignInValues {
  email: string;
  password: string;
}

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();

  const [values, setValues] = useState<SignInValues>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<keyof SignInValues, boolean>>({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState<Record<keyof SignInValues, string>>({
    email: "",
    password: "",
  });

  const handleBlur = (field: keyof SignInValues) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, values[field]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    validateField(name as keyof SignInValues, value);
  };

  const validateField = async (field: keyof SignInValues, value: string) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors({ ...errors, [field]: "" });
    } catch (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before attempting to sign in
    await Promise.all(
      (Object.keys(values) as Array<keyof SignInValues>).map((field) =>
        validateField(field, values[field])
      )
    );

    // Check if there are any errors
    if (Object.values(errors).every((error) => error === "")) {
      try {
        // Mocking a sign-in process
        // In a real-world scenario, you would send the data to your server for authentication
        // and handle the response accordingly.
        console.log("Signing in with:", values);
        // Simulating a successful sign-in
        router.push("/");
      } catch (error) {
        console.error("Error during form submission:", error);
        toast.error("Error during form submission");
      }
    }
  };

  const errorsToRender = Object.values(errors).filter(Boolean);
  type valueKeys = keyof typeof values;

  const { email, password } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };
  // const error = (name: keyof SignInValues) => {
  //   return errors[name] && touched[name];
  // };

  return (
    <AuthFormContainer title="Sign In" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        onBlur={() => handleBlur("email")}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Input
        name="password"
        label="Password"
        value={values.password}
        onChange={handleChange}
        onBlur={() => handleBlur("password")}
        error={error("password")}
        type="password"
        crossOrigin={undefined}
      />
      <Button
        type="submit"
        className="w-full bg-blue-600"
        placeholder="Sign in"
      >
        Sign in
      </Button>
      <div className="flex items-center justify-between ">
        <Link href="/auth/signup">Sign up</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>
      <div className="">
        {errorsToRender.map((error, index) => (
          <div key={index} className="space-x-1 flex items-center text-red-500">
            <XMarkIcon className="w-4 h-4" />
            <p className="text-xs">{error}</p>
          </div>
        ))}
      </div>
    </AuthFormContainer>
  );
}
