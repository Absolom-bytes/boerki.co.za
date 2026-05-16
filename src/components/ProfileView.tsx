import React, { useState, useEffect } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp, onSnapshot, addDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LogIn, User as UserIcon, LogOut, Check, Users, Award, Star, Zap, ShieldCheck } from 'lucide-react';

export function ProfileView({ navigate }: { navigate: (v: string) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'followers' | 'following'>('profile');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  useEffect(() => {
    setPersistence(auth, inMemoryPersistence).catch(console.error);
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        // Ensure user document exists before attaching snapshot
        const userSnap = await getDoc(docRef);
        if (!userSnap.exists()) {
          try {
            await setDoc(docRef, {
              email: u.email,
              displayName: u.displayName || 'Unnamed User',
              photoURL: u.photoURL || '',
              bio: '',
              followersCount: 0,
              followingCount: 0,
              createdAt: serverTimestamp()
            });
          } catch(e) {
            console.error(e);
          }
        }
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ id: docSnap.id, ...docSnap.data() });
            setBio(docSnap.data().bio || '');
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'users');
        });
        return () => unsubscribe();
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
     try {
       await signInWithPopup(auth, new GoogleAuthProvider());
     } catch (e: any) {
       if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
         return;
       }
       console.error(e);
       alert('Teken in met Google het misluk. Probeer asseblief weer.');
     }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
            const confirmSignup = window.confirm("Onbekende e-posadres of wagwoord. Wil jy 'n nuwe rekening skep met skep met hierdie inligting?");
            if (confirmSignup) {
               await createUserWithEmailAndPassword(auth, email, password);
            }
          } else {
             alert('Outentisering misluk: ' + (err.message || 'Onbekende fout'));
          }
        }
      } else {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            const confirmLogin = window.confirm("Hierdie e-posadres is reeds geregistreer. Wil jy daarmee inteken?");
            if (confirmLogin) {
               await signInWithEmailAndPassword(auth, email, password);
            }
          } else {
             alert('Outentisering misluk: ' + (err.message || 'Onbekende fout'));
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        alert("E-posadres is reeds geregistreer. Kies 'n ander een of teken in.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        alert('Verkeerde wagwoord of e-posadres. Probeer asseblief weer.');
      } else if (err.code === 'auth/too-many-requests') {
        alert('Te veel pogings. Probeer asseblief later weer.');
      } else if (err.code === 'auth/weak-password') {
        alert("Die wagwoord is te swak. Kies asseblief 'n sterker wagwoord (gewoonlik 6 of meer karakters).");
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      } else {
        alert('Outentisering misluk: ' + (err.message || 'Onbekende fout'));
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Voer asseblief jou e-posadres in die e-pos blokkie in eers.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Wagwoord herstel e-pos is gestuur! Kyk asseblief in jou inkassie.");
    } catch (err: any) {
      alert("Kon nie e-pos stuur nie: " + err.message);
    }
  };

  const handleSaveBio = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio
      });
      setEditing(false);
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    }
  };

  if (!user) {
     return (
       <div className="max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center">
         <UserIcon className="text-accent/40 mb-6" size={64}/>
         <h1 className="font-serif text-4xl font-bold mb-4">Welkom By BOERki</h1>
         <p className="text-ink/60 mb-8 max-w-sm text-center">Teken in om jou profiel te bestuur, ander gebruikers te volg, en jou inligting op te dateer.</p>
         
         <form onSubmit={handleEmailAuth} className="w-full max-w-sm flex flex-col gap-4 bg-surface p-6 rounded shadow-sm border border-border-accent mb-6">
           <h2 className="text-xl font-bold text-center mb-2">{isLogin ? 'Teken In' : 'Skep Rekening'}</h2>
           <input 
             type="email" 
             value={email}
             onChange={e => setEmail(e.target.value)}
             placeholder="E-posadres" 
             className="w-full border border-border-accent bg-bg p-3 text-sm focus:border-accent outline-none rounded"
             required
           />
           <input 
             type="password" 
             value={password}
             onChange={e => setPassword(e.target.value)}
             placeholder="Wagwoord" 
             className="w-full border border-border-accent bg-bg p-3 text-sm focus:border-accent outline-none rounded"
             required
             minLength={6}
           />
           <button type="submit" className="bg-ink text-ink-inverse px-4 py-3 rounded text-[11px] font-bold uppercase tracking-widest shadow-md hover:opacity-90 transition-all">
             {isLogin ? 'Teken In' : 'Registreer'}
           </button>
           {isLogin && (
             <button type="button" onClick={handlePasswordReset} className="text-xs text-ink/60 hover:text-accent mt-1">
               Wagwoord vergeet?
             </button>
           )}
           <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs text-ink/60 hover:text-accent mt-2">
             {isLogin ? 'Skep liewer \'n nuwe rekening' : 'Het jy reeds \'n rekening? Teken in'}
           </button>
         </form>

         <div className="flex items-center gap-4 w-full max-w-sm mb-6">
           <div className="h-px bg-border-accent flex-1"></div>
           <span className="text-xs font-bold text-ink/40 uppercase tracking-widest">OF</span>
           <div className="h-px bg-border-accent flex-1"></div>
         </div>

         <button onClick={handleGoogleLogin} className="w-full max-w-sm bg-surface border border-border-accent text-ink px-8 py-3 rounded text-[11px] font-bold uppercase tracking-widest shadow-sm inline-flex items-center justify-center gap-2 hover:bg-bg transition-colors">
           <LogIn size={16}/> Teken In Met Google
         </button>
       </div>
     );
  }

  if (!profile) return <div className="p-20 text-center">LAAI PROFIEL...</div>;

  if (selectedUserId && selectedUserId !== profile.id) {
    return (
       <OtherUserProfileView 
         userId={selectedUserId} 
         currentUser={profile} 
         navigate={navigate}
         onBack={() => setSelectedUserId(null)} 
       />
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl font-bold text-ink mb-10 tracking-tight">My Profiel</h1>
      
      <div className="bg-surface border border-border-accent rounded p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-start">
         <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} className="w-24 h-24 rounded-full border border-border-accent bg-white" alt="avatar" />
         
         <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.displayName}</h2>
            <p className="text-ink/60 text-sm mb-4">{profile.email}</p>
            
            <div className="flex gap-4 mb-6 text-sm font-bold">
               <button onClick={() => setActiveTab('followers')} className="flex items-center gap-1.5 hover:text-accent transition-colors"><Users size={16} className="text-accent"/> {profile.followersCount || 0} Volgelinge</button>
               <div className="text-ink/40">•</div>
               <button onClick={() => setActiveTab('following')} className="hover:text-accent transition-colors">{profile.followingCount || 0} Volgend</button>
            </div>

            {editing ? (
               <div className="space-y-4 max-w-md">
                 <textarea 
                   rows={3} 
                   value={bio} 
                   onChange={(e) => setBio(e.target.value)}
                   className="w-full border border-border-accent bg-bg p-3 text-sm focus:border-accent outline-none rounded"
                   placeholder="Vertel ons oor jouself..."
                 />
                 <div className="flex gap-2">
                   <button onClick={handleSaveBio} className="bg-ink text-ink-inverse text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:opacity-90">Stoor</button>
                   <button onClick={() => setEditing(false)} className="text-ink/60 text-[10px] font-bold uppercase tracking-widest px-4 py-2">Kanselleer</button>
                 </div>
               </div>
            ) : (
               <div>
                  <p className="text-ink/80 text-sm leading-relaxed max-w-lg whitespace-pre-wrap">{profile.bio || "Geen addisionele inligting beskikbaar nie."}</p>
                  <button onClick={() => setEditing(true)} className="text-accent text-[11px] font-bold uppercase tracking-widest mt-4">Redigeer Bio</button>
               </div>
            )}
         </div>
         
         <div className="md:ml-auto">
            <button onClick={() => signOut(auth)} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
               <LogOut size={14}/> Teken Uit
            </button>
         </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-accent mb-8">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'border-b-2 border-accent text-ink' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Oorsig
        </button>
        <button 
          onClick={() => setActiveTab('followers')}
          className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'followers' ? 'border-b-2 border-accent text-ink' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Volgelinge
        </button>
        <button 
          onClick={() => setActiveTab('following')}
          className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'following' ? 'border-b-2 border-accent text-ink' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Volgend
        </button>
      </div>

      {activeTab === 'profile' && (
        <>
          <div className="mt-8 mb-12">
             <ProfileBadges badges={profile.badges || []} />
          </div>
          <div className="mt-12">
            <h3 className="font-serif text-2xl font-bold mb-6 border-b border-border-accent pb-2">Ontdek Ander Gebruikers</h3>
            <UserDirectory currentUser={profile} mode="discover" onUserClick={setSelectedUserId} navigate={navigate} />
          </div>
        </>
      )}

      {activeTab === 'followers' && (
        <div className="mt-8">
          <h3 className="font-serif text-2xl font-bold mb-6 border-b border-border-accent pb-2">Jou Volgelinge</h3>
          <UserDirectory currentUser={profile} mode="followers" onUserClick={setSelectedUserId} navigate={navigate} />
        </div>
      )}

      {activeTab === 'following' && (
        <div className="mt-8">
          <h3 className="font-serif text-2xl font-bold mb-6 border-b border-border-accent pb-2">Mense wat jy volg</h3>
          <UserDirectory currentUser={profile} mode="following" onUserClick={setSelectedUserId} navigate={navigate} />
        </div>
      )}

    </div>
  );
}

