import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import ProfileSettings from "~/components/ProfileSettingsView";
import { SignedIn, SignedOut } from "~/components/Signed";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const SettingsPage = ({ id }: { id: string }) => {
  const supabase = useSupabaseClient();
  const { setTheme } = useTheme();
  const { data: profile } = api.profiles.get.useQuery({ id });
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.reload();
  };

  if (!id) {
    return (
      <PageLayout>
        <div className="m-4 p-8">
          <Auth
            supabaseClient={supabase}
            onlyThirdPartyProviders={true}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "github"]}
            theme="light"
          />
        </div>
      </PageLayout>
    );
  }

  if (!profile) return null;

  const themeButtons = ["light", "dark"].map((theme) => (
    <Button
      data-theme={theme}
      type="submit"
      key={theme}
      variant={theme === "dark" ? "secondary" : "outline"}
      className=""
      onClick={() => setTheme(theme)}
    >
      {theme}
    </Button>
  ));

  return (
    <PageLayout>
      <div className="p-4 space-y-4">
        <SignedIn>
          <ProfileSettings profile={profile} />

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="flex gap-2">{themeButtons}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="destructive" onClick={() => signOut()}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </SignedIn>

        <SignedOut>
          <h1 className="m-8 flex flex-row items-center justify-center p-8 text-xl">Sign in to view this page</h1>
        </SignedOut>
      </div>
    </PageLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
) => {
  const ssg = getSSGHelper();
  const supabase = createServerSupabaseClient(context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await ssg.profiles.get.prefetch({
    id: user.id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: user.id,
    },
  };
};

export default SettingsPage;
