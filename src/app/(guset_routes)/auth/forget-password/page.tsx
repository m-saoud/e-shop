"use client";
import React from "react";
import FormContainer from "@/app/components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formikhelpr } from "@/app/utilites/formikhelpr";
import Link from "next/link";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgetPassword() {
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);
      try {
        const res = await fetch("/api/users/forget-password", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { message, error } = await res.json();
        if (res.ok) {
          toast.success(message);
        } else {
          toast.error(error || "An error occurred");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
      actions.setSubmitting(false);
    },
  });
  const errorsToRender: string[] = formikhelpr(
    errors as any,
    touched as any,
    values as any
  );

  type valueKeys = keyof typeof values;

  const { email } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <FormContainer title="Rsest Password" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Button
        type="submit"
        className="w-full bg-blue-600"
        disabled={isSubmitting}
        placeholder="send link"
      >
        Send Link
      </Button>
      <div className="flex items-center justify-between ">
        <Link href="/auth/signin">Sign in</Link>
        <Link href="/auth/signup">Sign up</Link>
      </div>
      <div className="">
        {errorsToRender.map((item) => {
          return (
            <div
              key={item}
              className="space-x-1 flex items-center text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{item}</p>
            </div>
          );
        })}
      </div>
    </FormContainer>
  );
}