function ProfileBadges({ badges }: { badges: string[] }) {
  // A mock list of possible achievements to gamify engagement
  const possibleBadges = [
    { id: 'pioneer', name: 'Pionier', desc: 'Een van die eerste BOERki lede', icon: <Star size={20} className="text-yellow-500" />, color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700' },
    { id: 'contributor', name: 'Bydraer', desc: 'Het bygedra tot die gemeenskap', icon: <Award size={20} className="text-blue-500" />, color: 'bg-blue-500/10 border-blue-500/20 text-blue-700' },
    { id: 'mentor', name: 'Mentor', desc: 'Help ander op die platform', icon: <ShieldCheck size={20} className="text-green-500" />, color: 'bg-green-500/10 border-green-500/20 text-green-700' },
    { id: 'active', name: 'Aktief', desc: 'Bly deurlopend betrokke', icon: <Zap size={20} className="text-orange-500" />, color: 'bg-orange-500/10 border-orange-500/20 text-orange-700' }
  ];

  // For demo: if user has no badges, we give them Pioneer and Active automatically
  const activeBadges = badges.length > 0 
    ? possibleBadges.filter(b => badges.includes(b.id)) 
    : [possibleBadges[0], possibleBadges[3]];

  return (
    <div className="bg-surface border border-border-accent rounded p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Award className="text-accent" size={24} />
        <h3 className="font-serif text-2xl font-bold text-ink">Prestasies & Kentekens</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {activeBadges.map(badge => (
          <div key={badge.id} className={`flex flex-col items-center text-center p-4 rounded-xl border ${badge.color}`}>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              {badge.icon}
            </div>
            <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserDirectory({ currentUser, mode, onUserClick, navigate }: { currentUser: any, mode: 'discover' | 'followers' | 'following', onUserClick: (id: string) => void, navigate: (v: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (mode === 'discover') {
          const q = query(collection(db, 'users'));
          const snapshot = await getDocs(q);
          const u = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(user => user.id !== currentUser.id);
          setUsers(u);
        } else if (mode === 'followers') {
          const snapshot = await getDocs(collection(db, `users/${currentUser.id}/followers`));
          const userIds = snapshot.docs.map(doc => doc.id);
          if (userIds.length > 0) {
            const u = [];
            for (const uid of userIds) {
               const docSnap = await getDoc(doc(db, 'users', uid));
               if (docSnap.exists()) {
                 u.push({ id: docSnap.id, ...docSnap.data() });
               }
            }
            setUsers(u);
          } else {
            setUsers([]);
          }
        } else if (mode === 'following') {
          const snapshot = await getDocs(collection(db, `users/${currentUser.id}/following`));
          const userIds = snapshot.docs.map(doc => doc.id);
          if (userIds.length > 0) {
            const u = [];
            for (const uid of userIds) {
               const docSnap = await getDoc(doc(db, 'users', uid));
               if (docSnap.exists()) {
                 u.push({ id: docSnap.id, ...docSnap.data() });
               }
            }
            setUsers(u);
          } else {
            setUsers([]);
          }
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [currentUser.id, mode]);

  if (users.length === 0) {
    if (mode === 'followers') return <div className="text-ink/50 text-sm">Jy het nog geen volgelinge nie.</div>;
    if (mode === 'following') return <div className="text-ink/50 text-sm">Jy volg nog niemand nie.</div>;
    return <div className="text-ink/50 text-sm">Geen ander gebruikers gevind nie.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {users.map(u => (
          <UserCard key={u.id} user={u} currentUser={currentUser} onClick={() => onUserClick(u.id)} navigate={navigate} />
       ))}
    </div>
  );
}

function UserCard({ user, currentUser, onClick, navigate }: { user: any, currentUser: any, onClick: () => void, navigate: (v: string) => void, key?: React.Key }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Check if following
    const checkFollowing = async () => {
      const docRef = doc(db, `users/${currentUser.id}/following/${user.id}`);
      const docSnap = await getDoc(docRef);
      setIsFollowing(docSnap.exists());
    };
    checkFollowing();
  }, [currentUser.id, user.id]);

  const toggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
       const followingRef = doc(db, `users/${currentUser.id}/following/${user.id}`);
       const followerRef = doc(db, `users/${user.id}/followers/${currentUser.id}`);
       
       if (isFollowing) {
          await deleteDoc(followingRef);
          await deleteDoc(followerRef);
          // Also decrement counts (omitted in this basic demo, but usually you'd use a transaction or cloud function)
          // Since we aren't doing atomic counters in this specific function without more code, we just delete doc.
          setIsFollowing(false);
       } else {
          await setDoc(followingRef, { createdAt: serverTimestamp() });
          await setDoc(followerRef, { createdAt: serverTimestamp() });
          setIsFollowing(true);
       }
    } catch(err) {
       handleFirestoreError(err, OperationType.WRITE, 'following');
    }
  };

  const startChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const q = query(collection(db, 'chats'), where('members', 'array-contains', currentUser.id));
      const snap = await getDocs(q);
      let existingChat = null;
      snap.docs.forEach(d => {
         const data = d.data();
         if (data.members.includes(user.id)) {
            existingChat = d;
         }
      });

      if (!existingChat) {
         await addDoc(collection(db, 'chats'), {
            members: [currentUser.id, user.id],
            lastMessage: '',
            updatedAt: serverTimestamp()
         });
      }
      
      navigate("boodskappe");
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, 'chats');
    }
  };

  return (
    <div 
      className="bg-surface border border-border-accent p-4 rounded shadow-sm flex items-center justify-between cursor-pointer hover:border-accent transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
         <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-10 h-10 rounded-full bg-white" alt="avatar" />
         <div>
            <p className="font-bold text-sm text-ink">{user.displayName}</p>
         </div>
      </div>
      <div className="flex items-center gap-2">
         <button 
           onClick={startChat}
           className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded bg-bg text-ink/70 border border-border-accent hover:border-accent"
         >
           Gesels
         </button>
         <button 
           onClick={toggleFollow}
           className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${isFollowing ? 'bg-bg text-ink/70 border border-border-accent' : 'bg-ink text-ink-inverse hover:opacity-90'}`}
         >
           {isFollowing ? 'Volg Klaar' : 'Volg'}
         </button>
      </div>
    </div>
  );
}

function OtherUserProfileView({ userId, currentUser, onBack, navigate }: { userId: string, currentUser: any, onBack: () => void, navigate: (v: string) => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', userId), (docSnap) => {
       if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() });
       }
    });

    const checkFollowing = async () => {
      const docRef = doc(db, `users/${currentUser.id}/following/${userId}`);
      const docSnap = await getDoc(docRef);
      setIsFollowing(docSnap.exists());
    };
    checkFollowing();

    return () => unsub();
  }, [userId, currentUser.id]);

  const toggleFollow = async () => {
    try {
       const followingRef = doc(db, `users/${currentUser.id}/following/${userId}`);
       const followerRef = doc(db, `users/${userId}/followers/${currentUser.id}`);
       
       if (isFollowing) {
          await deleteDoc(followingRef);
          await deleteDoc(followerRef);
          setIsFollowing(false);
       } else {
          await setDoc(followingRef, { createdAt: serverTimestamp() });
          await setDoc(followerRef, { createdAt: serverTimestamp() });
          setIsFollowing(true);
       }
    } catch(err) {
       handleFirestoreError(err, OperationType.WRITE, 'following');
    }
  };

  const startChat = async () => {
    try {
      const q = query(collection(db, 'chats'), where('members', 'array-contains', currentUser.id));
      const snap = await getDocs(q);
      let existingChat = null;
      snap.docs.forEach(d => {
         const data = d.data();
         if (data.members.includes(userId)) {
            existingChat = d;
         }
      });

      if (!existingChat) {
         await addDoc(collection(db, 'chats'), {
            members: [currentUser.id, userId],
            lastMessage: '',
            updatedAt: serverTimestamp()
         });
      }
      
      navigate("boodskappe");
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, 'chats');
    }
  };

  if (!profile) return <div className="p-20 text-center">LAAI PROFIEL...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
      <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-accent flex items-center gap-1 mb-6">
         &larr; Terug na My Profiel
      </button>

      <div className="bg-surface border border-border-accent rounded p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-start">
         <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} className="w-24 h-24 rounded-full border border-border-accent bg-white" alt="avatar" />
         
         <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.displayName}</h2>
            <div className="flex gap-4 mb-6 mt-2 text-sm font-bold">
               <div className="flex items-center gap-1.5"><Users size={16} className="text-accent"/> {profile.followersCount || 0} Volgelinge</div>
               <div className="text-ink/40">•</div>
               <div>{profile.followingCount || 0} Volgend</div>
            </div>

            <div>
               <p className="text-ink/80 text-sm leading-relaxed max-w-lg whitespace-pre-wrap">{profile.bio || "Geen addisionele inligting beskikbaar nie."}</p>
            </div>
         </div>
         
         <div className="md:ml-auto flex flex-col gap-2">
            <button 
              onClick={startChat}
              className="px-4 py-2 text-[11px] uppercase font-bold tracking-widest rounded bg-bg text-ink border border-border-accent hover:border-accent text-center"
            >
              Gesels
            </button>
            <button 
              onClick={toggleFollow}
              className={`px-4 py-2 text-[11px] uppercase font-bold tracking-widest rounded transition-all text-center ${isFollowing ? 'bg-bg text-ink/70 border border-border-accent' : 'bg-ink text-ink-inverse hover:opacity-90'}`}
            >
              {isFollowing ? 'Volg Klaar' : 'Volg'}
            </button>
         </div>
      </div>
      
      <div className="mt-8 mb-12">
         <ProfileBadges badges={profile.badges || []} />
      </div>

    </div>
  );
}
