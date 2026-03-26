import { useEffect, useState, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { COLLECTIONS, CV_DOC_ID } from "./firestore-collections";
import { uploadPortfolioImage } from "../../api/upload";

export function AdminCV() {
  const [currentLink, setCurrentLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.cv, CV_DOC_ID));
      if (snap.exists()) {
        const d = snap.data() as { lien?: string };
        setCurrentLink(typeof d.lien === "string" ? d.lien : "");
      } else {
        setCurrentLink("");
      }
    } catch {
      setCurrentLink("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Veuillez sélectionner un fichier PDF.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const url = await uploadPortfolioImage("cv", file);
      await setDoc(doc(db, COLLECTIONS.cv, CV_DOC_ID), { lien: url });
      setCurrentLink(url);
    } catch (err) {
      setError("Échec de l’upload ou de la mise à jour. Réessayez.");
    } finally {
      setSaving(false);
      e.target.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">CV (PDF)</h2>
      <p className="text-xs text-slate-400">
        Le lien du CV est lu depuis Firestore (collection <code className="rounded bg-slate-800 px-1">cv</code>, document <code className="rounded bg-slate-800 px-1">cv</code>, champ <code className="rounded bg-slate-800 px-1">lien</code>). Le bouton « Télécharger CV » sur le site utilise ce lien.
      </p>

      {loading ? (
        <p className="text-slate-400">Chargement…</p>
      ) : (
        <>
          {currentLink ? (
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-xs text-slate-400 mb-1">Lien actuel :</p>
              <a
                href={currentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#915EFF] break-all hover:underline"
              >
                {currentLink}
              </a>
              <p className="text-xs text-slate-500 mt-2">Un CV est déjà enregistré. Envoyez un nouveau PDF pour le remplacer.</p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Aucun CV enregistré. Uploadez un PDF ci-dessous.</p>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <label className="block text-sm font-medium text-white mb-2">Mettre à jour le CV (nouveau PDF)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={saving}
              className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#915EFF] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:cursor-pointer hover:file:bg-[#7c4ae0]"
            />
            {saving && <p className="mt-2 text-sm text-slate-400">Envoi en cours…</p>}
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        </>
      )}
    </section>
  );
}
