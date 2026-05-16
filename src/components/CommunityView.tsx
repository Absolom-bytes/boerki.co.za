import React, { useState, useEffect } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MessageSquare, LogIn, Plus, Users, Key, LogOut } from 'lucide-react';

export function CommunityView() {
  const [user, setUser] = useState<User | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [activeBranch, setActiveBranch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewBranchForm, setShowNewBranchForm] = useState(false);
  
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      
      // Ensure user document exists upon login
      if (u) {
        const userDocRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          try {
            await setDoc(userDocRef, {
              email: u.email,
              displayName: u.displayName || 'Unnamed User',
              photoURL: u.photoURL || '',
              bio: '',
              followersCount: 0,
              followingCount: 0,
              createdAt: serverTimestamp()
            });
          } catch(e) {
            console.error("Could not create user profile", e);
          }
        }
      }
    });
    
    // Fetch Branches initially
    const fetchBranches = async () => {
      try {
        const q = query(collection(db, 'branches'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBranches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBranches(fetchedBranches);
      } catch(e) {
        // Safe fail
        console.error("Could not fetch branches", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();

    return () => unsubAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        // Ignored by user
        return;
      }
      console.error(e);
      alert('Teken in met Google het misluk. Om e-pos outentisering te gebruik, gaan na die Profiel blad in the kieslys.');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleCreateBranch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    try {
      const newDocRef = await addDoc(collection(db, 'branches'), {
        name,
        description,
        creatorId: user.uid,
        adminIds: [user.uid],
        createdAt: serverTimestamp()
      });
      setShowNewBranchForm(false);
      
      // Select the newly created branch
      const newBranch = {
        id: newDocRef.id,
        name,
        description,
        creatorId: user.uid,
        adminIds: [user.uid]
      };
      setBranches([newBranch, ...branches]);
      setActiveBranch(newBranch);
      
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, 'branches');
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-ink/50">Laai gemeenskap...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
      
      {/* Header & Auth */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-2 tracking-tight leading-tight">Gemeenskap</h1>
          <p className="text-lg text-ink/70 leading-relaxed font-light">
            Deel oop opvoedkundige inhoud. Skep besprekings, ontdek hulpbronne, en bou 'n netwerk.
          </p>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4 bg-surface border border-border-accent p-3 rounded shadow-sm">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-10 h-10 rounded-full" alt="avatar" />
            <div>
              <p className="text-sm font-bold text-ink">{user.displayName}</p>
              <button onClick={handleLogout} className="text-xs text-ink/50 hover:text-red-500 flex items-center gap-1">
                <LogOut size={12}/> Teken Uit
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="bg-ink text-ink-inverse px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all hover:opacity-90"
          >
            <LogIn size={16}/> TEKEN IN OM DEEL TE NEEM
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar for Branches */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm tracking-widest text-ink/50 uppercase">Takkies (Forums)</h3>
             {user && (
               <button onClick={() => setShowNewBranchForm(!showNewBranchForm)} className="text-ink hover:text-ink/80 p-1 bg-ink/5 rounded">
                 <Plus size={16}/>
               </button>
             )}
          </div>

          <div className="space-y-2">
             <button 
                onClick={() => setActiveBranch(null)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-bold transition-colors ${!activeBranch ? 'bg-ink text-ink-inverse' : 'bg-surface border border-border-accent text-ink hover:border-accent/40'}`}
             >
                <div className="flex items-center gap-2 mb-1">
                   {/* Main overview */}
                   Oorsig
                </div>
             </button>
             {branches.map(branch => (
               <button 
                 key={branch.id} 
                 onClick={() => setActiveBranch(branch)}
                 className={`w-full text-left px-4 py-3 rounded text-sm transition-colors ${activeBranch?.id === branch.id ? 'bg-ink text-ink-inverse' : 'bg-surface border border-border-accent text-ink hover:border-accent/40'}`}
               >
                 <div className="font-bold flex items-center gap-1.5 mb-1">
                   {branch.name}
                 </div>
                 <div className="text-xs opacity-70 line-clamp-2">
                   {branch.description}
                 </div>
               </button>
             ))}
          </div>
        </div>

        {/* Main Feed Area */}
        <div className="md:col-span-3">
            {showNewBranchForm && !activeBranch ? (
               <div className="bg-surface border border-accent p-6 rounded shadow-sm mb-6">
                 <h2 className="text-xl font-bold mb-4">Skep 'n Nuwe Forum Tak</h2>
                 <form onSubmit={handleCreateBranch} className="space-y-4">
                   <div>
                     <label className="block text-[10px] uppercase font-bold text-ink/60 mb-1">Naam</label>
                     <input name="name" required className="w-full border border-border-accent bg-bg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="bv. Graad 10 Wetenskap" />
                   </div>
                   <div>
                     <label className="block text-[10px] uppercase font-bold text-ink/60 mb-1">Beskrywing</label>
                     <textarea name="description" required rows={3} className="w-full border border-border-accent bg-bg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="Doel of fokus van hierdie tak..." />
                   </div>
                   <button className="bg-ink text-ink-inverse px-4 py-2 font-bold text-[11px] uppercase tracking-widest rounded hover:opacity-90" type="submit">SKEP</button>
                 </form>
               </div>
            ) : activeBranch ? (
              <BranchThreadsView branch={activeBranch} user={user} />
            ) : (
               <div className="bg-surface border border-border-accent p-12 text-center rounded shadow-sm">
                  <Users className="mx-auto text-accent/40 mb-4" size={48}/>
                  <h3 className="text-2xl font-bold mb-2">Kies 'n Tak om te begin</h3>
                  <p className="text-ink/60">Elke tak verteenwoordig 'n spesifieke vakgebied of belangegroep.</p>
               </div>
            )}
        </div>
      </div>
    </div>
  );
}

function BranchThreadsView({ branch, user }: { branch: any, user: User | null }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [showNewThread, setShowNewThread] = useState(false);
  const [activeThread, setActiveThread] = useState<any | null>(null);

  useEffect(() => {
    setActiveThread(null);
    setShowNewThread(false);

    const q = query(
      collection(db, `branches/${branch.id}/threads`),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setThreads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `branches/${branch.id}/threads`);
    });
    
    return unsubscribe;
  }, [branch.id]);

  const handlePostThread = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    try {
      await addDoc(collection(db, `branches/${branch.id}/threads`), {
        title,
        content,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        upvotes: 0,
        commentCount: 0
      });
      setShowNewThread(false);
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, `branches/${branch.id}/threads`);
    }
  };

  if (activeThread) {
    return (
      <ThreadCommentsView 
        branchId={branch.id} 
        thread={activeThread} 
        user={user} 
        onBack={() => setActiveThread(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
       <div className="bg-bg border border-border-accent p-6 rounded shadow-sm mb-6">
         <h2 className="text-2xl font-bold text-ink mb-2">{branch.name}</h2>
         <p className="text-ink/70">{branch.description}</p>
         
         <div className="mt-6 flex justify-between items-center border-t border-border-accent pt-4">
           <span className="text-xs text-ink/50 font-bold uppercase tracking-widest">{threads.length} Gesprekke</span>
           {user && (
             <button onClick={() => setShowNewThread(!showNewThread)} className="bg-ink hover:bg-ink/80 text-ink-inverse text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded">
               SKRYF IETS
             </button>
           )}
         </div>
       </div>

       {showNewThread && (
         <div className="bg-surface border-l-2 border-l-accent border-y border-y-border-accent border-r border-r-border-accent p-6 rounded shadow-sm">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Begin nuwe gesprek</h3>
           <form onSubmit={handlePostThread} className="space-y-4">
             <input name="title" required className="w-full bg-bg border border-border-accent p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none font-bold" placeholder="Titel van gesprek..." />
             <textarea name="content" required rows={4} className="w-full bg-bg border border-border-accent p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="Wat is op jou gedagtes?" />
             <div className="flex gap-2">
               <button type="submit" className="bg-ink text-ink-inverse font-bold text-[11px] uppercase px-4 py-2 rounded hover:opacity-90">Plaas</button>
               <button type="button" onClick={() => setShowNewThread(false)} className="text-ink/60 font-bold text-[11px] uppercase hover:text-ink/90 px-4 py-2">Kanselleer</button>
             </div>
           </form>
         </div>
       )}

       <div className="space-y-4">
         {threads.map(thread => (
           <div 
             key={thread.id} 
             onClick={() => setActiveThread(thread)}
             className="bg-surface border border-border-accent p-5 rounded hover:border-accent/50 cursor-pointer transition-colors shadow-sm group"
           >
             <h4 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{thread.title}</h4>
             <p className="text-ink/70 text-sm line-clamp-2 leading-relaxed mb-4">{thread.content}</p>
             <div className="flex items-center gap-4 text-xs font-bold text-ink/40 uppercase tracking-widest">
               <span>Op {thread.createdAt?.toDate().toLocaleDateString() || '...'}</span>
               <span className="flex items-center gap-1.5 px-2 py-1 bg-bg border border-border-accent rounded"><MessageSquare size={12}/> {thread.commentCount || 0}</span>
               {/* User ID placeholder, full profile integration requires resolving user names */}
               <span>Deur Gebruiker</span>
             </div>
           </div>
         ))}
         {threads.length === 0 && (
           <div className="text-center py-12 text-ink/50">
             Nog geen gesprekke nie. Wees die eerste!
           </div>
         )}
       </div>
    </div>
  );
}

function ThreadCommentsView({ branchId, thread, user, onBack }: { branchId: string, thread: any, user: User | null, onBack: () => void }) {
  const [comments, setComments] = useState<any[]>([]);
  
  useEffect(() => {
    const q = query(
      collection(db, `branches/${branchId}/threads/${thread.id}/comments`),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return unsub;
  }, [branchId, thread.id]);

  const handlePostComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = e.currentTarget;
    const content = (new FormData(form)).get('content') as string;
    
    try {
      await addDoc(collection(db, `branches/${branchId}/threads/${thread.id}/comments`), {
        content,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        upvotes: 0
      });
      form.reset();
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, `comments`);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-accent flex items-center gap-1">
           &larr; Terug na Tak
        </button>
      </div>

      <div className="bg-surface border border-accent rounded shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{thread.title}</h2>
        <div className="text-ink/80 whitespace-pre-wrap leading-relaxed text-sm mb-6">{thread.content}</div>
        <div className="text-xs font-bold text-ink/40 uppercase tracking-widest">
           {thread.createdAt?.toDate().toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-4 pl-4 md:pl-10 relative">
        <div className="absolute left-[16px] md:left-[28px] top-4 bottom-4 w-px bg-border-accent"></div>
        {comments.map(c => (
           <div key={c.id} className="bg-surface border border-border-accent p-4 rounded shadow-sm ml-4 relative z-10">
             <div className="text-sm text-ink/80 mb-2">{c.content}</div>
             <div className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                {c.createdAt?.toDate().toLocaleDateString()}
             </div>
           </div>
        ))}
      </div>

      <div className="mt-8 ml-4 pl-4 md:pl-10">
         {user ? (
           <form onSubmit={handlePostComment} className="flex flex-col gap-2 relative z-10">
             <textarea 
               name="content" required rows={3} 
               className="w-full bg-surface border border-border-accent p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded"
               placeholder="Lewe kommentaar..."
             />
             <div className="self-end">
               <button className="bg-ink text-ink-inverse px-6 py-2 text-[11px] font-bold uppercase tracking-widest rounded shadow-sm hover:-translate-y-0.5 transition-all hover:opacity-90">Plaas Antwoord</button>
             </div>
           </form>
         ) : (
           <div className="text-sm bg-bg border border-border-accent p-3 rounded text-center text-ink/60 relative z-10">
             Teken in om kommentaar te lewe.
           </div>
         )}
      </div>

    </div>
  );
}
