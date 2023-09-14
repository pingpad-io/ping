import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { OtterIcon } from "./Icons";

const LoginWizard = () => {
  const supabase = useSupabaseClient();

  return (
    <div className="w-72 bg-base-100 px-4 pb-2 pt-4">
      <div className="flex flex-row items-center justify-center gap-2 text-lg font-semibold">
        <h3>Sign in to </h3>
        <OtterIcon size={25} />
        <h3>Ping</h3>
      </div>
      <div className="">
        <Auth
          supabaseClient={supabase}
          onlyThirdPartyProviders={true}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]}
          theme="light"
          redirectTo={getURL()}
        />
      </div>
    </div>
  );
};

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";

  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;

  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
};

export default LoginWizard;
