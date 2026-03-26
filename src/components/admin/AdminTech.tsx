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
import { ImageUploadField } from "./ImageUploadField";
import type { TTechnology } from "../../types";

export function AdminTech() {
  const [list, setList] = useState<(TTechnology & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, COLLECTIONS.tech), orderBy("name"))
      );
      setList(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as TTechnology) }))
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

  const fillForm = (t: TTechnology & { id: string }) => {
    setEditingId(t.id);
    setName(t.name);
    setTitle(t.title ?? t.name);
    setIcon(t.icon || "");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setTitle("");
    setIcon("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name,
        title: title.trim() || name,
        icon: icon || "/tech/html.png",
        ...(editingId ? {} : { createdAt: serverTimestamp() }),
      };
      if (editingId) {
        await updateDoc(doc(db, COLLECTIONS.tech, editingId), data);
      } else {
        await addDoc(collection(db, COLLECTIONS.tech), data);
      }
      resetForm();
      void load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette technologie ?")) return;
    await deleteDoc(doc(db, COLLECTIONS.tech, id));
    void load();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">
        {editingId ? "Modifier la technologie" : "Ajouter une technologie"}
      </h2>
      <p className="text-xs text-slate-400">
        Nom (identifiant), titre sous le logo, logo. Le logo s’affichera sur le site.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <input
          placeholder="Nom (ex: HTML 5, React JS)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          required
        />
        <input
          placeholder="Titre affiché sous le logo (ex: HTML 5, React JS)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
        />
        <ImageUploadField folder="tech" value={icon} onChange={setIcon} label="Logo (upload Firebase Storage)" />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#915EFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300">
              Annuler
            </button>
          )}
        </div>
      </form>
      <h2 className="text-md font-semibold text-white">Technologies</h2>
      {loading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <ul className="space-y-2">
          {list.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2"
            >
              <span className="text-sm text-white">{t.title ?? t.name}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => fillForm(t)} className="text-xs text-slate-300 hover:text-white">
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
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
