import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ContactView } from "./components/ContactView";
import { CommunityView } from "./components/CommunityView";
import { ProfileView } from "./components/ProfileView";
import { ChatView } from "./components/ChatView";
import { AdminDashboard } from "./components/AdminDashboard";
import { auth, db } from "./lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  BookOpen, 
  Menu,
  X,
  Download,
  Users,
  Target,
  FileText,
  ChevronRight,
  WifiOff,
  Cpu,
  Shield,
  ArrowRight,
  Grid,
  Home,
  Info,
  Mail,
  Briefcase,
  GraduationCap,
  Microscope,
  MessageSquare,
  Building,
  MonitorSmartphone,
  ExternalLink,
  User,
  Moon,
  Sun
} from "lucide-react";

type View = 
  | "tuis" 
  | "oor-ons" 
  | "kontak" 
  | "gebruiksgevalle" 
  | "tuisskool" 
  | "skole" 
  | "korporatief" 
  | "ed-tegnologie" 
  | "opleiding" 
  | "navorsing" 
  | "gemeenskap"
  | "witpapiere"
  | "profiel"
  | "admin"
  | "boodskappe";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("tuis");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLimbo, setIsLimbo] = useState(false);

  useEffect(() => {
    // Check initial dark mode state directly from document root
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
             const data = snap.data();
             if (data.status === "limbo" || data.status === "suspended") {
                setIsLimbo(true);
             } else {
                setIsLimbo(false);
             }
          }
        }, err => console.error(err));
        return () => unsubDoc();
      } else {
        setIsLimbo(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Close menu when navigating
  const navigate = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLimbo) {
    return (
      <div className="min-h-screen bg-bg text-ink font-sans flex flex-col items-center justify-center p-6 text-center">
        <Shield size={64} className="text-purple-600 mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-4">Toegang Opgeskort (Limbo)</h1>
        <p className="text-ink/70 max-w-md mx-auto mb-8">Jou rekening is tans in onderhoud of gereserveer vir verdere ondersoek (Limbo status). Jy kan nie tans die stelsel gebruik nie. Kontak asseblief met admin@boerki.co.za vir meer inligting.</p>
        <button onClick={() => signOut(auth)} className="bg-ink text-ink-inverse px-6 py-2 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">Teken Uit</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent selection:text-white flex flex-col items-center w-full transition-colors duration-200">
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-header-bg border-b border-sidebar-hover flex items-center justify-between px-6 md:px-12 z-50 transition-colors duration-200">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("tuis")}>
          <BookOpen className="text-accent" size={26} strokeWidth={2.5} />
          <span className="font-serif font-bold text-3xl tracking-tight text-white">BOERki</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <button onClick={() => navigate("tuis")} className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${currentView === 'tuis' ? 'text-white' : 'text-white/60 hover:text-white'}`}>TUIS</button>
          
          <div className="relative group p-4 -m-4">
            <button onClick={() => navigate("gebruiksgevalle")} className={`text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 ${['gebruiksgevalle','tuisskool','skole','korporatief','ed-tegnologie'].includes(currentView) ? 'text-white' : 'text-white/60 hover:text-white'}`}>
              GEBRUIKSGEVALLE <ChevronRight size={12} className="rotate-90" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-[60]">
               <div className="bg-surface text-ink border border-border-accent rounded-lg shadow-xl flex flex-col w-64 items-start p-2">
                 <button onClick={() => navigate("tuisskool")} className="w-full text-left px-4 py-2 hover:bg-bg rounded-md text-sm font-medium">Tuisskool Ouer Oplossing</button>
                 <button onClick={() => navigate("skole")} className="w-full text-left px-4 py-2 hover:bg-bg rounded-md text-sm font-medium">Skole Integrasie</button>
                 <button onClick={() => navigate("korporatief")} className="w-full text-left px-4 py-2 hover:bg-bg rounded-md text-sm font-medium">Korporatiewe KMI</button>
                 <button onClick={() => navigate("ed-tegnologie")} className="w-full text-left px-4 py-2 hover:bg-bg rounded-md text-sm font-medium">Ed-tegnologie</button>
               </div>
            </div>
          </div>

          <button onClick={() => navigate("profiel")} className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${currentView === 'profiel' ? 'text-white' : 'text-white/60 hover:text-white'}`}>PROFIEL</button>
          <button onClick={() => navigate("kontak")} className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${currentView === 'kontak' ? 'text-white' : 'text-white/60 hover:text-white'}`}>CONTACT</button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:text-accent transition-colors p-2"
            aria-label="Maak kieslys oop"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Slide-out Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-sidebar/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] md:w-96 bg-sidebar text-sidebar-ink z-[70] flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-sidebar-hover sticky top-0 bg-sidebar z-10">
                <span className="font-serif font-bold text-xl tracking-tight">Kieslys</span>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-sidebar-ink/70 hover:text-white p-2 rounded-full hover:bg-sidebar-hover transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 py-6">
                <nav className="flex flex-col px-4 space-y-1">
                  <SidebarItem icon={<Home size={18} />} label="Tuis" isActive={currentView === "tuis"} onClick={() => navigate("tuis")} />
                  <SidebarItem icon={<Info size={18} />} label="Oor Ons" isActive={currentView === "oor-ons"} onClick={() => navigate("oor-ons")} />
                  <SidebarItem icon={<Mail size={18} />} label="Kontak" isActive={currentView === "kontak"} onClick={() => navigate("kontak")} />
                  
                  <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-sidebar-ink/40 uppercase tracking-widest">
                    Gebruiksgevalle
                  </div>
                  <SidebarItem icon={<Users size={18} />} label="Tuisskool Ouer Oplossing" isActive={currentView === "tuisskool"} onClick={() => navigate("tuisskool")} />
                  <SidebarItem icon={<Building size={18} />} label="Skole Integrasie" isActive={currentView === "skole"} onClick={() => navigate("skole")} />
                  <SidebarItem icon={<Shield size={18} />} label="Korporatiewe KMI" isActive={currentView === "korporatief"} onClick={() => navigate("korporatief")} />
                  <SidebarItem icon={<MonitorSmartphone size={18} />} label="Ed-tegnologie" isActive={currentView === "ed-tegnologie"} onClick={() => navigate("ed-tegnologie")} />
                  
                  <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-sidebar-ink/40 uppercase tracking-widest">
                    Hulpbronne & Groei
                  </div>
                  <SidebarItem icon={<GraduationCap size={18} />} label="Opleiding en Ontwikkeling" isActive={currentView === "opleiding"} onClick={() => navigate("opleiding")} />
                  <SidebarItem icon={<Microscope size={18} />} label="Navorsing" isActive={currentView === "navorsing"} onClick={() => navigate("navorsing")} />
                  <SidebarItem icon={<MessageSquare size={18} />} label="Gemeenskap" isActive={currentView === "gemeenskap"} onClick={() => navigate("gemeenskap")} />
                  <SidebarItem icon={<User size={18} />} label="My Profiel" isActive={currentView === "profiel"} onClick={() => navigate("profiel")} />
                  <SidebarItem icon={<MessageSquare size={18} />} label="Boodskappe" isActive={currentView === "boodskappe"} onClick={() => navigate("boodskappe")} />
                  <SidebarItem icon={<Shield size={18} />} label="Admin Dashboard" isActive={currentView === "admin"} onClick={() => navigate("admin")} />
                  
                  <div className="mt-8 px-4">
                    <button 
                      onClick={() => navigate("witpapiere")}
                      className="w-full flex items-center justify-center gap-2 bg-ink text-ink-inverse hover:opacity-90 rounded px-4 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors shadow-lg"
                    >
                      <Download size={16} />
                      Die 4 Witpapiere
                    </button>
                  </div>
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="w-full flex-1 pt-16 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col"
          >
            {currentView === "tuis" && <LandingPage navigate={navigate} />}
            {currentView === "oor-ons" && <OorOnsView />}
            {currentView === "kontak" && <ContactView />}
            {currentView === "tuisskool" && <TuisskoolView navigate={navigate} />}
            {currentView === "skole" && <SkoleView navigate={navigate} />}
            {currentView === "korporatief" && <KorporatiefView navigate={navigate} />}
            {currentView === "ed-tegnologie" && <EdTechView navigate={navigate} />}
            {currentView === "opleiding" && <OpleidingView navigate={navigate} />}
            {currentView === "navorsing" && <NavorsingView navigate={navigate} />}
            {currentView === "gemeenskap" && <CommunityView />}
            {currentView === "profiel" && <ProfileView navigate={navigate} />}
            {currentView === "boodskappe" && <ChatView />}
            {currentView === "admin" && <AdminDashboard />}
            {currentView === "witpapiere" && <WhitepapersView navigate={navigate} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      <footer className="w-full bg-surface border-t border-border-accent py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-accent" size={24} />
                <span className="font-serif font-bold text-lg text-ink">BOERki</span>
              </div>
              <p className="text-ink/60 text-sm leading-relaxed mb-6">
                 Geïntegreerde Landbou Opleiding vir 'n Veranderende SA.
              </p>
            </div>
            
            <div>
                <h4 className="font-bold text-sm tracking-widest uppercase mb-6 text-ink/40">Gebruiksgevalle</h4>
                <ul className="space-y-3 text-sm text-ink/70">
                    <li><button onClick={() => navigate("tuisskool")} className="hover:text-ink transition-colors">Tuisskool Ouer Oplossing</button></li>
                    <li><button onClick={() => navigate("skole")} className="hover:text-ink transition-colors">Skole Integrasie</button></li>
                    <li><button onClick={() => navigate("korporatief")} className="hover:text-ink transition-colors">Korporatiewe KMI</button></li>
                    <li><button onClick={() => navigate("ed-tegnologie")} className="hover:text-ink transition-colors">Ed-tegnologie</button></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-sm tracking-widest uppercase mb-6 text-ink/40">Hulpbronne</h4>
                <ul className="space-y-3 text-sm text-ink/70">
                    <li><button onClick={() => navigate("opleiding")} className="hover:text-ink transition-colors">Opleiding & Ontwikkeling</button></li>
                    <li><button onClick={() => navigate("navorsing")} className="hover:text-ink transition-colors">Navorsing</button></li>
                    <li><button onClick={() => navigate("witpapiere")} className="hover:text-ink transition-colors">Witpapiere</button></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-sm tracking-widest uppercase mb-6 text-ink/40">Gemeenskap</h4>
                <ul className="space-y-3 text-sm text-ink/70">
                    <li><button onClick={() => navigate("gemeenskap")} className="hover:text-ink transition-colors">Forum</button></li>
                    <li><button onClick={() => navigate("boodskappe")} className="hover:text-ink transition-colors">Boodskappe</button></li>
                    <li><button onClick={() => navigate("profiel")} className="hover:text-ink transition-colors">Profiel</button></li>
                    <li><button onClick={() => navigate("admin")} className="hover:text-ink transition-colors">Admin Konsole</button></li>
                    <li><button onClick={() => navigate("kontak")} className="hover:text-ink transition-colors">Kontak Ons</button></li>
                </ul>
            </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border-accent">
          <div className="text-ink/40 text-sm">© {new Date().getFullYear()} BOERki. Alle regte voorbehou.</div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-ink/50">Vennote / Partners:</span>
            <a 
              href="https://everyspark.cc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-ink-inverse bg-ink hover:opacity-90 transition-opacity px-3 py-1.5 rounded"
            >
              EverySpark <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SidebarItem({ icon, label, isActive = false, onClick }: { icon: React.ReactNode, label: string, isActive?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all whitespace-nowrap w-full group
        ${isActive 
          ? "bg-white/10 text-white font-semibold" 
          : "text-sidebar-ink/70 hover:bg-sidebar-hover hover:text-white"
        }
      `}
    >
      <span className={`${isActive ? "text-accent" : "text-sidebar-ink/40 group-hover:text-sidebar-ink/60"}`}>{icon}</span>
      <span className="tracking-tight">{label}</span>
      {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );
}

