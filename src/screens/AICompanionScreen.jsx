import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoSparkles, IcoChevronRight } from '../components/icons'
import { getReadsLocal, computeBaseline } from '../dataService'

const LS_KEY = (catId) => `petmood_ai_chat_${catId}`
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const QUICK_PROMPTS = [
  "Why might Luna be hiding under the bed?",
  "What does it mean when she slow blinks at me?",
  "She's been drinking more water lately — should I be worried?",
  "How can I reduce her stress during vet visits?",
  "Her mood has been changing a lot. What could cause that?",
  "What enrichment activities would suit a calm, older cat?",
]

function generateResponse(userMsg, catName, reads, baseline) {
  const msg = userMsg.toLowerCase()

  if (msg.includes('hid') || msg.includes('under the bed') || msg.includes('hiding')) {
    return `Hiding behavior in cats like ${catName} is usually a stress or anxiety response. Common triggers include:\n\n• **New people or sounds** in the home\n• **Changes in routine** — moving furniture, new smells, schedule shifts\n• **Illness or pain** — hiding is often the first sign a cat feels unwell\n• **Overstimulation** after intense play or handling\n\nIf hiding is sudden and accompanied by other changes (appetite loss, vocalizing, litter box changes), a vet check is wise. Otherwise, give ${catName} time and space, and let them emerge on their own terms.`
  }

  if (msg.includes('slow blink') || msg.includes('blink')) {
    return `Slow blinking is a powerful communication signal in cats — often called the "cat kiss." 😻\n\nWhen ${catName} slow blinks at you:\n• She's signaling **trust and relaxed comfort** in your presence\n• It's her way of saying "I'm not a threat and I trust you"\n• Reciprocating by slow blinking back can **strengthen your bond**\n\nTry initiating slow blinks first — make soft eye contact and slowly close and open your eyes. If she blinks back, that's a genuine moment of connection.`
  }

  if (msg.includes('drink') || msg.includes('water') || msg.includes('thirst')) {
    return `Increased water intake (polydipsia) in cats deserves attention. While it could be minor — like a **dietary change, warmer weather, or increased dry food** — it can also signal:\n\n• **Chronic kidney disease** (CKD) — very common in middle-aged+ cats\n• **Hyperthyroidism** — especially in cats 8+ years old\n• **Diabetes mellitus** — often paired with increased urination\n\nI'd recommend noting:\n- Approximate daily intake (>50ml/kg/day is elevated)\n- Whether urination frequency has also increased\n- Any weight loss, changes in appetite or coat quality\n\nA blood panel and urinalysis will give your vet clarity quickly.`
  }

  if (msg.includes('vet') || msg.includes('carrier') || msg.includes('stress')) {
    return `Vet stress is extremely common in cats — here are evidence-based strategies for ${catName}:\n\n**Before the visit:**\n• Leave the carrier out for weeks beforehand — feed treats and play inside it\n• Use Feliway spray in the carrier 30 min before\n• Don't feed the morning of (reduces car sickness)\n\n**At the clinic:**\n• Cover the carrier with a blanket — visual isolation calms cats\n• Request a quieter waiting area or sit away from dogs\n• Ask for a "Fear Free" or cat-friendly clinic if available\n\n**After:**\n• Allow ${catName} to decompress in a quiet room before rejoining other pets\n• Offer a familiar toy or blanket with your scent`
  }

  if (msg.includes('mood') || msg.includes('chang') || msg.includes('different')) {
    const total = reads.length
    const baselineMood = baseline?.topFeeling
    return `${catName}'s mood changes can stem from many sources.\n\n${baselineMood ? `Based on your readings, ${catName}'s baseline mood tends to be **${baselineMood}** (${baseline.topFeelingPct}% of reads). ` : ''}${total > 5 ? `You've recorded ${total} reads — that's great context.\n\n` : ''}Common causes of mood variability:\n\n• **Seasonal changes** — shorter days, temperature shifts\n• **Environmental changes** — new smells, furniture, routines\n• **Social dynamics** — changes in household, visitors, other pets\n• **Underlying discomfort or illness** — always rule out physical causes first\n• **Hormonal fluctuations** (in unneutered cats)\n\nKeep tracking reads — patterns over 2–4 weeks tell a much richer story than any single observation.`
  }

  if (msg.includes('enrichment') || msg.includes('activities') || msg.includes('bored')) {
    return `Great question! Enrichment for cats like ${catName} can be tailored to their energy level and personality:\n\n**Mental enrichment:**\n• Puzzle feeders — make them "hunt" for kibble\n• Hiding treats around the home\n• Window perches with bird feeders outside\n\n**Physical enrichment:**\n• Wand toys (15–20 min sessions, twice daily)\n• Cat tunnels and paper bags\n• Cat trees and wall shelves for vertical territory\n\n**Sensory enrichment:**\n• Catnip, silvervine, valerian (varies by individual)\n• Cat TV / bird videos\n• Rotating toy selection to prevent boredom\n\nFor a calmer, older cat, prioritize lower-intensity options that still stimulate the mind.`
  }

  // Fallback contextual response
  if (reads.length > 0) {
    return `That's a thoughtful question about ${catName}. Based on your ${reads.length} mood reads, ${catName}'s behavior and emotional state provide some context.\n\nFor more precise guidance, I'd recommend:\n• Describing the specific behavior you're observing\n• Noting when it started and any recent changes in routine\n• Checking with your vet if the behavior involves physical symptoms\n\nKeep logging reads — patterns over time are the most valuable data for understanding your cat.`
  }

  return `I'm Stitch, your AI companion for understanding ${catName}. 🐱\n\nI can help you interpret cat behaviors, mood patterns, health signals, and wellness questions.\n\nTry asking me about:\n• Specific behaviors (hiding, vocalizing, changes in eating)\n• Health concerns and when to call the vet\n• Enrichment and wellbeing tips\n• Understanding ${catName}'s mood data\n\nWhat would you like to know?`
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center flex-shrink-0 mb-1">
          <IcoSparkles size={14} color="white" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-container text-white rounded-br-sm'
            : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-on-surface rounded-bl-sm'
        }`}
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    </div>
  )
}

export default function AICompanionScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef()

  const reads = getReadsLocal(cat.id)
  const baseline = computeBaseline(cat.id)

  useEffect(() => {
    const saved = lsGet(LS_KEY(cat.id)) ?? []
    if (saved.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm Stitch, your AI companion for understanding ${cat.name}. 🐱\n\nI can help you interpret behaviors, mood patterns, and wellness questions. What would you like to explore?`,
      }])
    } else {
      setMessages(saved)
    }
  }, [cat.id, cat.name])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage() {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg = { id: `u_${Date.now()}`, role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(text, cat.name, reads, baseline)
      const aiMsg = { id: `a_${Date.now()}`, role: 'assistant', content: response }
      const final = [...updated, aiMsg]
      setMessages(final)
      lsSet(LS_KEY(cat.id), final)
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4 border-b border-surface-container flex-shrink-0">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
            <IcoSparkles size={14} color="white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-on-surface">Stitch AI</h1>
            <p className="text-[10px] text-on-surface-muted">Ask about {cat.name}</p>
          </div>
        </div>
        <button
          onClick={() => { setMessages([]); lsSet(LS_KEY(cat.id), []) }}
          className="text-xs text-on-surface-muted font-medium active:scale-95 transition-transform"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 flex flex-col gap-4">
        {messages.map((msg) => <Message key={msg.id} msg={msg} />)}
        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center flex-shrink-0 mb-1">
              <IcoSparkles size={14} color="white" />
            </div>
            <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-sm shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-on-surface-muted/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          {QUICK_PROMPTS.slice(0, 3).map((p) => (
            <button
              key={p}
              onClick={() => { setInput(p); setTimeout(() => sendMessage(), 50) }}
              className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium bg-surface-container text-on-surface-muted max-w-48 text-left active:scale-95 transition-transform leading-snug"
            >
              {p.slice(0, 40)}…
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3 border-t border-surface-container bg-surface/90 backdrop-blur-xl flex gap-3 items-end fixed bottom-0 left-0 right-0 z-30 max-w-sm mx-auto"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 12px)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={`Ask about ${cat.name}...`}
          className="flex-1 px-4 py-2.5 rounded-full bg-surface-container text-sm text-on-surface outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform disabled:opacity-40"
        >
          <IcoChevronRight size={16} color="white" />
        </button>
      </div>
    </div>
  )
}
