"use client";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect } from "react";
interface Props {
  searchParams: { userId: string; token: string };
}

export default function Verify(props: Props) {
  const { token, userId } = props.searchParams;
  const router = useRouter();

  //verfiy the token & user ID
  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const apiResposne = await res.json();
      const { error, message } = apiResposne as {
        error: string;
        message: string;
      };

      if (res.ok) {
        //succsess message
        console.log(message);
        router.replace("/");
      }
      if (!res.ok && error) {
        console.log(error);
      }
    });
  }, [router, token, userId]);

  if (!token && userId) return notFound();

  return (
    <div className=" text-center text-3xl animate-pulse opacity-10  p-6">
      Please Wait...
      <p>We Are Verifying Your Email</p>{" "}
    </div>
  );
}
