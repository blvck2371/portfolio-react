/**
 * Répartit les cartes services avec les icônes par défaut,
 * de façon aléatoire, sans deux mêmes icônes côte à côte (ligne ou colonne).
 */

const COLS = 4;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Retourne une liste de { title, icon } avec les icônes du pool,
 * ordre aléatoire et aucune même icône adjacente (horizontalement ou verticalement).
 */
export function buildServiceCardsWithIcons<T extends { title: string }>(
  services: T[],
  iconPool: string[]
): { title: string; icon: string }[] {
  if (services.length === 0 || iconPool.length === 0) return [];
  const shuffled = shuffle(services);
  const result: { title: string; icon: string }[] = [];
  for (let i = 0; i < shuffled.length; i++) {
    const left = i % COLS !== 0 ? result[i - 1]?.icon : null;
    const top = i >= COLS ? result[i - COLS]?.icon : null;
    const allowed = iconPool.filter((icon) => icon !== left && icon !== top);
    const icon = allowed.length > 0 ? allowed[Math.floor(Math.random() * allowed.length)] : iconPool[0];
    result.push({ title: shuffled[i].title, icon });
  }
  return result;
}
