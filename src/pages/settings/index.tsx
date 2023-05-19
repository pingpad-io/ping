import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { PageLayout } from "~/components/Layout";
import Profile from "~/components/Profile";

const SettingsPage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <PageLayout>
      <div className="card m-4 rounded-3xl bg-base-200 p-8">
        {!session ? (
          <Auth
            supabaseClient={supabase}
            onlyThirdPartyProviders={true}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "github"]}
            theme="dark"
          />
        ) : (
          <Profile session={session} />
        )}
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
