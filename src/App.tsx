import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ContactView } from "./components/ContactView";
import { CommunityView } from "./components/CommunityView";
import { ProfileView } from "./components/ProfileView";
import { ChatView } from "./components/ChatView";
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
  User
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
  | "boodskappe";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("tuis");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close menu when navigating
  const navigate = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent selection:text-white flex flex-col items-center w-full">
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-hover flex items-center justify-between px-6 md:px-12 z-50 transition-all">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("tuis")}>
          <BookOpen className="text-accent" size={26} strokeWidth={2.5} />
          <span className="font-serif font-bold text-3xl tracking-tight text-white">BOERki</span>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="text-white hover:text-accent transition-colors p-2"
          aria-label="Maak kieslys oop"
        >
          <Menu size={28} />
        </button>
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
                  
                  <div className="mt-8 px-4">
                    <button 
                      onClick={() => navigate("witpapiere")}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white rounded px-4 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors shadow-lg"
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
            {currentView === "oor-ons" && <GenericView title="Oor Ons" description="Vind meer uit oor BOERki se missie om die Suid-Afrikaanse platteland te bemagtig met voorpunt tegnologie en onderwys." />}
            {currentView === "kontak" && <ContactView />}
            {currentView === "tuisskool" && <GenericView title="Tuisskool Ouer Oplossing" description="Gepersonaliseerde leerroetes en vanlyn-bruikbare materiaal vir onafhanklike tuisonderrig in landbou." />}
            {currentView === "skole" && <GenericView title="Skole Integrasie & Wit-etikettering" description="Sistemiese belyning en wit-etikettering opsies vir formele onderwysinstellings en kwintiel 1-3 skole." />}
            {currentView === "korporatief" && <GenericView title="Korporatiewe KMI" description="Geleenthede vir Korporatiewe Maatskaplike Investering (KMI/CSI) om landelike gemeenskappe via opvoedkundige infrastruktuur op te hef." />}
            {currentView === "ed-tegnologie" && <GenericView title="Ed-tegnologie Samewerkings" description="Integrasie met ander platforms om 'n verenigde, zero-rated leer-ekosisteem te skep." />}
            {currentView === "opleiding" && <GenericView title="Opleiding en Ontwikkeling" description="Fasiliteerders-en-onderwyseropleiding om die Drie-Stroom model doeltreffend te implementeer." />}
            {currentView === "navorsing" && <GenericView title="Navorsing" description="Die akademiese fondasies en data-gedrewe navorsing wat BOERki se bevoegdheidsraamwerk (CBE) enjin dryf." />}
            {currentView === "gemeenskap" && <CommunityView />}
            {currentView === "profiel" && <ProfileView navigate={navigate} />}
            {currentView === "boodskappe" && <ChatView />}
            {currentView === "witpapiere" && <WhitepapersView navigate={navigate} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      <footer className="w-full bg-surface border-t border-border-accent py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-accent/50" size={24} />
            <span className="font-serif font-bold text-lg text-ink/70">BOERki</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-ink/50">Vennote / Partners:</span>
            <a 
              href="https://everyspark.cc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-accent hover:text-accent-muted transition-colors bg-accent/5 px-3 py-1.5 rounded"
            >
              everySPARK <ExternalLink size={14} />
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
      <section className="w-full px-6 pt-12 pb-16 md:pt-20 md:pb-24 max-w-4xl mx-auto flex flex-col items-start gap-8">
        <div className="w-full space-y-6">
          <span className="text-accent uppercase tracking-[0.2em] text-[10px] font-bold block mb-2">
            Kweetige Intelligensie
          </span>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-ink tracking-tight leading-snug">
            Geïntegreerde Landbou Opleiding <br className="hidden lg:block"/> vir 'n Veranderende SA.
          </h1>
          <p className="text-base md:text-lg text-ink/70 leading-relaxed font-light max-w-2xl">
            BOERki is nie net 'n toepassing nie—dit is 'n fundamentele herontwerp van hoe 
            Tegnies-Beroeps en Tegnies-Okkuperende vakke aangebied word in landelike Suid-Afrikaanse skole
            met beperkte infrastruktuur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate("witpapiere")}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded text-[11px] font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Laai Die Witpapiere Af
            </button>
            <button 
              onClick={() => navigate("gebruiksgevalle")}
              className="bg-surface border border-border-accent hover:border-accent hover:text-accent text-ink px-8 py-4 rounded text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Verken Gebruiksgevalle <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Overview Block replacing old "Zero Resistansie" block */}
      <section className="w-full bg-surface border-y border-border-accent py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-6">Die Volledige Argitektuur</h2>
            <p className="text-lg text-ink/70 leading-relaxed font-light">
              Ontdek die metodologie wat ons platform se bevoegdheidsgebaseerde (CBE) en CAPS-belynde enjin dryf, asook die fundamentele raamwerke wat landbou-onderwys herdefinieer.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg p-10 border border-border-accent rounded shadow-sm hover:border-accent transition-colors flex flex-col items-start group">
              <BookOpen className="text-accent mb-6" size={32} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 text-ink">Die 4 Kernraamwerke</h3>
              <p className="text-ink/70 text-base leading-relaxed mb-8 flex-1">
                Lees meer oor die fundamentele witpapiere wat BOERki se argitektuur dryf. Ons kombineer tegniese innovasie met tasbare pedagogiese metodes.
              </p>
              <button onClick={() => navigate("witpapiere")} className="text-accent text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all mt-auto py-2 bg-accent/5 px-4 rounded">
                Verken Witpapiere <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="bg-bg p-10 border border-border-accent rounded shadow-sm hover:border-accent transition-colors flex flex-col items-start group">
              <Target className="text-accent mb-6" size={32} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-4 text-ink">Veelsydige Gebruike</h3>
              <p className="text-ink/70 text-base leading-relaxed mb-8 flex-1">
                Meer as net 'n portaal vir skole. Ons oplossing skaleer vanaf individuele tuisskool ouers tot by nasionale korporatiewe KMI-inisiatiewe.
              </p>
              <button onClick={() => navigate("gebruiksgevalle")} className="text-accent text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all mt-auto py-2 bg-accent/5 px-4 rounded">
                Sien Gebruiksgevalle <ArrowRight size={14} />
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
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded text-[11px] font-bold uppercase tracking-widest transition-all hover:-translate-y-1 shadow-lg flex items-center gap-3 w-fit"
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

function GenericView({ title, description }: { title: string, description: string }) {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">{title}</h1>
      <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
        {description}
      </p>
      
      <div className="bg-surface border border-border-accent p-12 rounded shadow-sm flex flex-col items-center justify-center text-center min-h-[40vh]">
         <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
           <Info className="text-accent" size={32} />
         </div>
         <h2 className="text-2xl font-bold text-ink mb-4">Inhoude Kom Binnekort</h2>
         <p className="text-ink/60 max-w-md">
           Hierdie blad is tans onder konstruksie of dien as 'n plek-houer vir opkomende funksionaliteit en bemarkingmateriaal.
         </p>
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

              <button type="button" className="w-full bg-accent text-white font-bold text-[11px] uppercase tracking-widest px-4 py-4 rounded hover:bg-accent/90 transition-all hover:-translate-y-0.5 shadow-md mt-6 flex items-center justify-center gap-2">
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
