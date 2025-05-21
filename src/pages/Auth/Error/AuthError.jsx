import { useRouteError } from "react-router";

export default function AuthError() {
  const error = useRouteError();


  return (
    <div className="">
      <p>{error.statsText || error.message || "發生未知錯誤"}</p>
    </div>
  );
}
