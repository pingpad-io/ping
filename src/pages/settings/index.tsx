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
import { PageLayout } from "~/components/Layout";
import ProfileSettingsView from "~/components/ProfileSettingsView";
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

  await ssg.profile.getProfileById.prefetch({
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
        <div className="p-8 m-4 card">
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

  const { data: profile } = api.profile.getProfileById.useQuery({
    userId: id,
  });

  if (!profile) return null;

  return (
    <PageLayout>
        <ProfileSettingsView profile={profile} />
    </PageLayout>
  );
};

export default SettingsPage;
