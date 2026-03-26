import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { COLLECTIONS } from "./firestore-collections";
import { ImageUploadField } from "./ImageUploadField";
import type { TExperience } from "../../types";

export function AdminExperience() {
  const [list, setList] = useState<(TExperience & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [siret, setSiret] = useState("");
  const [date, setDate] = useState("");
  const [pointsStr, setPointsStr] = useState("");
  const [icon, setIcon] = useState("");
  const [iconBg, setIconBg] = useState("#383E56");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, COLLECTIONS.experience), orderBy("date", "desc")));
      setList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as TExperience) })));
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const fillForm = (e: TExperience & { id: string }) => {
    setEditingId(e.id);
    setTitle(e.title);
    setCompanyName(e.companyName);
    setLocation(e.location ?? "");
    setSiret(e.siret ?? "");
    setDate(e.date);
    setPointsStr(e.points?.join("\n") || "");
    setIcon(e.icon || "");
    setIconBg(e.iconBg || "#383E56");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCompanyName("");
    setLocation("");
    setSiret("");
    setDate("");
    setPointsStr("");
    setIcon("");
    setIconBg("#383E56");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const points = pointsStr.split("\n").map((s) => s.trim()).filter(Boolean);
      const data = {
        title,
        companyName,
        location: location.trim() || undefined,
        siret: siret.replace(/\s/g, "").trim() || undefined,
        date,
        points,
        icon: icon || "/assets/meta.png",
        iconBg,
        ...(editingId ? {} : { createdAt: serverTimestamp() }),
      };
      if (editingId) {
        await updateDoc(doc(db, COLLECTIONS.experience, editingId), data);
      } else {
        await addDoc(collection(db, COLLECTIONS.experience), data);
      }
      resetForm();
      void load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette expérience ?")) return;
    await deleteDoc(doc(db, COLLECTIONS.experience, id));
    void load();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">
        {editingId ? "Modifier l'expérience" : "Ajouter une expérience"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" required />
        <input placeholder="Entreprise" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" required />
        <input placeholder="Lieu (ville, pays)" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
        <input placeholder="SIRET (14 chiffres, optionnel)" value={siret} onChange={(e) => setSiret(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" maxLength={17} />
        <input placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
        <ImageUploadField folder="experiences" value={icon} onChange={setIcon} label="Icône (upload Firebase Storage)" />
        <input placeholder="Couleur fond icône" value={iconBg} onChange={(e) => setIconBg(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
        <textarea placeholder="Points (un par ligne)" value={pointsStr} onChange={(e) => setPointsStr(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" rows={4} />
        <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-[#915EFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Ajouter"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300">Annuler</button>
        )}
      </div>
      </form>
      <h2 className="text-md font-semibold text-white">Expériences</h2>
      {loading ? <p className="text-slate-400">Chargement…</p> : (
        <ul className="space-y-2">
          {list.map((e) => (
            <li key={e.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2">
              <span className="text-sm text-white">{e.title} — {e.companyName}{e.location ? ` (${e.location})` : ""}{e.siret ? ` · SIRET ${e.siret}` : ""}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => fillForm(e)} className="text-xs text-slate-300 hover:text-white">Modifier</button>
                <button type="button" onClick={() => handleDelete(e.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
