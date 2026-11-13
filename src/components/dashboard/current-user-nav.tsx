import { requireUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { NavMain } from "./nav-main";

/** Server component: reads the user's access once and hands booleans to the client nav. */
export async function CurrentUserNav() {
  const user = await requireUser();
  return (
    <NavMain
      access={{
        posts: can(user, "posts"),
        media: can(user, "media"),
        sections: can(user, "sections"),
        users: can(user, "users"),
      }}
    />
  );
}
