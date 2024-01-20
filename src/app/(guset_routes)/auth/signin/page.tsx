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
    setFieldError,
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
          redirect:false
        });

        // Handle other errors or successful sign-in
        if (signInResponse) {
          toast.success("success to sign-in");
          router.replace("/");
        }

        if (
          signInResponse?.error === "CredentialsSignin" &&
          signInResponse?.status === 404
        ) {

          setFieldError("email", "No user found. Please sign up.");
          toast.error("Email OR password mismatch");
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

/*
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthFormContainer from "@/app/components/AuthFormContainer";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import * as yup from "yup";
import { it } from "node:test";
import { signIn } from "next-auth/react";
import startDb from "@/app/lib/db";

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
      if (error instanceof yup.ValidationError) {
        setErrors({ ...errors, [field]: error.message });
      } else {
        console.error("Unexpected error type:", error);
        // Handle other types of errors if needed
      }
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
        const signInResponse = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        await startDb();
        if (signInResponse?.error) {
          // Handle authentication error
          setErrors({ ...errors, email: "Invalid email or password" });
        } else {
          // Successful sign-in, redirect or update UI as needed
          router.push("/");
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        toast.error("Error during form submission");
      }
    }
  };

  const errorsToRender = Object.values(errors).filter(Boolean);
  type valueKeys = keyof typeof values;

  const { email, password } = values;
  // const error = (name: valueKeys) => {
  //   return errors[name] && touched[name] ? true : false;
  // };
  const error = (name: keyof SignInValues) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Sign In" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={email}
        onChange={handleChange}
        onBlur={() => handleBlur("email")}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Input
        name="password"
        label="Password"
        value={password}
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
        {errorsToRender.map((item, error) => {
          return (
            <div
              key={item}
              className="space-x-1 flex items-center text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="text-xs">{item}</span>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
*/
