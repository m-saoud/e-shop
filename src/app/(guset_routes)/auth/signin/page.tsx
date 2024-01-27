"use client";
// Import necessary modules and components
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import AuthFormContainer from "@/app/components/AuthFormContainer";
import React from "react";
import Link from "next/link";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { redirect, useRouter } from "next/navigation";

// Define validation schema
const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

// Component function
export default function SignIn() {
  const router = useRouter();

  // Formik hook to handle form state and validation
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, action) => {
      try {
        action.setSubmitting(true);

        // Validate form fields using Yup
        await validationSchema.validate(values, { abortEarly: false });

        // Sign in using next-auth

        const signInResponse = await signIn("credentials", {
          ...values,
        });

        if (
          signInResponse?.error == "CredentialsSignin" &&
          signInResponse?.status == 404
        ) {
          toast.error("Email OR password mismatch");
          router.push("/auth/signup");
        }

        // Handle other errors or successful sign-in
        if (signInResponse) {
          toast.success("successful to signin");
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        toast.error("Error during sign-in");
      } finally {
        action.setSubmitting(false);
      }
    },
  });

  // Helper function to check if there are errors for a field
  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  // Render the component
  return (
    <AuthFormContainer title="Sign In" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Input
        name="password"
        label="Password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        type="password"
        crossOrigin={undefined}
      />
      <Button
        type="submit"
        className="w-full bg-blue-600"
        placeholder="Sign in"
        disabled={
          isSubmitting || Object.values(errors).some((error) => error !== "")
        }
      >
        Sign in
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">Sign up</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>

      <div className="">
        {Object.values(errors).map((item, _index) => (
          <div key={item} className="space-x-1 flex items-center text-red-500">
            <XMarkIcon className="w-4 h-4" />
            {item && <p className="text-xs">{item}</p>}
          </div>
        ))}
      </div>
      <p id="error-message-container" style={{ display: "none" }}>
        Error messages will be inserted here
      </p>
    </AuthFormContainer>
  );
}