// -------------------------------------------------------------
// View Components
// -------------------------------------------------------------

function LandingPage({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full px-6 py-28 md:py-40 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="border border-accent/20 bg-accent/5 text-accent px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Kweetige Intelligensie
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink tracking-tight leading-[1.1] mb-8">
            Geïntegreerde Landbou<br className="hidden md:block"/> Opleiding vir 'n <span className="text-accent blur-[0.2px]">Veranderende SA.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-ink/70 leading-relaxed max-w-2xl font-light mb-12">
            BOERki is nie net 'n toepassing nie—dit is 'n fundamentele herontwerp van hoe 
            Tegnies-Beroeps en Tegnies-Okkuperende vakke aangebied word in landelike Suid-Afrikaanse skole
            met beperkte infrastruktuur.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate("witpapiere")}
              className="bg-ink hover:opacity-90 text-ink-inverse w-full sm:w-auto px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Laai Witpapiere Af
            </button>
            <button 
              onClick={() => navigate("gebruiksgevalle")}
              className="bg-transparent border border-ink/20 hover:border-ink hover:bg-ink hover:text-ink-inverse text-ink w-full sm:w-auto px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Verken Gebruiksgevalle
            </button>
          </div>
        </div>
      </section>

      {/* Overview Block replacing old "Zero Resistansie" block */}
      <section className="w-full bg-surface border-y border-border-accent py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block border border-ink/10 bg-bg px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 text-ink/60">Die Bloudruk</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-6">Die Volledige Argitektuur</h2>
            <p className="text-lg text-ink/70 leading-relaxed font-light">
              Ontdek die metodologie wat ons platform se bevoegdheidsgebaseerde (CBE) en CAPS-belynde enjin dryf, asook die fundamentele raamwerke wat landbou-onderwys herdefinieer.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg p-10 border border-border-accent rounded-xl shadow-sm hover:border-accent/60 transition-colors flex flex-col items-start group">
              <div className="bg-surface p-4 rounded-full border border-border-accent mb-8 shadow-sm">
                 <BookOpen className="text-accent" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-ink">Die 4 Kernraamwerke</h3>
              <p className="text-ink/70 text-base leading-relaxed mb-8 flex-1">
                Lees meer oor die fundamentele witpapiere wat BOERki se argitektuur dryf. Ons kombineer tegniese innovasie met tasbare pedagogiese metodes.
              </p>
              <button 
                onClick={() => navigate("witpapiere")} 
                className="text-ink text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-accent transition-colors mt-auto"
              >
                Verken Witpapiere <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-bg p-10 border border-border-accent rounded-xl shadow-sm hover:border-accent/60 transition-colors flex flex-col items-start group">
              <div className="bg-surface p-4 rounded-full border border-border-accent mb-8 shadow-sm">
                 <Target className="text-accent" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-ink">Veelsydige Gebruike</h3>
              <p className="text-ink/70 text-base leading-relaxed mb-8 flex-1">
                Meer as net 'n portaal vir skole. Ons oplossing skaleer vanaf individuele tuisskool ouers tot by nasionale korporatiewe KMI-inisiatiewe.
              </p>
              <button 
                onClick={() => navigate("gebruiksgevalle")} 
                className="text-ink text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-accent transition-colors mt-auto"
              >
                Sien Gebruiksgevalle <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="w-full px-6 py-24">
        <div className="max-w-4xl mx-auto bg-sidebar p-10 md:p-16 rounded shadow-2xl text-sidebar-ink relative overflow-hidden border border-sidebar-hover">
          <div className="absolute right-[-5%] bottom-[-10%] opacity-5 pointer-events-none transform -rotate-12">
             <Target size={300} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-3xl font-serif font-bold mb-6 text-white max-w-lg">Kry die argitektoniese bloudrukke.</h2>
            <p className="text-sidebar-ink/70 mb-10 max-w-xl text-lg leading-relaxed font-light">
              Ons het vier omvattende witpapiere (white papers) gepubliseer wat presies verduidelik 
              hoe om hierdie stelsels operasioneel te definieër en te implementeer. Transformeer jou benadering tot onderwys.
            </p>
            <button 
              onClick={() => navigate("witpapiere")} 
              className="bg-white hover:bg-white/90 text-black px-8 py-4 rounded text-[11px] font-bold uppercase tracking-widest transition-all hover:-translate-y-1 shadow-lg flex items-center gap-3 w-fit"
            >
              <Download size={18} />
              Gaan na Aflaaiportaal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function OorOnsView() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Meer Oor BOERki</h1>
      <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
        Vind meer uit oor BOERki se missie om die Suid-Afrikaanse platteland te bemagtig met voorpunt tegnologie en onderwys.
      </p>
      <div className="space-y-8 text-ink/80 leading-relaxed">
        <p>Ons glo dat tegnologiese agterstand in landelike gebiede nie 'n onoplosbare struikelblok hoef te wees nie. Met ons argitektuur bied ons gelyke en hoë-gehalte opvoeding wat die Suid-Afrikaanse Drie-Stroom model ondersteun.</p>
        <p>Ons benadering inkorporeer bevoegdheidsgebaseerde leer (CBE) en vanlyn-eerste infrastruktuur sodat skole ononderbroke toegang het tot wêreldklas materiaal.</p>
      </div>
    </div>
  );
}

