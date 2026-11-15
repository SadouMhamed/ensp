import { getSection } from "@/server/queries/sections";
import { CeoMessageView } from "./ceo-message-view";

/**
 * 5. Mot du PDG. Contenu modifiable dans le tableau de bord
 * (Website sections → Home: Mot du PDG). `full` : message complet (page À propos).
 */
export async function CeoMessage({ full = false }: { full?: boolean }) {
  const { visible, content } = await getSection("home_ceo");
  if (!visible) return null;
  return <CeoMessageView ceo={content} full={full} />;
}
