import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { COLLECTIONS } from "./firestore-collections";
import type { TService } from "../../types";

export function AdminServices() {
  const [list, setList] = useState<(TService & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, COLLECTIONS.services), orderBy("title"))
      );
      setList(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as TService) }))
      );
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const fillForm = (s: TService & { id: string }) => {
    setEditingId(s.id);
    setTitle(s.title);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        title,
        icon: "",
        ...(editingId ? {} : { createdAt: serverTimestamp() }),
      };
      if (editingId) {
        await updateDoc(doc(db, COLLECTIONS.services, editingId), data);
      } else {
        await addDoc(collection(db, COLLECTIONS.services), data);
      }
      resetForm();
      void load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette carte ?")) return;
    await deleteDoc(doc(db, COLLECTIONS.services, id));
    void load();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">
        {editingId ? "Modifier la carte" : "Ajouter une carte"}
      </h2>
      <p className="text-xs text-slate-400">
        Cartes sous la section Présentation. Saisis uniquement le titre (ex : Développeur web). Les icônes sont fixes (web, mobile, backend, creator) et affichées sans doublon côte à côte.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <input
          placeholder="Titre (ex: Développeur web)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#915EFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
      <h2 className="text-md font-semibold text-white">Cartes actuelles</h2>
      {loading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2"
            >
              <span className="text-sm text-white">{s.title}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillForm(s)}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
