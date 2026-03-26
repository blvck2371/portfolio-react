import { useEffect, useRef, useState } from "react";
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
import { uploadCertificationPdf } from "../../api/upload";
import type { TCertification, TCertificationStatus } from "../../types";

const STATUS_OPTIONS: TCertificationStatus[] = ["à faire", "en cours", "terminé"];

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
];

function parseTags(s: string): { name: string; color: string }[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((name, i) => ({
      name,
      color: TAG_COLORS[i % TAG_COLORS.length],
    }));
}

export function AdminCertifications() {
  const [list, setList] = useState<(TCertification & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<TCertificationStatus>("à faire");
  const [tagsStr, setTagsStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, COLLECTIONS.certifications), orderBy("date", "desc"))
      );
      setList(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as TCertification) }))
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

  const fillForm = (c: TCertification & { id: string }) => {
    setEditingId(c.id);
    setName(c.name);
    setIssuer(c.issuer);
    setDate(c.date || "");
    setUrl(c.url || "");
    setPdfUrl(c.pdfUrl || "");
    setImage(c.image || "");
    setStatus(c.status ?? "à faire");
    setTagsStr(c.tags?.map((t) => t.name).join(", ") || "");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setIssuer("");
    setDate("");
    setUrl("");
    setPdfUrl("");
    setImage("");
    setStatus("à faire");
    setTagsStr("");
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("pdf")) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }
    setPdfUploading(true);
    try {
      const downloadUrl = await uploadCertificationPdf(file);
      setPdfUrl(downloadUrl);
    } catch {
      alert("Échec de l'upload du PDF. Vérifiez les règles Firebase Storage.");
    } finally {
      setPdfUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = parseTags(tagsStr);
      if (editingId) {
        const safe = (x: unknown) => (typeof x === "string" ? x.trim() : "");
        const data: Record<string, unknown> = { name, issuer, date, status };
        const su = safe(url);
        const sp = safe(pdfUrl);
        const si = safe(image);
        if (su) data.url = su;
        if (sp) data.pdfUrl = sp;
        if (si) data.image = si;
        if (tags.length > 0) data.tags = tags;
        await updateDoc(doc(db, COLLECTIONS.certifications, editingId), data);
      } else {
        const data: Record<string, unknown> = {
          name,
          issuer,
          date,
          status,
          createdAt: serverTimestamp(),
        };
        if ((url ?? "").trim()) data.url = (url ?? "").trim();
        if ((pdfUrl ?? "").trim()) data.pdfUrl = (pdfUrl ?? "").trim();
        if ((image ?? "").trim()) data.image = (image ?? "").trim();
        if (tags.length > 0) data.tags = tags;
        await addDoc(collection(db, COLLECTIONS.certifications), data);
      }
      resetForm();
      void load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette certification ?")) return;
    await deleteDoc(doc(db, COLLECTIONS.certifications, id));
    void load();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">
        {editingId ? "Modifier la certification" : "Ajouter une certification"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <input
          placeholder="Nom de la certification"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          required
        />
        <input
          placeholder="Organisme (ex: Google, AWS)"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          required
        />
        <input
          placeholder="Date (ex: 2024)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TCertificationStatus)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Lien du site (optionnel si tu mets un PDF)</label>
          <input
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Fichier PDF (optionnel si tu mets un lien)</label>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pdfUploading}
              onClick={() => pdfInputRef.current?.click()}
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-[#915EFF] hover:text-white disabled:opacity-50"
            >
              {pdfUploading ? "Upload…" : pdfUrl ? "Remplacer le PDF" : "Choisir un PDF"}
            </button>
            {pdfUrl && (
              <>
                <span className="text-xs text-emerald-400">PDF enregistré</span>
                <button
                  type="button"
                  onClick={() => setPdfUrl("")}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>

        <ImageUploadField
          folder="certifications"
          value={image}
          onChange={setImage}
          label="Image / badge (pleine largeur sur la carte, optionnel)"
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Tags (séparés par des virgules, comme les projets)</label>
          <input
            placeholder="React, TypeScript, Dyma"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
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
      <h2 className="text-md font-semibold text-white">Certifications existantes</h2>
      {loading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <ul className="space-y-2">
          {list.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2"
            >
              <span className="text-sm text-white">
                {c.name} — {c.issuer}
                {c.status && (
                  <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                    {c.status}
                  </span>
                )}
                {c.pdfUrl && (
                  <span className="ml-2 rounded bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-300">
                    PDF
                  </span>
                )}
                {c.url && !c.pdfUrl && (
                  <span className="ml-2 rounded bg-slate-600 px-2 py-0.5 text-xs text-slate-300">
                    Lien
                  </span>
                )}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillForm(c)}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
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
