// import type { Flair, Profile } from "@prisma/client";
import { Flair } from "@prisma/client";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { RouterOutputs } from "~/utils/api";
import { FlairView } from "./FlairView";

type Profile = RouterOutputs["profiles"]["getProfileById"];

export default function ProfileSettingsView({ profile }: { profile: Profile }) {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [full_name, setFullName] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [flairs, setFlairs] = useState<Flair[] | null>(null);

  useEffect(() => {
    getProfile();
  }, [profile]);

  async function getProfile() {
    try {
      setLoading(true);
      if (profile) {
        setUsername(profile.username);
        setFullName(profile.full_name);
        setAvatarUrl(profile.avatar_url);
        setFlairs(profile.flairs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        full_name,
        avatar_url,
        flairs,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const flairList = flairs?.map((flair) => {
    return <FlairView flair={flair} key={flair.id} size="md" />;
  });

  return (
    <>
      <div className="text-md form-control card m-4 gap-2 rounded-3xl border-2 border-base-300 p-8">
        <h2 className="text-xl">Account Settings</h2>
        <div>
          <label className="label inline-block" htmlFor="email">
            Email:
          </label>
          <input
            className="input-bordered input input-sm"
            id="email"
            type="text"
            value={user?.email}
            disabled
          />
        </div>
        <div>
          <label className="label inline-block" htmlFor="name">
            Full Name:
          </label>
          <input
            className="input-bordered input input-sm"
            id="name"
            type="text"
            value={full_name ?? ""}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="label inline-block" htmlFor="username">
            Username:
          </label>
          <div className="inline-block">
            <label className="input-group">
              <span className="px-2">@</span>
              <input
                className="input-bordered input input-sm"
                id="username"
                type="text"
                value={username ?? ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label className="label inline-block" htmlFor="username">
              Flairs:
            </label>
            <div className="inline-block">{flairList}</div>
          </div>
        </div>

        <div>
          <button
            className="btn-outline btn-primary btn-wide btn mt-4"
            onClick={() => updateProfile()}
            disabled={false}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </>
  );
}
