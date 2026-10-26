import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Lightbulb, HelpCircle, AlertTriangle, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { NoteDocument } from '../../types';
import { FormattedMathText } from '../renderers/KaTeXViewer';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

interface AITutorDrawerProps {
  document: NoteDocument;
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({ document, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'tutor',
      text: `Hello! I am your **Lumixora Academic Tutor** for **${document.topic}** (${document.educationLevel}).\n\nAsk me anything: simplify complex derivations, test you on key concepts, or provide exam-scoring tips!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('eli5') || q.includes('like i\'m 5') || q.includes('simple')) {
        reply = `**Intuitive Concept Breakdown (ELI5)**:\nThink of **${document.topic}** like a family tree or a company organization chart! The CEO at the very top is the **Root**. Every manager below them is an **Internal Node**, and the frontline employees at the very bottom who manage nobody are the **Leaves**.\n\nJust like you wouldn't search every person randomly, hierarchical indexing cuts the search space in half at every level! That is why search runs in logarithmic time $O(\\log n)$ rather than linear $O(n)$!`;
      } else if (q.includes('trap') || q.includes('pitfall') || q.includes('mistake')) {
        reply = `**⚠️ Top 3 University Exam Traps in ${document.topic}**:\n1. **BST Deletion Case 3**: Students often forget that after replacing a node with its Inorder Successor, the successor itself must be deleted from the right subtree!\n2. **AVL Balance Factor Definition**: Always state the formula: $BF(v) = \\text{height}(Left) - \\text{height}(Right) \\in \\{-1, 0, +1\\}$. If $|BF| \\ge 2$, remember whether it's an LL, RR, LR, or RL imbalance!\n3. **Array Indexing (0-indexed vs 1-indexed)**: For 0-based arrays, Left child is $2i + 1$, Right child is $2i + 2$, and Parent is $\\lfloor (i - 1)/2 \\rfloor$. Writing $2i$ and $2i+1$ without specifying 1-based indexing loses 2 marks!`;
      } else if (q.includes('analogy') || q.includes('metaphor')) {
        reply = `**Physical Analogy: The Dual-Pan Balance Scale**\nImagine an AVL tree as a physical dual-pan balance scale. When you add weights, one pan goes down and the other goes up. When the tilt reaches 2 units of imbalance, you don't rebuild the entire scale—you perform a localized mechanical rotation (LL, RR, LR, RL) that immediately re-levels the fulcrum in $O(1)$ constant time!`;
      } else if (q.includes('practice') || q.includes('quiz') || q.includes('test')) {
        reply = `**Self-Assessment Challenge (2 Marks)**:\n**Question**: In a binary search tree of height $h$, under what conditions does search complexity degrade from $O(\\log n)$ to $O(n)$?\n\n*Think for 10 seconds before checking below:*\n> **Answer**: When elements are inserted in monotonically sorted order (e.g. 1, 2, 3, 4, 5), the tree degenerates into a single linear chain (skewed tree). Each node has exactly one child, transforming the tree into a linked list with worst-case search time $O(n)$.`;
      } else {
        reply = `In **${document.topic}**, the core principle centers around maintaining the structural invariant while guaranteeing efficient logarithmic access. All operations—search, insertion, and deletions—are bounded by tree height $h$, which self-balancing architectures (such as AVL and Red-Black trees) preserve at $h \\le 1.44 \\log_2(n + 2)$.\n\nWould you like me to formulate a 10-mark step-by-step derivation for this?`;
      }

      const tutorMsg: Message = {
        id: 'tut-' + Date.now(),
        sender: 'tutor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setIsThinking(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-modal border-l border-slate-200 flex flex-col no-print">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Lumixora AI Tutor</h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active on {document.topic}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Suggested quick chips */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <button
          onClick={() => handleSend("Explain like I'm 5 (ELI5)")}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 whitespace-nowrap transition flex items-center gap-1 font-medium"
        >
          <Sparkles size={11} className="text-indigo-600" />
          <span>ELI5</span>
        </button>
        <button
          onClick={() => handleSend("What are the top exam traps & common mistakes?")}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 whitespace-nowrap transition flex items-center gap-1 font-medium"
        >
          <AlertTriangle size={11} className="text-amber-600" />
          <span>Exam Traps</span>
        </button>
        <button
          onClick={() => handleSend("Give me an intuitive physical analogy")}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 whitespace-nowrap transition flex items-center gap-1 font-medium"
        >
          <Lightbulb size={11} className="text-indigo-600" />
          <span>Analogy</span>
        </button>
        <button
          onClick={() => handleSend("Test me with a quick practice question")}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 whitespace-nowrap transition flex items-center gap-1 font-medium"
        >
          <HelpCircle size={11} className="text-emerald-600" />
          <span>Quick Quiz</span>
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs font-medium'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
              }`}
            >
              <FormattedMathText text={m.text} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 max-w-[70%] shadow-2xs">
            <Sparkles size={14} className="animate-spin text-indigo-600" />
            <span>Analyzing syllabus and formulating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about this topic or exam prep..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40 shadow-xs"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
