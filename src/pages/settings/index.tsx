import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Profile from "~/components/Profile";
import { PageLayout } from "~/components/Layout";

const ProfilePage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <PageLayout>
      <div className="card bg-base-300 rounded-3xl m-20 p-8">
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

export default ProfilePage;
