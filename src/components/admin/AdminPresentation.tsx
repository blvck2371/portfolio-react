import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { COLLECTIONS, CONFIG_DOCS } from "./firestore-collections";
import { config } from "../../constants/config";

type PresentationData = {
  p: string;
  h2: string;
  content: string;
};

const defaultPresentation: PresentationData = {
  p: config.sections.about.p,
  h2: config.sections.about.h2,
  content: config.sections.about.content ?? "",
};

export function AdminPresentation() {
  const [p, setP] = useState("");
  const [h2, setH2] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ref = doc(db, COLLECTIONS.config, CONFIG_DOCS.presentation);

  useEffect(() => {
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data() as PresentationData;
          setP(d.p ?? defaultPresentation.p);
          setH2(d.h2 ?? defaultPresentation.h2);
          setContent(d.content ?? defaultPresentation.content);
        } else {
          setP(defaultPresentation.p);
          setH2(defaultPresentation.h2);
          setContent(defaultPresentation.content);
        }
      })
      .catch(() => {
        setP(defaultPresentation.p);
        setH2(defaultPresentation.h2);
        setContent(defaultPresentation.content);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(ref, { p, h2, content });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Chargement…</p>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-md font-semibold text-white">Section Présentation (À propos)</h2>
      <p className="text-xs text-slate-400">
        Ce texte est affiché sur la page d’accueil dans la section « À propos ». Les données sont enregistrées dans Firestore.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <div>
          <label className="block text-xs font-medium text-slate-300">Sous-titre (p)</label>
          <input
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="Ex: À propos"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Titre (h2)</label>
          <input
            value={h2}
            onChange={(e) => setH2(e.target.value)}
            placeholder="Ex: Présentation."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Contenu (paragraphe)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Texte de présentation…"
            rows={8}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#915EFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer la présentation"}
        </button>
      </form>
    </section>
  );
}
