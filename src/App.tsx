/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  ArrowRight, 
  Globe, 
  Shield, 
  Users, 
  Cpu, 
  Zap, 
  Map as MapIcon, 
  MessageSquare, 
  Mail, 
  Phone,
  Droplets,
  Tractor
} from "lucide-react";
import type { ReactNode } from "react";

export default function App() {
  return (
    <div id="app-root" className="min-h-screen bg-bg text-ink selection:bg-accent selection:text-bg overflow-x-hidden">
      {/* Navigation */}
      <nav id="main-nav" className="container max-w-6xl mx-auto px-8 py-6 flex justify-between items-center border-b border-border-accent z-50 sticky top-0 bg-bg/80 backdrop-blur-md">
        <div id="logo" className="font-serif text-2xl font-bold tracking-tighter text-accent">
          BOERki
        </div>
        <div id="nav-links" className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium opacity-70">
          <a href="#projek" className="hover:text-accent transition-colors">Die Projek</a>
          <a href="#argitektuur" className="hover:text-accent transition-colors">Argitektuur</a>
          <a href="#vennote" className="hover:text-accent transition-colors">Vennote</a>
          <a href="#kontak" className="hover:text-accent transition-colors">Kontak</a>
        </div>
        <div id="location-tag" className="hidden lg:block text-[10px] opacity-40 uppercase tracking-widest">
          VRYSTAAT, SUID-AFRIKA
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="container max-w-6xl mx-auto px-8 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <motion.div 
              id="hero-content"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 id="hero-title" className="font-serif text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
                Geïntegreerde <br />
                <span className="text-accent italic">Landbou Opleiding.</span>
              </h1>
              <p id="hero-description" className="text-base lg:text-lg opacity-70 leading-relaxed max-w-lg mb-10 font-light text-ink/90">
                Pionierswerk vir die implementering van die Departement van Basiese Onderwys se "Three Stream Model". BOERki bied 'n 
                hiper-gelokaliseerde, aflyn-eerste leerhub om die gaping tussen 21ste-eeuse tegnologie en Suid-Afrikaanse plattelandse onderwys te oorbrug.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  id="cta-button-primary"
                  href="#argitektuur" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-bg text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Verken die Argitektuur
                  <ArrowRight size={14} />
                </a>
                <a 
                  id="cta-button-secondary"
                  href="#kontak" 
                  className="inline-flex items-center gap-3 px-8 py-4 border border-border-accent text-accent text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-accent hover:text-bg transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Raak Betrokke
                </a>
              </div>
            </motion.div>

            {/* Visual Plate */}
            <motion.div 
              id="hero-visual"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative aspect-[4/3] lg:h-[500px] bg-gradient-to-br from-[#0b1727] to-[#040914] border border-border-accent rounded-sm overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
              
              <div id="visual-overlay" className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.3em] opacity-30">
                EST. 2024 &copy; ONDERWYS-MEESTERS
              </div>

              {/* Abstract Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-accent/10 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 border border-accent/5 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              
              {/* Decorative data points */}
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent rounded-full blur-sm animate-pulse" />
              <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-accent/50 rounded-full blur-sm animate-pulse delay-500" />
            </motion.div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="bg-glass/30 border-y border-border-accent py-24">
          <div className="container max-w-6xl mx-auto px-8">
            <div className="mb-20 text-center">
              <span className="text-accent uppercase tracking-[0.3em] text-[10px] mb-4 block font-medium">Stategiese Posisionering</span>
              <h2 className="font-serif text-3xl mb-4">Innoverende Leer-Argitektuur</h2>
              <div className="w-16 h-px bg-accent mx-auto opacity-40" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                id="feature-1"
                number="01" 
                title="Vanlyn-Eerste PWA" 
                description="Gestruktureer om te funksioneer in KZN en Vrystaat se landelike kwintiel 1-3 skole met beperkte konnektiwiteit."
                icon={<Shield className="text-accent/50" size={20} />}
              />
              <FeatureCard 
                id="feature-2"
                number="02" 
                title="Sistemiese Belyning" 
                description="Volledig nakomend aan die DBO se Nasionale Protokol vir Assessering met outomatiese verslaggenerering."
                icon={<Users className="text-accent/50" size={20} />}
              />
              <FeatureCard 
                id="feature-3"
                number="03" 
                title="Drie-Stroom Model" 
                description="Akkommodeer akademiese asook Tegnies-Beroeps en Tegnies-Okkuperende vakke tegelykertyd."
                icon={<Zap className="text-accent/50" size={20} />}
              />
            </div>
          </div>
        </section>

        {/* Argitektuur Section */}
        <section id="argitektuur" className="py-24 overflow-hidden">
          <div className="container max-w-6xl mx-auto px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div 
                className="lg:w-1/2 order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative p-10 border border-border-accent bg-glass/20 rounded-sm">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Cpu className="text-accent mb-2" size={24} />
                      <h4 className="font-serif text-lg">Granulêre Meting</h4>
                      <p className="text-xs opacity-60 font-light leading-relaxed">
                        Data modelle wat beide CAPS bevoegdhede asook sagte 21ste-eeuse vaardighede weerspieël.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Droplets className="text-accent mb-2" size={24} />
                      <h4 className="font-serif text-lg">Playlist Enjin</h4>
                      <p className="text-xs opacity-60 font-light leading-relaxed">
                        Universal Design for Learning (UDL) gebaseerde hiërargiese logikabome vir hiper-gepersonaliseerde take.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <MapIcon className="text-accent mb-2" size={24} />
                      <h4 className="font-serif text-lg">Slim Sinkronisasie</h4>
                      <p className="text-xs opacity-60 font-light leading-relaxed">
                        Datakluise met agtergrond-queueing vir wanneer lae-bandwydte konnektiwiteit wel bespeur word.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Tractor className="text-accent mb-2" size={24} />
                      <h4 className="font-serif text-lg">Handel-Gesentreerd</h4>
                      <p className="text-xs opacity-60 font-light leading-relaxed">
                        Ondersteun portefeulje ontwikkeling (PATs) en rubric-gebaseerde assesserings vir beroepsgereedheid.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="lg:w-1/2 order-1 lg:order-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-accent uppercase tracking-[0.4em] text-[10px] mb-6 block">Akademiese Onderbou</span>
                <h2 className="font-serif text-4xl lg:text-5xl mb-6 leading-tight">
                  Meer as 'n platform. <br/><span className="italic opacity-80">'n Analitiese ekosisteem.</span>
                </h2>
                <p className="text-sm lg:text-base opacity-70 font-light leading-relaxed mb-8">
                  Die implementering van opvoedkundige tegnologie verby hoë-profiel stedelike skole vereis fundamentele ingenieursverskuiwings. 
                  Gewone wolkgebaseerde "LMS" stelsels faal in die Suid-Afrikaanse platteland as gevolg van "load shedding" en digitaal-ongelyke toegang.
                  BOERki fokus op werklike skaalbaarheid deur die probleem plaaslik en vanlyn eerstens aan te pak.
                </p>
                <ul className="space-y-4">
                  {[
                    "Zero-rated verkeer op groot mobiele netwerke.",
                    "Onderwyser paneelborde vir vinnige data interpretasie.",
                    "Integrasie met oop-bron platforms (Siyavula ens.).",
                    "Aksiegerigte intydse waarskuwingstelsels vir VOO leerders."
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-4 text-sm opacity-80"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-1 h-1 bg-accent rounded-full" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>



        {/* Gemeenskap & Kontak */}
        <section id="vennote" className="py-24 bg-glass/10 border-t border-border-accent/40">
          <div className="container max-w-6xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Community */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-accent p-12 rounded-sm text-bg"
              >
                <h2 className="font-serif text-4xl lg:text-5xl mb-6 leading-tight">Implementerings-vennote gesoek.</h2>
                <p className="text-sm lg:text-base mb-10 opacity-90 leading-relaxed font-medium">
                  Ons soek aktief skole binne die landbousektor en tegnologievennote in siviele ingenieurswese om ons stelsel te loods en skaal volgens Suid-Afrikaanse behoeftes.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg/10 flex items-center justify-center shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold uppercase tracking-wider text-[10px]">Deel in die ekosisteem</h5>
                      <p className="text-xs opacity-80 mt-1">Beta verenigbaarheidtoetse vir landbouskole.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bg/10 flex items-center justify-center shrink-0">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold uppercase tracking-wider text-[10px]">Streeks Ontwikkeling</h5>
                      <p className="text-xs opacity-80 mt-1">Tegnologiese vennootskappe met provinsiale onderwys.</p>
                    </div>
                  </div>
                </div>
                <button className="mt-10 px-8 py-4 bg-bg text-accent text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-white hover:text-bg transition-all">
                  Registreer Belangstelling
                </button>
              </motion.div>

              {/* Contact Form */}
              <motion.div 
                id="kontak"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="font-serif text-3xl lg:text-4xl mb-4">Strukturele Navrae</h2>
                  <p className="opacity-60 text-sm font-light">Dien 'n aansoek in vir stelseldemonstrasies by jou distrikskantoor of onafhanklike netwerk.</p>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="NAAM EN VAN" className="w-full bg-glass/50 border border-border-accent/50 p-4 text-[10px] tracking-widest uppercase focus:border-accent outline-none transition-colors" />
                    <input type="email" placeholder="INSTANSIE EPOS" className="w-full bg-glass/50 border border-border-accent/50 p-4 text-[10px] tracking-widest uppercase focus:border-accent outline-none transition-colors" />
                  </div>
                  <textarea placeholder="INSTANSIE BESONDERHEDE / DOELWITTE" rows={4} className="w-full bg-glass/50 border border-border-accent/50 p-4 text-[10px] tracking-widest uppercase focus:border-accent outline-none transition-colors resize-none"></textarea>
                  <button className="w-full py-4 bg-accent text-bg text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all">
                    Versoek Konsultasie
                  </button>
                </form>

                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <Phone className="text-accent" size={14} />
                    <span className="text-[11px] tracking-[0.1em] opacity-60">+27 (0) 51 000 1234</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-accent" size={14} />
                    <span className="text-[11px] tracking-[0.1em] opacity-60">konsultasie@boerki.co.za</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer id="main-footer" className="container max-w-6xl mx-auto px-8 py-16 border-t border-border-accent/20">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="font-serif text-xl font-bold tracking-tighter text-accent mb-6">BOERki VOO</div>
            <p className="opacity-50 text-xs font-light leading-relaxed max-w-md">
              Die toekoms van Suid-Afrikaanse leer begin hier. Ons oorbrug die digitale gaping met vanlyn-eerste en CAPS-belynde argitektuur ter voorbereiding vir die Fourth Industrial Revolution.
            </p>
          </div>
          <div>
            <h5 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Platformnavorsing</h5>
            <ul className="space-y-3 text-[11px] opacity-50 font-light">
              <li><a href="#" className="hover:text-accent transition-colors">Onderwyser Dashboards</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Edge-Computing Enjin</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">CBE Metodologie</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sekuriteitsprotokol</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Skakels</h5>
            <ul className="space-y-3 text-[11px] opacity-50 font-light">
              <li><a href="#" className="hover:text-accent transition-colors">Verslae</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Ontwikkelaars</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Werksgeleenthede</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] uppercase tracking-[0.1em] opacity-30 pt-8 border-t border-border-accent/10">
          &copy; {new Date().getFullYear()} BOERki Landbou Onderwys-Tegnologie.
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

function FeatureCard({ id, number, title, description, icon }: FeatureCardProps) {
  return (
    <motion.div 
      id={id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      className="bg-glass border border-border-accent/40 p-8 rounded-sm group hover:border-accent/30 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div id={`${id}-number`} className="font-serif text-2xl text-accent group-hover:scale-110 transition-transform">
          {number}
        </div>
        <div id={`${id}-icon`}>
          {icon}
        </div>
      </div>
      <h3 id={`${id}-title`} className="text-lg font-semibold mb-3 tracking-tight">{title}</h3>
      <p id={`${id}-description`} className="text-[13px] opacity-60 leading-relaxed font-light">
        {description}
      </p>
    </motion.div>
  );
}

