import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, getCountFromServer, where, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Users, AlertTriangle, Shield, Activity, Save, Key, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'community' | 'users'>('metrics');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        // If email matches admin@boerki.co.za or we can read from admins, then we are admin.
        // We'll just try to read a dummy query from users to see if we have list access without where clause, 
        // wait we can just check email or let rules test it for us.
        if (u.email === 'admin@boerki.co.za') {
           setIsAdmin(true);
        } else {
           // check if we can read admins collection doc
           try {
              const snap = await getCountFromServer(collection(db, 'admins'));
              setIsAdmin(true);
           } catch (err) {
              setIsAdmin(false);
           }
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
         alert("Hierdie admin e-pos bestaan nie. Gaan asseblief eers na jou Profiel om met hierdie e-pos in te teken of te registreer, en kom dan terug hier.");
      } else {
         alert("Admin intekening het misluk: " + err.message);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-border-accent bg-surface rounded shadow-md">
        <Shield size={48} className="mx-auto mb-6 text-accent" />
        <h2 className="text-2xl font-serif font-bold text-center mb-6">Admin Dashboard</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">E-pos</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-bg border border-border-accent p-3 focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">Wagwoord</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-bg border border-border-accent p-3 focus:outline-none focus:border-accent" />
          </div>
          <button type="submit" className="w-full bg-ink text-ink-inverse p-3 text-sm font-bold uppercase tracking-widest hover:opacity-90">Teken In</button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-border-accent bg-surface rounded shadow-md text-center">
        <Lock size={48} className="mx-auto mb-6 text-accent" />
        <h2 className="text-2xl font-serif font-bold mb-4">Toegang Geweier</h2>
        <p className="text-ink/70 mb-6">Jy het nie administratiewe regte om hierdie blad te sien nie.</p>
        <button onClick={() => signOut(auth)} className="bg-ink text-ink-inverse px-4 py-2 text-sm font-bold uppercase tracking-widest">Teken Uit</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-4xl font-bold flex items-center gap-3">
             <Shield className="text-accent" /> Admin Konsole
          </h1>
          <p className="text-ink/60 mt-2">Bestuur boerki platform en gebruikers</p>
        </div>
        <button onClick={() => signOut(auth)} className="text-sm font-bold uppercase tracking-widest hover:text-accent">Teken Uit</button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-border-accent pb-4">
        <button onClick={() => setActiveTab('metrics')} className={`text-sm font-bold uppercase tracking-widest ${activeTab === 'metrics' ? 'text-accent' : 'text-ink/50'}`}>SaaS Metrieke</button>
        <button onClick={() => setActiveTab('community')} className={`text-sm font-bold uppercase tracking-widest ${activeTab === 'community' ? 'text-accent' : 'text-ink/50'}`}>Gemeenskap</button>
        <button onClick={() => setActiveTab('users')} className={`text-sm font-bold uppercase tracking-widest ${activeTab === 'users' ? 'text-accent' : 'text-ink/50'}`}>Gebruikers</button>
      </div>

      <div>
        {activeTab === 'metrics' && <MetricsDash />}
        {activeTab === 'community' && <CommunityDash />}
        {activeTab === 'users' && <UserManagementDash />}
      </div>
    </div>
  );
}