function TuisskoolView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Tuisskool Ouer Oplossing</h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
          Gepersonaliseerde leerroetes en vanlyn-bruikbare materiaal vir onafhanklike tuisonderrig in landbou.
        </p>
        <div className="bg-surface border border-border-accent p-8 rounded shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">Gepersonaliseerde Leerroetes (Pathways)</h2>
          <p className="text-ink/80 mb-6">Ons platform stel ouers in staat om 'n 100% gepersonaliseerde roete vir hul kinders te ontsluit, afhangende van hul individuele tempo, voorkeure, en langtermyn mikpunte in die landbousektor. Ons platform akkommodeer elke stadium van kognitiewe ontwikkeling.</p>
          <button onClick={() => navigate("witpapiere")} className="bg-ink text-ink-inverse px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">Laai Witskrif Af <Download size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function SkoleView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Skole Integrasie & Wit-Etikettering</h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
          Sistemiese belyning en wit-etikettering opsies vir formele onderwysinstellings en kwintiel 1-3 skole.
        </p>
        <div className="bg-surface border border-border-accent p-8 rounded shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">Skoolhoof en Onderwyser Dashboards</h2>
          <p className="text-ink/80 mb-6">Vir formele instellings sentraliseer BOERki al die uiteenlopende datastrome en verslae vanaf verskillende ed-tegnologie bronne in een skoon, 'Single Pane of Glass'. Dit spaar onderwysers etlike ure van sinnelose data-invoer en verseker die nakoming van CAPS riglyne sonder wrywing.</p>
          <button onClick={() => navigate("kontak")} className="bg-ink text-ink-inverse px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">Kontak Ons <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function KorporatiefView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Korporatiewe KMI</h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
          Geleenthede vir Korporatiewe Maatskaplike Investering (KMI/CSI) om landelike gemeenskappe via opvoedkundige infrastruktuur op te hef.
        </p>
        <div className="bg-surface border border-border-accent p-8 rounded shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">Waarborg van Impak (Data-Led Social Impact)</h2>
          <p className="text-ink/80 mb-6">In plaas van geïsoleerde skenkings wat moeilik meetbaar is, bied BOERki 'n geïntegreerde platform wat data-gedrewe en kwantifiseerbare bewys lewer vir maatskappye se KMI besteding. Sien regstreeks die transformasie asook vaardigheidsopheffing van die gemeenskap wat julle befonds.</p>
          <button onClick={() => navigate("kontak")} className="bg-ink text-ink-inverse px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">Start a Partnership <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function EdTechView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Ed-Tegnologie Samewerkings</h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
          Integrasie met ander platforms om 'n verenigde, zero-rated leer-ekosisteem te skep.
        </p>
        <div className="bg-surface border border-border-accent p-8 rounded shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">Vennote in Tegnologie (API & LTI Integrasie)</h2>
          <p className="text-ink/80 mb-6">Ons platform benut hoogs-aanpasbare integrasiesketting. Ons vennoot aktief met derdeparty produkte soos Siyavula, Canvas asook ander om die DC Matrix van krag te voorsien. Die ekosisteem word hierdeur aansienlik meer waardevol en relevant vit Suid-Afrika se spesifieke skoolraamwerke.</p>
        </div>
      </div>
    </div>
  );
}

