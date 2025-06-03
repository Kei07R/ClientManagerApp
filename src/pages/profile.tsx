import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Profile = () => {
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  return (
    <div>
      <h1>Welcome {id}</h1>
    </div>
  );
};

export default Profile;
