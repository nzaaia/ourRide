import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Send, Phone } from 'lucide-react';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, messages, addMessage } = useAuth();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  // Read context from query params: /chat?name=Jamil&context=Suzuki+Gixxer+SF+booking&avatar=URL
  const contactName = searchParams.get('name') || 'Your Rider';
  const contactContext = searchParams.get('context') || 'Active booking';
  const contactAvatar = searchParams.get('avatar') || 'https://i.pravatar.cc/150?u=default';

  const chatMessages = messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMessage('chat1', text, user.id);
    setText('');
    // Mock reply after 2s
    setTimeout(() => {
      addMessage('chat1', 'Got it! See you soon.', 'other-user');
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 0, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10,
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ChevronLeft size={20} />
          </button>
          <img src={contactAvatar} alt={contactName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contactName}</div>
            <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contactContext}</div>
          </div>
        </div>
        <button
          style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <Phone size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, backgroundColor: 'var(--bg-color)' }}>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '8px 0 4px' }}>
          Chat securely. Don't share passwords or NID details.
        </div>

        {chatMessages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 48, fontSize: 14 }}>
            No messages yet — say hi to coordinate!
          </div>
        )}

        {chatMessages.map(msg => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && (
                <img src={contactAvatar} alt={contactName} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 8, alignSelf: 'flex-end', flexShrink: 0 }} />
              )}
              <div style={{
                maxWidth: '72%',
                padding: '10px 14px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: isMe ? 'var(--primary)' : 'var(--surface)',
                color: isMe ? 'white' : 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: 15,
                lineHeight: 1.5,
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        style={{ display: 'flex', gap: 10, padding: '12px 16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}
      >
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Message ${contactName}...`}
          style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1.5px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', fontSize: 15 }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ borderRadius: '50%', width: 46, height: 46, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
