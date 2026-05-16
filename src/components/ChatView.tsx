import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MessageSquare, Send } from 'lucide-react';

export function ChatView() {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
       setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // We want to query chats where user is a member
    const q = query(
      collection(db, 'chats'),
      where('members', 'array-contains', user.uid)
    );
    
    const unsub = onSnapshot(q, async (snapshot) => {
       // Resolve member details
       const chatDocs = await Promise.all(snapshot.docs.map(async (d) => {
          const data = d.data() as any;
          const otherUserId = data.members.find((m: string) => m !== user.uid);
          let otherUser = { displayName: 'Unknown', photoURL: '' };
          if (otherUserId) {
            const userSnap = await getDoc(doc(db, 'users', otherUserId));
            if (userSnap.exists()) {
               otherUser = userSnap.data() as any;
            }
          }
          return { id: d.id, ...data, otherUser, otherUserId };
       }));
       
       // Sort by updatedAt descending locally since firestore requires composite index for where+orderBy
       chatDocs.sort((a, b) => {
          const timeA = a.updatedAt?.toMillis() || 0;
          const timeB = b.updatedAt?.toMillis() || 0;
          return timeB - timeA;
       });
       
       setChats(chatDocs);
    }, (err) => {
       handleFirestoreError(err, OperationType.LIST, 'chats');
    });

    return () => unsub();
  }, [user]);

  if (!user) {
     return (
       <div className="max-w-4xl mx-auto w-full px-6 py-20 text-center">
         <MessageSquare className="mx-auto text-accent/40 mb-6" size={64}/>
         <h1 className="font-serif text-4xl font-bold mb-4">Direkte Boodskappe</h1>
         <p className="text-ink/60 mb-8 max-w-sm mx-auto">Teken in via die Gemeenskap of Profiel bladsy om direkte boodskappe te stuur.</p>
       </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12 md:py-16 flex h-[calc(100vh-64px)]">
      
      {/* Sidebar of Chats */}
      <div className="w-1/3 border-r border-border-accent pr-6 flex flex-col h-full">
         <h1 className="font-serif text-3xl font-bold text-ink mb-6">Boodskappe</h1>
         
         {/* To initiate a chat, we could add a "Nuwe Gesprek" button that lists followers. For brevity, it will just show existing chats open */}
         <div className="flex-1 overflow-y-auto space-y-2">
            {chats.map(chat => (
               <button 
                 key={chat.id}
                 onClick={() => setActiveChat(chat)}
                 className={`w-full text-left p-4 rounded transition-colors flex items-center gap-3 ${activeChat?.id === chat.id ? 'bg-surface border border-accent' : 'hover:bg-surface border border-transparent'}`}
               >
                 <img src={chat.otherUser.photoURL || `https://ui-avatars.com/api/?name=${chat.otherUser.displayName}`} className="w-10 h-10 rounded-full" alt="avatar" />
                 <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{chat.otherUser.displayName}</p>
                    <p className="text-xs text-ink/60 truncate">{chat.lastMessage || '...'}</p>
                 </div>
               </button>
            ))}
            {chats.length === 0 && (
               <p className="text-sm text-ink/50 mt-4">Geen boodskappe nog nie. Volg iemand op hul profiel om 'n gesprek te begin.</p>
            )}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 pl-6 flex flex-col h-full">
         {activeChat ? (
            <MessageThread chat={activeChat} user={user} />
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-ink/40">
               <MessageSquare size={48} className="mb-4" />
               <p>Kies 'n gesprek</p>
            </div>
         )}
      </div>

    </div>
  );
}

function MessageThread({ chat, user }: { chat: any, user: User }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chat.id}/messages`),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
       setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
       // Scroll to bottom
       setTimeout(() => {
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    }, (err) => {
       handleFirestoreError(err, OperationType.LIST, 'messages');
    });
    return () => unsub();
  }, [chat.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      await addDoc(collection(db, `chats/${chat.id}/messages`), {
         senderId: user.uid,
         content,
         read: false,
         createdAt: serverTimestamp()
      });
      // update chat lastMessage
      await updateDoc(doc(db, 'chats', chat.id), {
         lastMessage: content,
         updatedAt: serverTimestamp()
      });
      setContent('');
    } catch(err) {
      handleFirestoreError(err, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-surface border border-border-accent rounded shadow-sm overflow-hidden h-full">
       <div className="p-4 border-b border-border-accent bg-bg flex items-center gap-3">
          <img src={chat.otherUser.photoURL || `https://ui-avatars.com/api/?name=${chat.otherUser.displayName}`} className="w-8 h-8 rounded-full" alt="avatar" />
          <span className="font-bold">{chat.otherUser.displayName}</span>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => {
             const isMe = msg.senderId === user.uid;
             return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg text-sm ${isMe ? 'bg-ink text-ink-inverse rounded-br-none' : 'bg-bg border border-border-accent text-ink rounded-bl-none'}`}>
                     {msg.content}
                     <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-ink/40'}`}>
                        {msg.createdAt?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </div>
                  </div>
               </div>
             )
          })}
          <div ref={endRef} />
       </div>

       <div className="p-4 bg-bg border-t border-border-accent">
          <form onSubmit={handleSend} className="flex gap-2">
             <input 
               value={content}
               onChange={e => setContent(e.target.value)}
               className="flex-1 border border-border-accent bg-surface p-3 text-sm focus:border-accent outline-none rounded"
               placeholder="Tik 'n boodskap..."
             />
             <button type="submit" disabled={!content.trim()} className="bg-ink text-ink-inverse px-4 rounded disabled:opacity-50 hover:opacity-90">
               <Send size={18} />
             </button>
          </form>
       </div>
    </div>
  );
}
