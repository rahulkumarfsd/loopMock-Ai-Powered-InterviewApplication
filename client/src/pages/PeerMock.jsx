import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Users,
  Search,
  X,
  Send,
  Trophy,
  Mic,
  UserCheck,
  Clock3,
  MessageSquare,
  Sparkles,
  PhoneOff,
  Loader2,
} from 'lucide-react';

import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function PeerMock() {
  const { user } = useAuthStore();

  const [status, setStatus] = useState('idle');
  const [room, setRoom] = useState(null);

  const [config, setConfig] = useState({
    type: 'dsa',
    difficulty: 'medium',
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isInterviewer, setIsInterviewer] = useState(false);

  const socketRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      'http://localhost:5000';

    const s = io(socketUrl, {
      auth: {
        userId: user?._id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = s;

    s.on('connect', () => {
      console.log('Socket connected:', s.id);
    });

    s.on('connect_error', (err) => {
      console.error(err.message);

      toast.error(
        'Could not connect to peer server'
      );
    });

    s.on(
      'peer:matched',
      ({ roomId, users, interviewerIndex }) => {
        setRoom(roomId);

        setIsInterviewer(
          users[interviewerIndex] === user?._id
        );

        setStatus('matched');

        toast.success('Match found!');

        setTimeout(() => {
          setStatus('active');
        }, 1500);
      }
    );

    s.on('peer:waiting', () => {
      setStatus('waiting');
    });

    s.on(
      'peer:receive_question',
      ({ question }) => {
        addMsg(
          'partner',
          `Question: ${question}`
        );
      }
    );

    s.on(
      'peer:receive_answer',
      ({ answer }) => {
        addMsg('partner', answer);
      }
    );

    s.on(
      'peer:receive_feedback',
      ({ feedback }) => {
        addMsg(
          'system',
          `Feedback: ${feedback}`
        );
      }
    );

    s.on('peer:partner_disconnected', () => {
      toast.error('Partner disconnected');

      setStatus('idle');
      setRoom(null);
      setMessages([]);
    });

    s.on('peer:session_ended', () => {
      toast('Session ended');

      setStatus('idle');
      setRoom(null);
      setMessages([]);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const addMsg = (from, text) => {
    setMessages((m) => [
      ...m,
      {
        from,
        text,
        time: new Date(),
      },
    ]);
  };

  const findMatch = () => {
    if (!socketRef.current?.connected) {
      toast.error('Not connected to server');
      return;
    }

    socketRef.current.emit(
      'peer:join_queue',
      {
        userId: user?._id,
        ...config,
      }
    );

    setStatus('waiting');

    toast('Searching for match...');
  };

  const cancel = () => {
    socketRef.current?.emit(
      'peer:leave_queue'
    );

    setStatus('idle');
  };

  const sendMsg = () => {
    if (!input.trim() || !room) return;

    const event = isInterviewer
      ? 'peer:send_question'
      : 'peer:send_answer';

    const payload = isInterviewer
      ? {
          roomId: room,
          question: input,
        }
      : {
          roomId: room,
          answer: input,
        };

    socketRef.current?.emit(event, payload);

    addMsg('me', input);

    setInput('');
  };

  const endSession = () => {
    socketRef.current?.emit(
      'peer:end_session',
      {
        roomId: room,
      }
    );

    setStatus('idle');
    setRoom(null);
    setMessages([]);
  };

  const TYPES = [
    'dsa',
    'system-design',
    'behavioral',
    'frontend',
    'backend',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users
            size={30}
            className="text-accent"
          />

          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Peer Mock Interviews
          </h1>
        </div>

        <p className="text-[#7a7a8a] text-sm sm:text-base">
          Practice with real users and improve
          communication skills
        </p>
      </div>

      {/* IDLE */}
      {status === 'idle' && (
        <div className="card p-6 sm:p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Users
                size={40}
                className="text-accent"
              />
            </div>

            <h2 className="font-display text-2xl font-bold mb-2">
              Find a Match
            </h2>

            <p className="text-[#7a7a8a] text-sm sm:text-base">
              Get paired with someone practicing
              the same topic
            </p>
          </div>

          {/* Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-[#7a7a8a] mb-2">
                Interview Type
              </label>

              <select
                className="input w-full"
                value={config.type}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    type: e.target.value,
                  }))
                }
              >
                {TYPES.map((t) => (
                  <option
                    key={t}
                    value={t}
                  >
                    {t.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#7a7a8a] mb-2">
                Difficulty
              </label>

              <select
                className="input w-full"
                value={config.difficulty}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    difficulty:
                      e.target.value,
                  }))
                }
              >
                {[
                  'easy',
                  'medium',
                  'hard',
                ].map((d) => (
                  <option
                    key={d}
                    value={d}
                  >
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={findMatch}
            className="btn-primary w-full justify-center py-3 text-sm sm:text-base"
          >
            <Search size={18} />
            Find Match Now
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {[
              {
                icon: UserCheck,
                title: 'Real Users',
                desc: 'Practice with peers',
              },
              {
                icon: Sparkles,
                title: 'Take Turns',
                desc: 'Interviewer & candidate',
              },
              {
                icon: Trophy,
                title: 'Peer Rating',
                desc: 'Build reputation',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-bg-4 rounded-2xl p-4 text-center"
              >
                <item.icon
                  size={24}
                  className="mx-auto mb-2 text-accent"
                />

                <p className="font-medium text-sm">
                  {item.title}
                </p>

                <p className="text-xs text-[#7a7a8a] mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WAITING */}
      {status === 'waiting' && (
        <div className="card p-8 max-w-xl mx-auto text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-accent" />

          <h2 className="font-display text-2xl font-bold mb-2">
            Finding your match...
          </h2>

          <p className="text-[#7a7a8a] text-sm mb-6">
            Looking for someone practicing{' '}
            <strong>
              {config.type.replace(
                '-',
                ' '
              )}
            </strong>{' '}
            ({config.difficulty})
          </p>

          <button
            onClick={cancel}
            className="btn-outline"
          >
            <X size={16} />
            Cancel Search
          </button>
        </div>
      )}

      {/* MATCHED */}
      {status === 'matched' && (
        <div className="card p-8 max-w-xl mx-auto text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles
              size={40}
              className="text-success"
            />
          </div>

          <h2 className="font-display text-2xl font-bold mb-2">
            Match Found!
          </h2>

          <p className="text-[#7a7a8a]">
            Setting up your session...
          </p>

          <Spinner
            size="sm"
            className="mx-auto mt-5"
          />
        </div>
      )}

      {/* ACTIVE */}
      {status === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Chat */}
          <div className="lg:col-span-3 card p-4 sm:p-5 flex flex-col min-h-[600px]">
            {/* Role */}
            <div className="flex items-center gap-2 mb-4">
              {isInterviewer ? (
                <Mic
                  size={18}
                  className="text-yellow-400"
                />
              ) : (
                <UserCheck
                  size={18}
                  className="text-green-400"
                />
              )}

              <p className="text-sm font-medium">
                You are:{' '}
                <span
                  className={
                    isInterviewer
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }
                >
                  {isInterviewer
                    ? 'Interviewer'
                    : 'Candidate'}
                </span>
              </p>
            </div>

            {/* Tips */}
            <div className="bg-bg-4 rounded-xl p-3 text-xs text-[#7a7a8a] mb-4 leading-relaxed">
              {isInterviewer
                ? 'Ask clear questions and provide helpful feedback.'
                : 'Think aloud and explain your approach clearly.'}
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex-1 bg-bg-4 rounded-2xl p-4 overflow-auto space-y-3 mb-4"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <MessageSquare
                      size={36}
                      className="mx-auto mb-3 text-[#5a5a6a]"
                    />

                    <p className="text-sm text-[#7a7a8a]">
                      {isInterviewer
                        ? 'Send your first question'
                        : 'Waiting for interviewer'}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.from === 'me'
                        ? 'justify-end'
                        : m.from ===
                          'system'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    {m.from === 'system' ? (
                      <span className="text-xs bg-accent/10 text-accent-2 px-3 py-1 rounded-full">
                        {m.text}
                      </span>
                    ) : (
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          m.from === 'me'
                            ? 'bg-accent/20 text-accent-2'
                            : 'bg-bg-3 text-white'
                        }`}
                      >
                        {m.text}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="input flex-1"
                placeholder={
                  isInterviewer
                    ? 'Type your question...'
                    : 'Type your answer...'
                }
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  sendMsg()
                }
              />

              <button
                onClick={sendMsg}
                disabled={!input.trim()}
                className="btn-primary px-5 justify-center"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Session */}
            <div className="card p-5">
              <h3 className="text-xs uppercase tracking-wider text-[#7a7a8a] mb-4">
                Session
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7a7a8a]">
                    Type
                  </span>

                  <span className="capitalize">
                    {config.type.replace(
                      '-',
                      ' '
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7a7a8a]">
                    Difficulty
                  </span>

                  <span className="capitalize">
                    {config.difficulty}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7a7a8a]">
                    Role
                  </span>

                  <span>
                    {isInterviewer
                      ? 'Interviewer'
                      : 'Candidate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock3
                  size={16}
                  className="text-accent"
                />

                <h3 className="text-xs uppercase tracking-wider text-[#7a7a8a]">
                  Tips
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#7a7a8a] leading-relaxed">
                {isInterviewer ? (
                  <>
                    <p>
                      • Ask one question at a
                      time
                    </p>

                    <p>
                      • Give hints if needed
                    </p>

                    <p>
                      • Evaluate communication
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      • Think out loud clearly
                    </p>

                    <p>
                      • Discuss trade-offs
                    </p>

                    <p>
                      • Ask clarifying questions
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* End */}
            <button
              onClick={endSession}
              className="btn-outline w-full justify-center text-red-400 border-red-400/20 hover:bg-red-400/10"
            >
              <PhoneOff size={16} />
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}