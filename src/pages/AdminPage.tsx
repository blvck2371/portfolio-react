import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { AdminProjects } from "../components/admin/AdminProjects";
import { AdminExperience } from "../components/admin/AdminExperience";
import { AdminTech } from "../components/admin/AdminTech";
import { AdminCertifications } from "../components/admin/AdminCertifications";
import { AdminPresentation } from "../components/admin/AdminPresentation";
import { AdminServices } from "../components/admin/AdminServices";
import { AdminCV } from "../components/admin/AdminCV";
import { AdminHero } from "../components/admin/AdminHero";
import { AdminSocials } from "../components/admin/AdminSocials";

type TabId = "projects" | "experience" | "tech" | "certifications" | "presentation" | "services" | "cv" | "hero" | "socials";

export function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("projects");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <p className="text-secondary">Chargement…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary text-white">
      <header className="border-b border-slate-800 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-semibold">Panel admin — Portfolio</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{user.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:border-red-500 hover:text-red-300"
            >
              Déconnexion
            </button>
            <a
              href="/"
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Voir le site
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-4 md:px-8">
        <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-1">
          {(
            [
              ["hero", "Profil & Hero"],
              ["presentation", "Présentation"],
              ["services", "Cartes (À propos)"],
              ["projects", "Projets"],
              ["experience", "Expériences"],
              ["tech", "Technologies"],
              ["certifications", "Certifications"],
              ["socials", "Mes réseaux"],
              ["cv", "CV"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                tab === id ? "bg-[#915EFF] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "hero" && <AdminHero />}
        {tab === "presentation" && <AdminPresentation />}
        {tab === "services" && <AdminServices />}
        {tab === "projects" && <AdminProjects />}
        {tab === "experience" && <AdminExperience />}
        {tab === "tech" && <AdminTech />}
        {tab === "certifications" && <AdminCertifications />}
        {tab === "socials" && <AdminSocials />}
        {tab === "cv" && <AdminCV />}
      </div>
    </div>
  );
}
