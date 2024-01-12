"use client";
import React, { FC } from "react";
import AuthFormContainer from "@/app/components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { formikhelpr } from "@/app/utilites/formikhelpr";
import { toast } from "react-toastify";
import Link from "next/dist/client/link";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required!"),
  email: yup.string().email("Invalid Email").required("Email is required!"),
  password: yup
    .string()
    .min(8, "The password at least 8 letters")
    .required("password is required"),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.ok) {
          const { message } = (await res.json()) as { message: string };
          toast.success(message);
        }
        action.setSubmitting(false);
      });
    },
  });

  const formErrors: string[] = formikhelpr(touched, errors, values);
  const { name, password, email } = values;
  type valueKeys = keyof typeof values;

  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={name}
        error={error('name')}
      />
      <Input
        name="email"
        label="Email"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={email}
        error={error('email')}

      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        onBlur={handleBlur}
        crossOrigin={undefined}
        placeholder="current-password"
        value={password}
        error={error('password')}

        
      />
      <Button
        type="submit"
        className="w-full bg-blue-600"
        disabled={isSubmitting}
        placeholder="submit"
      >
        Sign up
      </Button>
      <div className="flex items-center justify-between ">
        <Link href="/auth/signin">Sign In</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
