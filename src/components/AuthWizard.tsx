import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { OtterIcon } from "./Icons";

const AuthWizard = () => {
  let supabase = useSupabaseClient();

  return (
    <div className="w-72 bg-base-100 px-4 pt-4 pb-2">
      <div className="text-lg flex flex-row items-center justify-center gap-2 font-semibold">
        <h3>Sign in to </h3>
        <OtterIcon size={25} />
        <h3>Twotter</h3>
      </div>
      <div className="">
        <Auth
          supabaseClient={supabase}
          onlyThirdPartyProviders={true}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default AuthWizard;
