"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const PingAuth = () => {
  const supabase = useSupabaseClient();

  return (
    <div className="px-4 pb-2 pt-4 dark:drop-shadow-glow drop-shadow-lg">
      <Auth
        supabaseClient={supabase}
        onlyThirdPartyProviders={true}
        appearance={{ theme: ThemeSupa }}
        providers={["google", "github"]}
        theme="light"
        redirectTo={getBaseUrl()}
      />
    </div>
  );
};

const getBaseUrl = () => {
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

export default PingAuth;
