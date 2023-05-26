import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { useTheme } from "next-themes";
import { Theme } from "react-daisyui";
import { BsCircleFill } from "react-icons/bs";
import { PageLayout } from "~/components/Layout";
import ProfileSettingsView from "~/components/ProfileSettingsView";
import { SignedIn, SignedOut } from "~/components/Signed";
import { themes } from "~/styles/themes";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

export const getServerSideProps = async (
  context:
    | GetServerSidePropsContext
    | { req: NextApiRequest; res: NextApiResponse }
) => {
  const ssg = getSSGHelper();
  let supabase = createServerSupabaseClient(context);

  let {
    data: { user },
  } = await supabase.auth.getUser();

  await ssg.profiles.getProfileById.prefetch({
    userId: user?.id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: user?.id ?? null,
    },
  };
};

const SettingsPage: NextPage<{ id: string }> = ({ id }) => {
  const supabase = useSupabaseClient();

  if (!id) {
    return (
      <PageLayout>
        <div className="card m-4 p-8">
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

  const { data: profile } = api.profiles.getProfileById.useQuery({
    userId: id,
  });

  if (!profile) return null;

  let { theme, setTheme } = useTheme();

  let cycleTheme = () => {
    let theme = themes[Math.floor(Math.random() * themes.length)] ?? "";
    setTheme(theme);
  };

  let themeButtons = themes.map((theme) => (
    <Theme
      dataTheme={theme}
      key={theme}
      className="inline-block w-min bg-transparent p-1"
    >
      <button
        key={theme}
        className="btn-outline btn-sm btn bg-base-100"
        onClick={() => setTheme(theme)}
      >
        <div className="flex flex-row gap-1">
          {theme}
          <BsCircleFill className="text-primary" />
          <BsCircleFill className="text-secondary" />
          <BsCircleFill className="text-accent" />
        </div>
      </button>
    </Theme>
  ));
  return (
    <PageLayout>
      <SignedIn>
        <ProfileSettingsView profile={profile} />

        <div className="card m-4 gap-4 rounded-3xl border-2 border-base-300 bg-base-200 p-8">
          <h2 className="text-xl ">Personalization</h2>
          <div className="flex flex-row flex-wrap">{themeButtons}</div>
        </div>

        <div className="form-control card m-4 gap-4 rounded-3xl border-2 border-error bg-base-300 p-8">
          <h2 className="text-xl text-error">Danger Zone</h2>
          <button
            className="btn-error btn-wide btn-sm btn mt-4"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </SignedIn>

      <SignedOut>
        <h1 className="m-8 flex flex-row items-center justify-center p-8 text-xl">
          Sign in to view this page
        </h1>
      </SignedOut>
    </PageLayout>
  );
};

export default SettingsPage;
