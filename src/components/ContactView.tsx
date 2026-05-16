import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'contacts');
      setError('Daar was \'n fout met die versending. Probeer asseblief weer of e-pos ons direk by kontak@boerki.co.za');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-20 md:py-24">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight leading-tight">Kontak Ons</h1>
      <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-light mb-12 max-w-2xl">
        Reik uit vir vennootskappe, vroeë toegang, of enige vrae rakende ons argitektuur. Of stuur 'n e-pos aan <a href="mailto:kontak@boerki.co.za" className="text-accent underline">kontak@boerki.co.za</a>.
      </p>
      
      <div className="bg-surface border border-border-accent p-8 md:p-12 rounded shadow-sm max-w-2xl">
         {isSuccess ? (
           <div className="flex flex-col items-center justify-center text-center py-12">
             <CheckCircle className="text-green-500 mb-6" size={48} />
             <h2 className="text-2xl font-bold text-ink mb-4">Dankie! Jou boodskap is gestuur.</h2>
             <p className="text-ink/60">Ons sal so gou as moontlik met jou in verbinding tree.</p>
             <button 
                onClick={() => setIsSuccess(false)} 
                className="mt-8 text-[11px] font-bold uppercase tracking-widest text-accent hover:text-accent-muted transition-colors"
                type="button"
             >
                Stuur Nóg 'n Boodskap
             </button>
           </div>
         ) : (
           <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
               <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded text-sm">
                 {error}
               </div>
             )}
             <div>
               <label className="block text-[10px] font-bold text-ink/60 uppercase tracking-widest mb-2">NAAM</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={e => setName(e.target.value)}
                 required
                 className="w-full bg-bg border border-border-accent rounded px-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-ink/20 text-ink" 
                 placeholder="Jou Naam" 
               />
             </div>
             
             <div>
               <label className="block text-[10px] font-bold text-ink/60 uppercase tracking-widest mb-2">E-POSADRES</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 required
                 className="w-full bg-bg border border-border-accent rounded px-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-ink/20 text-ink" 
                 placeholder="jou.epos@adres.co.za" 
               />
             </div>

             <div>
               <label className="block text-[10px] font-bold text-ink/60 uppercase tracking-widest mb-2">BOODSKAP</label>
               <textarea 
                 value={message}
                 onChange={e => setMessage(e.target.value)}
                 required
                 rows={5}
                 className="w-full bg-bg border border-border-accent rounded px-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-ink/20 text-ink resize-none" 
                 placeholder="Hoe kan ons jou help?" 
               ></textarea>
             </div>

             <button 
               type="submit" 
               disabled={isSubmitting}
               className="w-full bg-ink text-surface font-bold text-[11px] uppercase tracking-widest px-4 py-4 rounded hover:bg-ink/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               ) : (
                 <>
                   <Send size={16} />
                   Stuur Boodskap
                 </>
               )}
             </button>
           </form>
         )}
      </div>
    </div>
  );
}
