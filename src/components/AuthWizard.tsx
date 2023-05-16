import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AuthWizard = () => {
  let supabase = useSupabaseClient();

  return (
    <div className="bg-base-300 p-4">
      <h3 className="text-center text-xl">Sign in to use Twotter</h3>
      <div className="flex justify-center">
        <div className="w-2/3">
          <Auth
            supabaseClient={supabase}
            onlyThirdPartyProviders={true}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "github"]}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthWizard;
