import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function PeerMock() {
  const { user } = useAuthStore();
  const [status,       setStatus]       = useState('idle');
  const [room,         setRoom]         = useState(null);
  const [config,       setConfig]       = useState({ type: 'dsa', difficulty: 'medium' });
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState('');
  const [isInterviewer,setIsInterviewer]= useState(false);
  const [onlineCount,  setOnlineCount]  = useState(0);
  const socketRef  = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    // Determine socket URL — default to same host as API
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const s = io(socketUrl, {
      auth:        { userId: user?._id },
      transports:  ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = s;

    s.on('connect', () => {
      console.log('Socket connected:', s.id);
    });

    s.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      toast.error('Could not connect to peer server — check backend is running');
    });

    s.on('peer:matched', ({ roomId, users, interviewerIndex }) => {
      setRoom(roomId);
      setIsInterviewer(users[interviewerIndex] === user?._id);
      setStatus('matched');
      toast.success('Match found!');
      setTimeout(() => setStatus('active'), 1500);
    });

    s.on('peer:waiting', () => setStatus('waiting'));

    s.on('peer:receive_question', ({ question }) => {
      addMsg('partner', `📋 Question: ${question}`);
    });

    s.on('peer:receive_answer', ({ answer }) => {
      addMsg('partner', answer);
    });

    s.on('peer:receive_feedback', ({ feedback }) => {
      addMsg('system', `⭐ Feedback: ${feedback}`);
    });

    s.on('peer:partner_disconnected', () => {
      toast.error('Your partner disconnected');
      setStatus('idle');
      setRoom(null);
      setMessages([]);
    });

    s.on('peer:session_ended', () => {
      toast('Session ended by partner');
      setStatus('idle');
      setRoom(null);
      setMessages([]);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  // Auto scroll messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const addMsg = (from, text) => {
    setMessages((m) => [...m, { from, text, time: new Date() }]);
  };

  const findMatch = () => {
    if (!socketRef.current?.connected) {
      toast.error('Not connected to server — please refresh the page');
      return;
    }
    socketRef.current.emit('peer:join_queue', { userId: user?._id, ...config });
    setStatus('waiting');
    toast('Searching for a match…');
  };

  const cancel = () => {
    socketRef.current?.emit('peer:leave_queue');
    setStatus('idle');
  };

  const sendMsg = () => {
    if (!input.trim() || !room) return;
    const event  = isInterviewer ? 'peer:send_question' : 'peer:send_answer';
    const payload = isInterviewer
      ? { roomId: room, question: input }
      : { roomId: room, answer: input };
    socketRef.current?.emit(event, payload);
    addMsg('me', input);
    setInput('');
  };

  const endSession = () => {
    socketRef.current?.emit('peer:end_session', { roomId: room });
    setStatus('idle');
    setRoom(null);
    setMessages([]);
  };

  const TYPES = ['dsa', 'system-design', 'behavioral', 'frontend', 'backend'];

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-2xl font-bold mb-2">Peer Mock Interviews</h1>
      <p className="text-[#7a7a8a] text-sm mb-8">
        Practice with real users — take turns as interviewer and candidate
      </p>

      {/* IDLE */}
      {status === 'idle' && (
        <div className="card p-8 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-5">👥</div>
          <h2 className="font-display text-xl font-bold mb-2">Find a Match</h2>
          <p className="text-sm text-[#7a7a8a] mb-6">
            We'll pair you with someone practicing the same topic
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Interview Type</label>
              <select className="input" value={config.type}
                onChange={(e) => setConfig((c) => ({ ...c, type: e.target.value }))}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-1.5">Difficulty</label>
              <select className="input" value={config.difficulty}
                onChange={(e) => setConfig((c) => ({ ...c, difficulty: e.target.value }))}>
                {['easy', 'medium', 'hard'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={findMatch} className="btn-primary w-full justify-center py-3 mb-4">
            🔍 Find Match Now
          </button>

          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              ['👤', 'Real Users',   'Practice with peers'],
              ['🔄', 'Take Turns',   'Interviewer & candidate'],
              ['⭐', 'Peer Rating',  'Build your reputation'],
            ].map(([ico, val, lbl]) => (
              <div key={val} className="bg-bg-4 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{ico}</div>
                <p className="font-medium text-xs">{val}</p>
                <p className="text-[10px] text-[#7a7a8a] mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WAITING */}
      {status === 'waiting' && (
        <div className="card p-8 text-center max-w-lg mx-auto">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Finding your match…</h2>
          <p className="text-sm text-[#7a7a8a] mb-2">
            Looking for someone practicing <strong className="text-white">{config.type.replace('-', ' ')}</strong> ({config.difficulty})
          </p>
          <p className="text-xs text-[#4a4a5a] mb-6">This usually takes under a minute</p>
          <button onClick={cancel} className="btn-outline">Cancel Search</button>
        </div>
      )}

      {/* MATCHED */}
      {status === 'matched' && (
        <div className="card p-8 text-center max-w-lg mx-auto animate-fade-in">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display text-xl font-bold mb-2">Match Found!</h2>
          <p className="text-sm text-[#7a7a8a]">Setting up your session…</p>
          <Spinner size="sm" className="mx-auto mt-4" />
        </div>
      )}

      {/* ACTIVE SESSION */}
      {status === 'active' && (
        <div className="grid grid-cols-5 gap-5">
          {/* Chat */}
          <div className="col-span-3 card p-5 flex flex-col" style={{ minHeight: 500 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${isInterviewer ? 'bg-warn' : 'bg-success'}`} />
              <p className="text-sm font-medium">
                You are: <span className={isInterviewer ? 'text-warn' : 'text-success'}>
                  {isInterviewer ? 'Interviewer 🎤' : 'Candidate 🙋'}
                </span>
              </p>
            </div>

            <p className="text-xs text-[#7a7a8a] mb-4 bg-bg-4 rounded-lg p-2.5">
              {isInterviewer
                ? '💡 Ask your partner a question. Rate their answer when done.'
                : '💡 Answer the question sent by your interviewer clearly and thoroughly.'}
            </p>

            {/* Messages */}
            <div ref={messagesRef}
              className="flex-1 bg-bg-4 rounded-xl p-3 mb-3 overflow-auto space-y-2"
              style={{ minHeight: 200 }}>
              {messages.length === 0 ? (
                <p className="text-xs text-[#4a4a5a] text-center pt-8">
                  {isInterviewer ? 'Send your first question to begin' : 'Waiting for your interviewer…'}
                </p>
              ) : messages.map((m, i) => (
                <div key={i} className={`text-sm ${m.from === 'me' ? 'text-right' : m.from === 'system' ? 'text-center' : ''}`}>
                  {m.from === 'system' ? (
                    <span className="text-xs text-accent-2 bg-accent/10 px-3 py-1 rounded-full">{m.text}</span>
                  ) : (
                    <span className={`inline-block px-3 py-2 rounded-xl max-w-[85%] text-left text-xs leading-relaxed
                      ${m.from === 'me' ? 'bg-accent/20 text-accent-2' : 'bg-bg-3 text-white'}`}>
                      {m.text}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm py-2"
                placeholder={isInterviewer ? 'Type your question…' : 'Type your answer…'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              />
              <button onClick={sendMsg} disabled={!input.trim()} className="btn-primary text-sm py-2 px-4">
                Send
              </button>
            </div>
          </div>

          {/* Session info */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">Session</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7a7a8a]">Type</span>
                  <span className="capitalize">{config.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a8a]">Difficulty</span>
                  <span className="capitalize">{config.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a8a]">Your role</span>
                  <span className={isInterviewer ? 'text-warn' : 'text-success'}>
                    {isInterviewer ? 'Interviewer' : 'Candidate'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-3">Tips</h3>
              <div className="space-y-2 text-xs text-[#7a7a8a] leading-relaxed">
                {isInterviewer ? (
                  <>
                    <p>• Ask one clear question at a time</p>
                    <p>• Give hints if the candidate is stuck</p>
                    <p>• After their answer, provide feedback</p>
                  </>
                ) : (
                  <>
                    <p>• Think out loud as you answer</p>
                    <p>• Cover edge cases and trade-offs</p>
                    <p>• Ask for hints if genuinely stuck</p>
                  </>
                )}
              </div>
            </div>

            <button onClick={endSession}
              className="btn-outline w-full justify-center text-danger border-danger/30 hover:bg-danger/10 text-sm">
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}