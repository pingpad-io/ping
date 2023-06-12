import { useState } from "react";
import { toast } from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";
import { FlairView } from "./FlairView";

type Profile = RouterOutputs["profiles"]["getProfileById"];

export default function ProfileSettingsView({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [full_name, setFullName] = useState(profile.full_name);
  const [avatar_url, setAvatarUrl] = useState(profile.avatar_url);
  const [flairs, setFlairs] = useState(profile.flairs);

  const { mutate: updateProfile } = api.profiles.update.useMutation({
    onSuccess() {
      toast.success("Profile updated!");
      setLoading(false);
    },
    onError(error) {
      toast.error("Error updating the data! " + error.message);
    },
  });

  const commitUpdates = () => {
    const updates = {
      id: profile.id,
      username,
      full_name,
      avatar_url,
      updated_at: new Date(),
      created_at: profile?.created_at ?? null,
    };

    updateProfile({ updates });
  };

  const flairList = flairs?.map((flair) => {
    return <FlairView flair={flair} key={flair.id} size="md" />;
  });

  return (
    <>
      <div className="text-md form-control card m-4 gap-2 rounded-3xl border-2 border-base-300 p-8">
        <h2 className="text-xl">Account Settings</h2>
        <div className="w-full">
          <label className="label inline-block" htmlFor="id">
            Your ID:
          </label>
          <input className="input-bordered input input-sm w-[295px]" id="id" type="text" value={profile.id} disabled />
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
            <div className="inline-block">
              {flairList.length > 0 ? flairList : <div className="badge-ghost badge-outline badge">None</div>}
            </div>
          </div>
        </div>

        <div>
          <button className="btn-outline btn-primary btn-wide btn mt-4" onClick={() => commitUpdates()} disabled={false}>
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </>
  );
}
