import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { FaPaperPlane, FaTimes, FaTrash } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { useAgentStore } from '../../store/agentStore';
import { useThemeStore } from '../../store/themeStore';
import { MEDHAT_SYSTEM_PROMPT, AGENT_SUGGESTIONS, getLocalReply } from '../../data/agentPersonality';

// ─────────────────────────────────────────────────────────────
//  3D Avatar — indigo / purple / pink to match portfolio theme
// ─────────────────────────────────────────────────────────────
const Avatar3D = ({ isThinking, isTalking }) => {
  const coreRef  = useRef();
  const wireRef  = useRef();
  const ringsRef = useRef();
  const glowRef  = useRef();
  const dustRef  = useRef();

  const dustPositions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.0 + Math.random() * 0.8;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t     = clock.elapsedTime;
    const speed = isThinking ? 2.6 : isTalking ? 1.5 : 0.4;

    if (coreRef.current) {
      coreRef.current.rotation.y = t * speed;
      coreRef.current.rotation.x = Math.sin(t * 0.38) * 0.14;
      if (coreRef.current.material) {
        coreRef.current.material.distort = isTalking
          ? 0.42 + Math.sin(t * 8) * 0.16
          : isThinking
            ? 0.32 + Math.sin(t * 4.5) * 0.1
            : 0.16 + Math.sin(t * 1.4) * 0.04;
      }
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * speed * 0.6;
      wireRef.current.rotation.z =  t * 0.17;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * 0.26;
      ringsRef.current.rotation.z = t * 0.19;
      const p = 1 + Math.sin(t * (isThinking ? 5 : 1.8)) * 0.055;
      ringsRef.current.scale.setScalar(p);
    }
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = 0.22 + Math.sin(t * (isThinking ? 5.5 : 1.8)) * 0.08;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = -t * (isThinking ? 0.85 : 0.2);
      dustRef.current.rotation.x = Math.sin(t * 0.22) * 0.1;
      if (dustRef.current.material) {
        dustRef.current.material.opacity = isThinking
          ? 0.55 + Math.abs(Math.sin(t * 6)) * 0.35
          : 0.38;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]}   intensity={2.2} color="#6366F1" />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color="#8B5CF6" />
      <pointLight position={[0, -3, 1]}  intensity={0.7} color="#EC4899" />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.45}>
        {/* Core — indigo */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial
            color="#6366F1"
            emissive="#4338CA"
            emissiveIntensity={1.1}
            distort={0.16}
            speed={isThinking ? 6 : isTalking ? 4 : 2}
            metalness={0.85}
            roughness={0.1}
            transparent
            opacity={0.96}
          />
        </mesh>

        {/* Inner glow — soft purple */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.62, 16, 16]} />
          <meshBasicMaterial
            color="#A78BFA"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Wireframe cage */}
        <mesh ref={wireRef}>
          <sphereGeometry args={[0.84, 10, 10]} />
          <meshBasicMaterial color="#C4B5FD" wireframe transparent opacity={0.12} />
        </mesh>
      </Float>

      {/* Orbital rings — indigo / purple / pink */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.22, 0.02, 8, 80]} />
          <meshBasicMaterial color="#6366F1" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 3.6, Math.PI / 5, 0]}>
          <torusGeometry args={[1.44, 0.014, 8, 80]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[Math.PI / 6, -Math.PI / 4, Math.PI / 6]}>
          <torusGeometry args={[1.6, 0.01, 8, 80]} />
          <meshBasicMaterial color="#EC4899" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Particle dust — soft violet */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={200} array={dustPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#A78BFA"
          transparent
          opacity={0.38}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
//  Typing indicator
// ─────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div
    className="rounded-2xl rounded-bl-sm px-4 py-3 inline-flex gap-1.5 items-center"
    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full block"
        style={{ background: 'var(--color-primary)' }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
        transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
//  Main widget
// ─────────────────────────────────────────────────────────────
const AIAgent = () => {
  const { isOpen, messages, isThinking, toggleOpen, addMessage, setThinking, clearMessages } =
    useAgentStore();
  const { isDark } = useThemeStore();

  const [input, setInput]           = useState('');
  const [isTalking, setIsTalking]   = useState(false);
  const messagesEndRef               = useRef(null);
  const inputRef                     = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  const deliver = (reply) => {
    setIsTalking(true);
    addMessage({ role: 'agent', content: reply });
    setTimeout(() => setIsTalking(false), Math.min(reply.length * 45, 5000));
  };

  const sendMessage = async (overrideText) => {
    const userMessage = (overrideText || input).trim();
    if (!userMessage || isThinking) return;

    const historySnapshot = messages;
    addMessage({ role: 'user', content: userMessage });
    setInput('');
    setThinking(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (apiKey) {
        const contents = [
          ...historySnapshot.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
          { role: 'user', parts: [{ text: userMessage }] },
        ];
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: MEDHAT_SYSTEM_PROMPT }] },
              contents,
              generationConfig: { maxOutputTokens: 350, temperature: 0.85 },
            }),
          }
        );
        if (response.ok) {
          const data  = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalReply(userMessage);
          deliver(reply);
          return;
        }
        console.warn('[AIAgent] API unavailable, falling back to local.');
      }

      await new Promise((r) => setTimeout(r, 550 + Math.random() * 500));
      deliver(getLocalReply(userMessage));
    } catch (err) {
      console.warn('[AIAgent] Using local fallback:', err.message);
      await new Promise((r) => setTimeout(r, 400));
      deliver(getLocalReply(userMessage));
    } finally {
      setThinking(false);
    }
  };

  const hasMessages  = messages.length > 0;
  const statusLabel  = isThinking ? 'Thinking…' : isTalking ? 'Responding…' : 'Online';
  const statusColor  = isThinking ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <>
      {/* ══ Chat Panel ══════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="fixed bottom-24 right-5 w-80 md:w-[360px] z-[200] rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: isDark
                ? '0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.18), 0 0 40px rgba(99,102,241,0.07)'
                : '0 16px 48px rgba(0,0,0,0.13), 0 0 0 1px rgba(99,102,241,0.1)',
            }}
          >
            {/* ── Header with gradient matching --gradient-hero ── */}
            <div className="relative overflow-hidden" style={{ height: '152px' }}>
              <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
              {/* Soft radial mesh overlay */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 15% 85%, rgba(255,255,255,0.2) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 55%)',
                }}
              />

              {/* 3D canvas */}
              <Canvas
                camera={{ position: [0, 0, 3.5], fov: 52 }}
                gl={{ antialias: true, alpha: true }}
                style={{ position: 'absolute', inset: 0, background: 'transparent' }}
              >
                <Avatar3D isThinking={isThinking} isTalking={isTalking} />
              </Canvas>

              {/* Bottom identity strip */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center justify-between"
                style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(10px)' }}
              >
                <div>
                  <p className="text-white text-sm font-semibold leading-tight tracking-wide">
                    Medhat's AI
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: statusColor, boxShadow: `0 0 5px ${statusColor}` }}
                    />
                    <span className="text-white/65 text-xs">{statusLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {hasMessages && (
                    <button
                      onClick={clearMessages}
                      className="text-white/50 hover:text-white/90 transition-colors p-1.5 rounded-lg hover:bg-white/10"
                      aria-label="Clear chat"
                      title="Clear chat"
                    >
                      <FaTrash size={11} />
                    </button>
                  )}
                  <button
                    onClick={toggleOpen}
                    className="text-white/50 hover:text-white/90 transition-colors p-1.5 rounded-lg hover:bg-white/10"
                    aria-label="Close"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              className="overflow-y-auto p-4 space-y-3"
              style={{
                height: '220px',
                background: 'var(--color-bg)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--color-border) transparent',
              }}
            >
              {/* Empty state */}
              {!hasMessages && (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      👋 Ask me anything about Medhat
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Skills · Experience · Projects · Hiring
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {AGENT_SUGGESTIONS.map((s) => (
                      <SuggestionChip key={s} label={s} onClick={() => sendMessage(s)} />
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'var(--gradient-primary)',
                            color: 'white',
                            borderBottomRightRadius: '5px',
                          }
                        : {
                            background: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderBottomLeftRadius: '5px',
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <TypingDots />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div
              className="flex gap-2 p-3"
              style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder="Type a message…"
                disabled={isThinking}
                className="flex-1 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Type your message"
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={isThinking || !input.trim()}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.07 }}
                className="rounded-xl px-3.5 py-2.5 text-white flex items-center justify-center disabled:opacity-40 shrink-0"
                style={{ background: 'var(--gradient-primary)' }}
                aria-label="Send"
              >
                <FaPaperPlane size={13} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Trigger button — matches ThemeSwitcher style ════ */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        className="fixed bottom-6 right-5 w-14 h-14 rounded-full z-[200] flex items-center justify-center text-white backdrop-blur-md border-2 border-white/20 overflow-hidden"
        style={{
          boxShadow: isDark
            ? '0 8px 28px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3)'
            : '0 8px 28px rgba(99,102,241,0.28), 0 2px 8px rgba(0,0,0,0.12)',
        }}
        aria-label="Chat with Medhat's AI"
        title="Chat with Medhat's AI"
      >
        {/* Gradient bg — same gradient-hero used across the portfolio */}
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />

        <span className="relative z-10">
          <HiSparkles size={22} />
        </span>

        {/* Subtle pulse ring — only when closed */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(139,92,246,0.6)' }}
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* Unread dot */}
        {!isOpen && hasMessages && (
          <span
            className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white"
            style={{ background: 'var(--color-success)' }}
          />
        )}
      </motion.button>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
//  Suggestion chip — outline style matching portfolio buttons
// ─────────────────────────────────────────────────────────────
const SuggestionChip = ({ label, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 hover:scale-105"
      style={{
        border: '1px solid var(--color-primary)',
        color: hovered ? 'white' : 'var(--color-primary)',
        background: hovered ? 'var(--color-primary)' : 'transparent',
      }}
    >
      {label}
    </button>
  );
};

export default AIAgent;

