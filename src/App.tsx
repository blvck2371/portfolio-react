import { lazy, Suspense, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  About,
  Experience,
  Hero,
  HeroParallaxBackground,
  Navbar,
  Works,
} from "./components";
import { AppLoader } from "./components/layout/AppLoader";
import { SectionLoader } from "./components/layout/SectionLoader";
import { AuthProvider } from "./contexts/AuthContext";

const Tech = lazy(() => import("./components/sections/Tech").then((m) => ({ default: m.default })));
const Certifications = lazy(() =>
  import("./components/sections/Certifications").then((m) => ({ default: m.default }))
);
const ContactSection = lazy(() =>
  import("./components/sections/Contact").then((m) => ({ default: m.default }))
);
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));
const StarsCanvas = lazy(() =>
  import("./components/canvas/Stars").then((m) => ({ default: m.default }))
);

const Home = () => (
  <div className="bg-primary relative z-0">
    <div className="relative min-h-screen overflow-hidden">
      <HeroParallaxBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>
    </div>
    <About />
    <Experience />
    <Suspense fallback={<SectionLoader />}>
      <Tech />
    </Suspense>
    <Works />
    <Suspense fallback={<SectionLoader />}>
      <Certifications />
    </Suspense>
    {/* Bloc contact : même structure que le Hero — fond en PLEINE LARGEUR (toute la page) */}
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Image de fond — exactement comme en haut : absolute inset-0 w-full = toute la largeur */}
      <div
        className="pointer-events-none absolute inset-0 z-0 w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/herobg.png)" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-0 w-full bg-primary/60" aria-hidden />
      <div className="relative z-10">
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <StarsCanvas />
      </Suspense>
    </div>
  </div>
);

const App = () => {
  const [appReady, setAppReady] = useState(false);

  const handleLoaderReady = useCallback(() => {
    setAppReady(true);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        {!appReady && <AppLoader onReady={handleLoaderReady} />}
        {appReady && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={
                  <div className="flex min-h-screen items-center justify-center bg-primary">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 rounded-full border-2 border-[#915EFF]/40 border-t-[#915EFF] animate-spin" />
                      <p className="text-secondary">Chargement…</p>
                    </div>
                  </div>
                }>
                  <AdminPage />
                </Suspense>
              }
            />
          </Routes>
        )}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
