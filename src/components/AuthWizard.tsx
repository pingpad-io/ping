import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AuthWizard = () => {
  let supabase = useSupabaseClient();

  return (
    <div className="rounded-3xl bg-base-300 px-4 py-2 w-fit">
      {/* <h3 className="text-center text-xl">Sign in to use Twotter</h3> */}
      <div className="">
        <Auth
          supabaseClient={supabase}
          onlyThirdPartyProviders={true}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github", "twitter"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default AuthWizard;
