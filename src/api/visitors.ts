/// <reference path="../firebase.d.ts" />
import {
  doc,
  getDoc,
  runTransaction,
  onSnapshot,
  type Unsubscribe,
  type DocumentSnapshot,
  type Transaction,
} from "firebase/firestore";
import { db } from "../firebase";

const STATS_COLLECTION = "stats";
const VISITORS_DOC = "visitors";

const visitorsRef = () => doc(db, STATS_COLLECTION, VISITORS_DOC);

export function subscribeVisitorsCount(
  onCount: (count: number) => void
): Unsubscribe {
  const ref = visitorsRef();
  return onSnapshot(
    ref,
    (snap: DocumentSnapshot) => {
      const data = snap.data();
      const count = typeof data?.count === "number" ? data.count : 0;
      onCount(count);
    },
    () => onCount(0)
  );
}

const SESSION_KEY = "portfolio_visitor_counted";

/** Incrémente le compteur une fois par session. Retourne le nouveau total ou undefined si pas d’incrément. */
export async function incrementVisitorOnce(): Promise<number | undefined> {
  if (typeof window === "undefined") return undefined;
  if (sessionStorage.getItem(SESSION_KEY)) return undefined;

  sessionStorage.setItem(SESSION_KEY, "1");

  const ref = visitorsRef();

  try {
    await runTransaction(db, async (tx: Transaction) => {
      const snap = await tx.get(ref);
      const data = snap.data();
      const current: number =
        typeof data?.count === "number" ? (data.count as number) : 0;
      tx.set(ref, { count: current + 1 });
    });
    const snap = await getDoc(ref);
    const data = snap.data();
    return typeof data?.count === "number" ? (data.count as number) : 1;
  } catch {
    return undefined;
  }
}
