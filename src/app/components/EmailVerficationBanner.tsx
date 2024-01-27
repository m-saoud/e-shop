// "use client";
// import React, { useState } from "react";
// import useAuth from "../hooks/useAuth";
// import { toast } from "react-toastify";

// import axios from "axios";
// export default function EmailVerficationBanner() {
//   const [submitting, setsubmiting] = useState(false);
//   const { profile } = useAuth();
//   if (profile?.verified) {
//     return null;
//   }
//   const applyForVerification = async () => {
//     if (!profile) return;
//     setsubmiting(true);
//     const res = await axios.get("/api/users/verify?userId=" + profile?.id, {
//       method: "GET",
//     });
//     const { message, error } = await res.data;
//     if (res.status !== 200 || error) return toast.error(error);

//     if (res) return toast.success(message);
//     setsubmiting(false);
//   };

//   return (
//     <div className=" p-2 text-center bg-blue-gray-50">
//       <span>It looks like have not verified your email</span> {""}
//       <button
//         disabled={submitting}
//         onClick={applyForVerification}
//         className=" font-semibold underline"
//       >
//         {submitting ? "Genereting link..." : "Get verification link"}
//       </button>
//     </div>
//   );
// }
"use client";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

import axios from "axios";

export default function EmailVerificationBanner() {
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useAuth();

  if (profile?.verified) {
    return null;
  }

  const applyForVerification = async () => {
    if (!profile) return;
    setSubmitting(true);

    try {
      const res = await axios.get(`/api/users/verify?userId=${profile?.id}`);
      const { message, error } = res.data;

      if (res.status !== 200 || error) {
        throw new Error(error);
      }

      toast.success(message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          // Network error
          toast.error("Network error. Please check your internet connection.");
        } else {
          // HTTP response error
          const { status, data } = error.response;
          toast.error(`HTTP error ${status}: ${data.error}`);
        }
      } else {
        // Handle other types of errors
        toast.error;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 text-center bg-blue-gray-50">
      <span>It looks like you have not verified your email</span>{" "}
      <button
        disabled={submitting}
        onClick={applyForVerification}
        className="font-semibold underline"
      >
        {submitting ? "Generating link..." : "Get verification link"}
      </button>
    </div>
  );
}
