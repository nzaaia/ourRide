import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Send, Phone, Bot } from 'lucide-react';

export default function Chat() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const actualChatId = chatId || 'chat1';
  
  const { user, messages, addMessage, data, renterBookingRequests, activePassengerRides } = useAuth();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const chatMessages = messages.filter(m => m.chatId === actualChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, actualChatId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMessage(actualChatId, text, user.id);
    setText('');
  };

  // Find other participant's name based on booking requests
  const relatedBooking = renterBookingRequests.find(r => r.requestId === actualChatId || r.id === actualChatId)
    || data.incomingRequests.find(r => r.id === actualChatId);
    
  const relatedPassengerRide = activePassengerRides?.find(r => r.id === actualChatId) 
    || (data.myActiveRideRequest?.id === actualChatId ? data.myActiveRideRequest : null);
    
  let otherName = 'Chat';
  let otherAvatar = 'https://i.pravatar.cc/150';
  
  if (relatedBooking) {
    if (relatedBooking.renterId === user.id || relatedBooking.renterName === user.name) {
      otherName = relatedBooking.ownerName || 'Owner';
      otherAvatar = relatedBooking.ownerAvatar || otherAvatar;
    } else {
      otherName = relatedBooking.renterName || 'Renter';
      otherAvatar = relatedBooking.renterAvatar || otherAvatar;
    }
  } else if (relatedPassengerRide) {
    if (relatedPassengerRide.passengerId === user.id) {
      // Current user is the passenger, chatting with renter
      otherName = relatedPassengerRide.counterOffer?.renterName || 'Rider';
      otherAvatar = 'https://i.pravatar.cc/150'; // Rider avatar isn't explicitly saved in ride_requests right now
    } else {
      // Current user is the renter, chatting with passenger
      otherName = relatedPassengerRide.passengerName || 'Passenger';
      otherAvatar = relatedPassengerRide.passengerAvatar || otherAvatar;
    }
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: 0, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px', border: 'none' }}>
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img src={otherAvatar} alt={otherName} className="avatar" style={{ width: '40px', height: '40px' }} />
            <div>
              <div className="font-bold">{otherName}</div>
              <div className="text-sm text-primary">Active thread</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '50%' }} onClick={() => addMessage(actualChatId, 'Got it! See you soon.', 'other-user')} title="Simulate Reply (Demo Mode)">
            <Bot size={20} />
          </button>
          <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '50%' }}>
            <Phone size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: 'var(--bg-color)' }}>
        <div className="text-center text-sm text-muted mb-4">Chat securely with your passenger/rider. Do not share personal passwords.</div>
        
        {chatMessages.length === 0 && (
          <div className="text-center text-muted flex items-center justify-center h-full">No messages yet. Send a message to coordinate!</div>
        )}

        {chatMessages.map(msg => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                backgroundColor: isMe ? 'var(--primary)' : 'var(--surface)',
                color: isMe ? 'white' : 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2" style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
        <input 
          type="text" 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', outline: 'none' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
