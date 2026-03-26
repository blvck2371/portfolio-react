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
import type { TProject } from "../../types";

export function AdminProjects() {
  const [list, setList] = useState<(TProject & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sourceCodeLink, setSourceCodeLink] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, COLLECTIONS.projects), orderBy("name"))
      );
      setList(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as TProject) }))
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

  const TAG_COLORS = [
    "blue-text-gradient",
    "green-text-gradient",
    "orange-text-gradient",
    "pink-text-gradient",
    "lime-text-gradient",
    "light-blue-text-gradient",
    "aqua-text-gradient",
    "violet-text-gradient",
    "cyan-text-gradient",
  ] as const;

  const parseTags = (s: string) =>
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name, i) => ({
        name,
        color: TAG_COLORS[i % TAG_COLORS.length],
      }));

  const fillForm = (p: TProject & { id: string }) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setImage(p.image || "");
    setSourceCodeLink(p.sourceCodeLink || "");
    setTagsStr(p.tags?.map((t) => t.name).join(", ") || "");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setSourceCodeLink("");
    setTagsStr("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name,
        description,
        image: image || "/assets/carrent.png",
        sourceCodeLink: sourceCodeLink || "#",
        tags: parseTags(tagsStr),
        ...(editingId ? {} : { createdAt: serverTimestamp() }),
      };
      if (editingId) {
        await updateDoc(doc(db, COLLECTIONS.projects, editingId), data);
      } else {
        await addDoc(collection(db, COLLECTIONS.projects), data);
      }
      resetForm();
      void load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await deleteDoc(doc(db, COLLECTIONS.projects, id));
    void load();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">
        {editingId ? "Modifier le projet" : "Ajouter un projet"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <input
          placeholder="Nom du projet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          rows={2}
        />
        <ImageUploadField folder="projects" value={image} onChange={setImage} label="Image du projet (upload Firebase Storage)" />
        <input
          placeholder="Lien code source"
          value={sourceCodeLink}
          onChange={(e) => setSourceCodeLink(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="Tags (séparés par des virgules)"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
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
      <h2 className="text-md font-semibold text-white">Projets existants</h2>
      {loading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <ul className="space-y-2">
          {list.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2"
            >
              <span className="text-sm text-white">{p.name}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillForm(p)}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
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
