import { requireUser } from "@/lib/dal";
import { NavUser } from "./nav-user";

/** Server component: reads the session, hands a narrow user object to the client menu. */
export async function CurrentUserMenu() {
  const user = await requireUser();
  return <NavUser user={{ name: user.name, email: user.email, image: user.image, role: user.role }} />;
}