function OpleidingView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Opleiding & Ontwikkeling</h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
          Fasiliteerders-en-onderwyseropleiding om die Drie-Stroom model doeltreffend te implementeer.
        </p>
        <div className="bg-surface border border-border-accent p-8 rounded shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">Die Bemagtigingsnetwerk</h2>
          <p className="text-ink/80 mb-6">Onderwysersopleiding staan sentraal tot die BOERki argitektuur. Ons poog om plattelandse leierskragte op te hef om sodoende met gemak die 21ste Eeuse tegnologie tot voordeel van hul lokale skole aan te wend. Ons rus u fasiliteerders toe om sukses te verseker.</p>
          <button onClick={() => navigate("kontak")} className="bg-ink text-ink-inverse px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">Doen Navraag <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function NavorsingView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Navorsing</h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
          Die akademiese fondasies en data-gedrewe navorsing wat BOERki se bevoegdheidsraamwerk (CBE) enjin dryf.
        </p>
        <div className="bg-surface border border-border-accent p-8 rounded shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">Geloofwaardige Kennisstelsels</h2>
          <p className="text-ink/80 mb-6">Al ons stelsels word gedryf deur omvattende dataontleding asook portuurbeoordeelde metodologieë van institusies wêreldwyd. Laai gerus die beskikbare witpapiere af om the spesifieke besonderhede rakende CAPS en Nasionale Protokol in-diepte te bekyk.</p>
          <button onClick={() => navigate("witpapiere")} className="bg-ink text-ink-inverse px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">Lees Navorsing <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function WhitepapersView({ navigate }: { navigate: (v: View) => void }) {
  const papers = [
    { 
      title: "Kurrikulum Belyning (CAPS & CBE)", 
      desc: "Ontdek hoe om die streng vereistes van die Nasionale Protokol vir Assessering te integreer met 'n progressiewe 21ste-eeuse Bevoegdheidsmatriks (CBE). Hierdie raamwerk stel opvoeders in staat om nie net generiese punte te gee nie, maar ware vaardigheidsbemeestering na te spoor en leerders aktief te motiveer om die stelsel te navigeer en self te bestuur." 
    },
    { 
      title: "Vanlyn-Eerste Infrastruktuur", 
      desc: "Leer die tegniese en logistiese geheime agter 'Edge-Computing' argitekture vir skole met onstabiele of geen internet konneksie nie. Hierdie witskrif verduidelik in praktiese terme hoe opvoeders 'n ononderbroke, asynchrone leeromgewing kan bou wat floreer te midde van beurtkrag asook data-tekorte in verafgeleë landelike gebiede." 
    },
    { 
      title: "21ste Eeuse Bevoegdhede (4Cs)", 
      desc: "Verken 'n in-diepte analise van die '4Cs' (Kritieke denke, Kreatiwiteit, Kommunikasie en Samewerking) asook hoe dit die beslissende grondslag vorm vir praktiese werksgereedheid onder SA se Drie-Stroom model. Identifiseer vaardigheidsleemtes in the onderwys en leer hoe om hierdie elemente te transformeer in konkrete, evalueerbare mylpale vir die leerder." 
    },
    { 
      title: "Drie-Stroom Model Implementering", 
      desc: "Kry 'n deeglike stap-vir-stap operasionele handleiding oor die naatlose fasilitering van Akademiese, Beroeps (Vocational) en Okkuperende (Occupational) vaardighede binne een enkele portefeulje. Hierdie model sal u bestuurspan bemagtig om komplekse verskille in leerder-aanlegte stelselmatig en winsgewend te akkommodeer." 
    }
  ];

  return (
    <div className="w-full">
      <div className="bg-surface border-b border-border-accent">
        <div className="max-w-4xl mx-auto px-6 py-20 pb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Die 4 Witpapiere</h1>
          <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light max-w-2xl">
            Laai een van hierdie afsonderlike witskrifte gratis af. Ons gevorderde navorsing 
            bied die diepgaande akademiese en logistiese bestuurs-stappe wat tans benodig is om landbou-opleiding te herstruktureer en te innoveer.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-7 space-y-6">
          {papers.map((paper, i) => (
            <div key={i} className="bg-surface border border-border-accent p-8 rounded shadow-sm hover:border-accent transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FileText size={80} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold text-ink mb-4 group-hover:text-accent transition-colors relative z-10">{paper.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed relative z-10 font-light">{paper.desc}</p>
            </div>
          ))}
        </div>

        <div className="col-span-1 lg:col-span-5 relative">
          <div className="sticky top-24 bg-sidebar border border-sidebar-hover rounded shadow-2xl p-8 text-sidebar-ink overflow-hidden">
            <div className="absolute right-[-10%] bottom-[-10%] opacity-10 pointer-events-none transform rotate-12">
              <Download size={200} strokeWidth={1} />
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">Laai 'n Afskrif Af</h3>
            <p className="text-sm text-sidebar-ink/70 mb-8 relative z-10">Vul jou besonderhede in en die gekose PDF-skakel sal omgaande direk na jou e-pos gestuur word.</p>
            
            <form className="space-y-6 relative z-10">
              <div>
                <label className="block text-[10px] font-bold text-sidebar-ink/60 uppercase tracking-widest mb-2">Kies Jou Witpapier</label>
                <select className="w-full bg-sidebar-hover border border-sidebar-ink/10 rounded px-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-white">
                  <option value="caps">Kurrikulum Belyning (CAPS & CBE)</option>
                  <option value="offline">Vanlyn-Eerste Infrastruktuur</option>
                  <option value="skills">21ste Eeuse Bevoegdhede (4Cs)</option>
                  <option value="threestream">Drie-Stroom Model Implementering</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-sidebar-ink/60 uppercase tracking-widest mb-2">NAAM</label>
                <input type="text" className="w-full bg-sidebar-hover border border-sidebar-ink/10 rounded px-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-white/20 text-white" placeholder="bv. Johannes van Wyk" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sidebar-ink/60 uppercase tracking-widest mb-2">E-POSADRES</label>
                <input type="email" className="w-full bg-sidebar-hover border border-sidebar-ink/10 rounded px-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-white/20 text-white" placeholder="jou.epos@skool.co.za" />
              </div>

              <button type="button" className="w-full bg-white text-black font-bold text-[11px] uppercase tracking-widest px-4 py-4 rounded hover:bg-white/90 transition-all hover:-translate-y-0.5 shadow-md mt-6 flex items-center justify-center gap-2">
                <Download size={16} />
                Stuur na E-pos
              </button>
              <p className="text-center text-[10px] text-sidebar-ink/40 uppercase tracking-widest mt-4">Ons belowe zero gemorspos.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
