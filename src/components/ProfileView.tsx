import React, { useState, useEffect } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp, onSnapshot, addDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LogIn, User as UserIcon, LogOut, Check, Users } from 'lucide-react';

export function ProfileView({ navigate }: { navigate: (v: string) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
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

  const handleLogin = async () => {
     try {
       await signInWithPopup(auth, new GoogleAuthProvider());
     } catch (e) {
       console.error(e);
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
       <div className="max-w-4xl mx-auto w-full px-6 py-20 text-center">
         <UserIcon className="mx-auto text-accent/40 mb-6" size={64}/>
         <h1 className="font-serif text-4xl font-bold mb-4">My Profiel</h1>
         <p className="text-ink/60 mb-8 max-w-sm mx-auto">Teken in om jou profiel te bestuur, ander gebruikers te volg, en jou inligting op te dateer.</p>
         <button onClick={handleLogin} className="bg-accent text-white px-8 py-3 rounded text-[11px] font-bold uppercase tracking-widest shadow-md inline-flex items-center gap-2">
           <LogIn size={16}/> Teken In
         </button>
       </div>
     );
  }

  if (!profile) return <div className="p-20 text-center">LAAI PROFIEL...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl font-bold text-ink mb-10 tracking-tight">My Profiel</h1>
      
      <div className="bg-surface border border-border-accent rounded p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-start">
         <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} className="w-24 h-24 rounded-full border border-border-accent" alt="avatar" />
         
         <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.displayName}</h2>
            <p className="text-ink/60 text-sm mb-4">{profile.email}</p>
            
            <div className="flex gap-4 mb-6 text-sm font-bold">
               <div className="flex items-center gap-1.5"><Users size={16} className="text-accent"/> {profile.followersCount || 0} Volgelinge</div>
               <div className="text-ink/40">•</div>
               <div>{profile.followingCount || 0} Volgend</div>
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
                   <button onClick={handleSaveBio} className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded">Stoor</button>
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
      
      {/* Directory of all users to follow */}
      <div className="mt-12">
        <h3 className="font-serif text-2xl font-bold mb-6 border-b border-border-accent pb-2">Ontdek Ander Gebruikers</h3>
        <UserDirectory currentUser={profile} />
      </div>

    </div>
  );
}

function UserDirectory({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    // we just fetch all for now, in a real production environment this should be paginated
    getDocs(q).then(snapshot => {
       const u = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(user => user.id !== currentUser.id);
       setUsers(u);
    });
  }, [currentUser.id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {users.map(u => (
          <UserCard key={u.id} user={u} currentUser={currentUser} />
       ))}
    </div>
  );
}

function UserCard({ user, currentUser }: { user: any, currentUser: any }) {
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

  const toggleFollow = async () => {
    // Basic optimisitic UI could be added, but for now just raw calls
    try {
       const followingRef = doc(db, `users/${currentUser.id}/following/${user.id}`);
       const followerRef = doc(db, `users/${user.id}/followers/${currentUser.id}`);
       
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
      // Very naive implementation: check if chat exists, if not create one.
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
      
      alert("Gaan na 'Boodskappe' in die kieslys om te gesels.");
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, 'chats');
    }
  };

  return (
    <div className="bg-surface border border-border-accent p-4 rounded shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
         <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-10 h-10 rounded-full" alt="avatar" />
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
           className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded ${isFollowing ? 'bg-bg text-ink/70 border border-border-accent' : 'bg-accent text-white'}`}
         >
           {isFollowing ? 'Volg Klaar' : 'Volg'}
         </button>
      </div>
    </div>
  );
}