function MetricsDash() {
  const [stats, setStats] = useState<any>({
    users: 0,
    chats: 0,
    messages: 0,
    contacts: 0
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const uCount = await getCountFromServer(collection(db, 'users'));
        const cCount = await getCountFromServer(collection(db, 'chats'));
        const conCount = await getCountFromServer(collection(db, 'contacts'));
        setStats({
           users: uCount.data().count,
           chats: cCount.data().count,
           contacts: conCount.data().count,
           messages: 0 // messages are subcollections, harder to count directly without a cloud function or group query. We skip for now or use group query.
        });
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-surface border border-border-accent rounded">
          <div className="flex items-center gap-3 mb-4 text-ink/60 text-sm font-bold uppercase tracking-widest">
            <Users size={16} /> Totale Gebruikers
          </div>
          <div className="text-4xl font-serif">{stats.users}</div>
        </div>
        <div className="p-6 bg-surface border border-border-accent rounded">
          <div className="flex items-center gap-3 mb-4 text-ink/60 text-sm font-bold uppercase tracking-widest">
            <Activity size={16} /> Aktiewe Geselskap (Chats)
          </div>
          <div className="text-4xl font-serif">{stats.chats}</div>
        </div>
        <div className="p-6 bg-surface border border-border-accent rounded">
          <div className="flex items-center gap-3 mb-4 text-ink/60 text-sm font-bold uppercase tracking-widest">
            <Mail size={16} /> Kontaknavrae
          </div>
          <div className="text-4xl font-serif">{stats.contacts}</div>
        </div>
      </div>
      
      <div className="p-8 border border-border-accent bg-bg/50">
        <h3 className="font-serif text-xl font-bold mb-4">SaaS Insigte</h3>
        <p className="text-ink/70">Wag tans op meer riglyne vir spesifieke SaaS metrieke soos DAU (Daily Active Users), retensie koerse, en MRR indien van toepassing. Tans monitor ons direkte databasis aktiwiteit.</p>
      </div>
    </div>
  );
}

function CommunityDash() {
  const [branches, setBranches] = useState<any[]>([]);
  const [log, setLog] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
       try {
          const bs = await getDocs(collection(db, 'branches'));
          const branchList = bs.docs.map(d => ({id: d.id, ...d.data()}));
          setBranches(branchList);
          
          // load recent threads
          // Without collectionGroup, we can fetch threads from the first few branches for demo
          let recent: any[] = [];
          for (const b of branchList.slice(0, 3)) {
             const ts = await getDocs(query(collection(db, `branches/${b.id}/threads`), orderBy('createdAt', 'desc'), limit(5)));
             recent.push(...ts.docs.map(t => ({id: t.id, branchId: b.id, ...t.data()} as any)));
          }
          recent.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
          setLog(recent);
       } catch (err) {
          console.error(err);
       }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h3 className="font-serif text-2xl font-bold">Forum Insette</h3>
      <div className="p-6 border border-border-accent bg-surface rounded">
         <h4 className="text-sm font-bold uppercase tracking-widest text-ink/60 mb-4">Onlangse Drade</h4>
         {log.length > 0 ? (
           <table className="w-full text-left text-sm">
             <thead>
               <tr className="border-b border-border-accent text-ink/60">
                 <th className="pb-2 font-normal">Titel</th>
                 <th className="pb-2 font-normal">Takkie (Branch)</th>
                 <th className="pb-2 font-normal">Datum</th>
                 <th className="pb-2 font-normal">Upvotes</th>
               </tr>
             </thead>
             <tbody>
               {log.map(t => (
                 <tr key={t.id} className="border-b border-border-accent/50 last:border-0 hover:bg-bg/50">
                    <td className="py-3 font-semibold">{t.title}</td>
                    <td className="py-3 text-ink/70">{t.branchId}</td>
                    <td className="py-3 text-ink/70">{t.createdAt?.toDate().toLocaleDateString() || ''}</td>
                    <td className="py-3">{t.upvotes}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         ) : (
           <p className="text-ink/60">Geen forum drade gevind nie.</p>
         )}
      </div>
    </div>
  );
}

function UserManagementDash() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ displayName: '', bio: '', photoURL: '' });

  useEffect(() => {
    async function load() {
       try {
          const uSnap = await getDocs(collection(db, 'users'));
          setUsers(uSnap.docs.map(d => ({id: d.id, ...d.data()})));
       } catch (err) {
          console.error(err);
       }
    }
    load();
  }, []);

  const handleUpdate = async (id: string, updates: any) => {
     try {
       await updateDoc(doc(db, 'users', id), updates);
       setUsers(prev => prev.map(u => u.id === id ? {...u, ...updates} : u));
     } catch (err) {
       handleFirestoreError(err, OperationType.UPDATE, 'users');
     }
  };

  const handleSaveEdit = async () => {
     if (!editingUser) return;
     await handleUpdate(editingUser.id, editForm);
     setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-2xl font-bold mb-4">Gebruikersbestuur</h3>
      <div className="overflow-x-auto pb-24">
        <table className="w-full text-left text-sm whitespace-nowrap bg-surface border border-border-accent rounded">
          <thead>
            <tr className="border-b border-border-accent bg-bg/50">
               <th className="p-4 font-bold uppercase tracking-widest text-xs text-ink/60">Gebruiker</th>
               <th className="p-4 font-bold uppercase tracking-widest text-xs text-ink/60">Kontak</th>
               <th className="p-4 font-bold uppercase tracking-widest text-xs text-ink/60">Status</th>
               <th className="p-4 font-bold uppercase tracking-widest text-xs text-ink/60">Waarskuwings</th>
               <th className="p-4 font-bold uppercase tracking-widest text-xs text-ink/60">Aksies</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
               <tr key={u.id} className="border-b border-border-accent hover:bg-bg/50 transition-colors">
                 <td className="p-4">
                   <div className="flex items-center gap-3">
                     <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} className="w-8 h-8 rounded-full" />
                     <span className="font-bold">{u.displayName}</span>
                   </div>
                 </td>
                 <td className="p-4 text-ink/70">{u.email}</td>
                 <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                       u.status === 'suspended' ? 'bg-red-500/10 text-red-600' :
                       u.status === 'limbo' ? 'bg-purple-500/10 text-purple-600' :
                       u.status === 'archived' ? 'bg-orange-500/10 text-orange-600' :
                       'bg-green-500/10 text-green-600'
                    }`}>
                       {u.status || 'aktief'}
                    </span>
                 </td>
                 <td className="p-4">
                    <div className="flex items-center gap-2">
                       <AlertTriangle size={14} className={u.warnings > 0 ? 'text-orange-500' : 'text-ink/20'} />
                       <span>{u.warnings || 0}</span>
                    </div>
                 </td>
                 <td className="p-4 flex gap-2">
                    <button 
                       onClick={() => {
                         setEditingUser(u);
                         setEditForm({ displayName: u.displayName || '', bio: u.bio || '', photoURL: u.photoURL || '' });
                       }}
                       className="px-3 py-1 bg-surface border border-border-accent text-xs font-bold hover:bg-bg"
                    >
                       Wysig
                    </button>
                    <button 
                      onClick={() => handleUpdate(u.id, { warnings: (u.warnings || 0) + 1 })}
                      className="px-3 py-1 bg-surface border border-border-accent text-xs font-bold hover:bg-bg"
                      title="Voeg waarskuwing by"
                    >
                      Waarsku
                    </button>
                    {u.status !== 'limbo' && (
                       <button onClick={() => handleUpdate(u.id, { status: 'limbo' })} className="px-3 py-1 bg-purple-600/10 text-purple-700 text-xs font-bold hover:bg-purple-600/20">Limbo</button>
                    )}
                    {u.status === 'suspended' || u.status === 'limbo' ? (
                       <button onClick={() => handleUpdate(u.id, { status: 'active' })} className="px-3 py-1 bg-ink text-ink-inverse text-xs font-bold hover:opacity-90">Heraktiveer</button>
                    ) : (
                       <button onClick={() => handleUpdate(u.id, { status: 'suspended' })} className="px-3 py-1 bg-red-600 text-white text-xs font-bold hover:opacity-90">Skors</button>
                    )}
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-8 max-w-md w-full rounded border border-border-accent relative">
             <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-ink/40 hover:text-ink">✕</button>
             <h3 className="font-serif text-xl font-bold mb-6">Wysig Gebruiker</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">Wysig Naam</label>
                  <input type="text" value={editForm.displayName} onChange={e => setEditForm({...editForm, displayName: e.target.value})} className="w-full bg-bg border border-border-accent p-3 focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">Bio</label>
                  <textarea value={editForm.bio} rows={3} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-bg border border-border-accent p-3 focus:outline-none focus:border-accent"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink/70 mb-2">Foto URL</label>
                  <input type="text" value={editForm.photoURL} onChange={e => setEditForm({...editForm, photoURL: e.target.value})} className="w-full bg-bg border border-border-accent p-3 focus:outline-none focus:border-accent" />
                </div>
                <button onClick={handleSaveEdit} className="w-full bg-ink text-ink-inverse p-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 mt-4">Stoor Veranderinge</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
