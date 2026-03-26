import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { SectionWrapper } from "../../hoc";
import { Header } from "../atoms/Header";
import { config } from "../../constants/config";
import type { TCertification, TCertificationStatus } from "../../types";

const STATUS_STYLES: Record<TCertificationStatus, string> = {
  "à faire": "bg-slate-600/90 text-slate-200 border-slate-500",
  "en cours": "bg-amber-500/20 text-amber-300 border-amber-500/50",
  "terminé": "bg-emerald-600/20 text-emerald-300 border-emerald-500/50",
};

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

const COLLECTION = "portfolio_certifications";

export function CertificationsInner() {
  const [list, setList] = useState<TCertification[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, COLLECTION), orderBy("date", "desc"))
        );
        setList(snap.docs.map((d) => d.data() as TCertification));
      } catch {
        setList([]);
      }
    };
    void load();
  }, []);

  if (list.length === 0) return null;

  return (
    <>
      <Header useMotion={true} {...config.sections.certifications} />
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {list.map((c) => {
          const status = c.status ?? "à faire";
          const href = c.pdfUrl || c.url || "#";
          const hasLink = Boolean(c.pdfUrl || c.url);
          return (
            <a
              key={`${c.name}-${c.issuer}-${c.date}`}
              href={href}
              target={hasLink ? "_blank" : undefined}
              rel={hasLink ? "noopener noreferrer" : undefined}
              className="card-certification flex w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-slate-700 transition hover:border-[#915EFF]/50"
            >
              {/* Image pleine largeur en haut */}
              <div className="relative h-40 w-full shrink-0 bg-primary/80">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <span className="text-4xl opacity-50">📜</span>
                  </div>
                )}
                <span
                  className={`absolute right-2 top-2 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
                >
                  {status}
                </span>
              </div>
              {/* Contenu sous l'image */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                <p className="mt-1 text-sm text-secondary">{c.issuer}</p>
                <p className="mt-1 text-xs text-slate-500">{c.date}</p>
                {c.tags && c.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.tags.map((tag, i) => (
                      <span
                        key={tag.name}
                        className={`text-[13px] ${TAG_COLORS[i % TAG_COLORS.length]}`}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}

export default SectionWrapper(CertificationsInner, "certifications");
