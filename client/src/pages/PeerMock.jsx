import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users, Search, X, Send, Trophy, Mic, UserCheck, Clock3,
  MessageSquare, Sparkles, PhoneOff, Loader2,
} from "lucide-react";

const TYPES = ["dsa", "system-design", "behavioral", "frontend", "backend"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function PeerMock() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState("idle");
  const [room, setRoom] = useState(null);
  const [config, setConfig] = useState({ type: "dsa", difficulty: "medium" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isInterviewer, setIsInterviewer] = useState(false);
  const socketRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const s = io(socketUrl, {
      auth: { userId: user?._id },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = s;

    s.on("connect", () => console.log("Socket connected:", s.id));
    s.on("connect_error", () => toast.error("Could not connect to peer server"));

    s.on("peer:matched", ({ roomId, users, interviewerIndex }) => {
      setRoom(roomId);
      setIsInterviewer(users[interviewerIndex] === user?._id);
      setStatus("matched");
      toast.success("Match found!");
      setTimeout(() => setStatus("active"), 1500);
    });

    s.on("peer:waiting", () => setStatus("waiting"));
    s.on("peer:receive_question", ({ question }) => addMsg("partner", `Question: ${question}`));
    s.on("peer:receive_answer", ({ answer }) => addMsg("partner", answer));
    s.on("peer:receive_feedback", ({ feedback }) => addMsg("system", `Feedback: ${feedback}`));

    s.on("peer:partner_disconnected", () => {
      toast.error("Partner disconnected");
      setStatus("idle"); setRoom(null); setMessages([]);
    });
    s.on("peer:session_ended", () => {
      toast("Session ended");
      setStatus("idle"); setRoom(null); setMessages([]);
    });

    return () => { s.disconnect(); socketRef.current = null; };
  }, [user?._id]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const addMsg = (from, text) => setMessages((m) => [...m, { from, text, time: new Date() }]);

  const findMatch = () => {
    if (!socketRef.current?.connected) { toast.error("Not connected to server"); return; }
    socketRef.current.emit("peer:join_queue", { userId: user?._id, ...config });
    setStatus("waiting");
    toast("Searching for match...");
  };

  const cancel = () => { socketRef.current?.emit("peer:leave_queue"); setStatus("idle"); };

  const sendMsg = () => {
    if (!input.trim() || !room) return;
    const event = isInterviewer ? "peer:send_question" : "peer:send_answer";
    const payload = isInterviewer ? { roomId: room, question: input } : { roomId: room, answer: input };
    socketRef.current?.emit(event, payload);
    addMsg("me", input);
    setInput("");
  };

  const endSession = () => {
    socketRef.current?.emit("peer:end_session", { roomId: room });
    setStatus("idle"); setRoom(null); setMessages([]);
  };

  // ─── IDLE: Find Match ───────────────────────────
  if (status === "idle") return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users size={24} className="text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Peer Mock Interviews</h1>
        </div>
        <p className="text-muted-foreground text-sm">Practice with real users and improve communication skills</p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Users size={40} className="text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Find a Match</h2>
            <p className="text-muted-foreground text-sm">Get paired with someone practicing the same topic</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select value={config.type} onValueChange={(v) => setConfig(c => ({ ...c, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("-", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={config.difficulty} onValueChange={(v) => setConfig(c => ({ ...c, difficulty: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["easy", "medium", "hard"].map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={findMatch} className="w-full">
            <Search size={18} /> Find Match Now
          </Button>

          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {[
              { icon: UserCheck, title: "Real Users", desc: "Practice with peers" },
              { icon: Sparkles, title: "Take Turns", desc: "Interviewer & candidate" },
              { icon: Trophy, title: "Peer Rating", desc: "Build reputation" },
            ].map((f) => (
              <motion.div key={f.title} variants={item}>
                <Card className="bg-muted/50 border-border/40">
                  <CardContent className="p-4 text-center">
                    <f.icon size={24} className="mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );

  // ─── WAITING ────────────────────────────────────
  if (status === "waiting") return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto w-full">
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold mb-2">Finding your match...</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Looking for someone practicing <strong className="text-foreground">{config.type.replace("-", " ")}</strong> ({config.difficulty})
          </p>
          <Button variant="outline" onClick={cancel}><X size={16} /> Cancel Search</Button>
        </CardContent>
      </Card>
    </div>
  );

  // ─── MATCHED ────────────────────────────────────
  if (status === "matched") return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Match Found!</h2>
            <p className="text-muted-foreground">Setting up your session...</p>
            <Loader2 size={20} className="animate-spin mx-auto mt-5 text-primary" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // ─── ACTIVE SESSION ─────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Chat */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col min-h-[600px]">
            <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-4">
                {isInterviewer ? <Mic size={18} className="text-amber-400" /> : <UserCheck size={18} className="text-emerald-400" />}
                <p className="text-sm font-medium">
                  You are: <span className={isInterviewer ? "text-amber-400" : "text-emerald-400"}>
                    {isInterviewer ? "Interviewer" : "Candidate"}
                  </span>
                </p>
              </div>

              <div className="bg-muted rounded-xl p-3 text-xs text-muted-foreground mb-4 leading-relaxed border border-border/40">
                {isInterviewer
                  ? "Ask clear questions and provide helpful feedback."
                  : "Think aloud and explain your approach clearly."}
              </div>

              <div ref={messagesRef} className="flex-1 bg-muted/50 rounded-2xl p-4 overflow-auto space-y-3 mb-4 border border-border/30">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <MessageSquare size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        {isInterviewer ? "Send your first question" : "Waiting for interviewer"}
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "me" ? "justify-end" : m.from === "system" ? "justify-center" : "justify-start"}`}>
                      {m.from === "system" ? (
                        <Badge variant="info" className="text-xs">{m.text}</Badge>
                      ) : (
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          m.from === "me" ? "bg-primary/15 text-primary" : "bg-card text-foreground border border-border/40"
                        }`}>
                          {m.text}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder={isInterviewer ? "Type your question..." : "Type your answer..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg()}
                  className="flex-1"
                />
                <Button onClick={sendMsg} disabled={!input.trim()}>
                  <Send size={16} /> Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{config.type.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="capitalize">{config.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span>{isInterviewer ? "Interviewer" : "Candidate"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock3 size={16} className="text-primary" />
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Tips</h3>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                {isInterviewer ? (
                  <>
                    <p>• Ask one question at a time</p>
                    <p>• Give hints if needed</p>
                    <p>• Evaluate communication</p>
                  </>
                ) : (
                  <>
                    <p>• Think out loud clearly</p>
                    <p>• Discuss trade-offs</p>
                    <p>• Ask clarifying questions</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Button variant="destructive" onClick={endSession} className="w-full">
            <PhoneOff size={16} /> End Session
          </Button>
        </div>
      </div>
    </div>
  );
}
