import { User } from "@supabase/supabase-js";
import { supabase } from "../db";

export const getPublicUserData = async (user: User) => {
  let id = user.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  console.log(data);

  if (error) throw error;

  return {
    id: user.id,
    username: data?.username,
    profileImageUrl: data?.profileImageUrl,
  };
};
