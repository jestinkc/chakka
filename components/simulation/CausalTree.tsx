import { useStore } from '@/lib/store'

const Line = () => <div style={{ width: 2, height: 16, background: 'var(--ink)', margin: '0 auto' }} />

const Node = ({ icon, text, active = false, danger = false }: { icon: string, text: string, active?: boolean, danger?: boolean }) => (
  <div style={{
    border: '2px solid var(--ink)',
    padding: '8px 12px',
    borderRadius: 8,
    background: danger ? '#f1c8c2' : active ? '#ced095' : 'rgba(255,255,255,0.4)',
    fontWeight: active || danger ? 'bold' : 'normal',
    color: 'var(--ink)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: active || danger ? '3px 3px 0 rgba(47, 27, 19, 0.8)' : '1px 1px 0 rgba(47, 27, 19, 0.3)',
    fontFamily: 'monospace',
    fontSize: '11px',
    transform: active || danger ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s',
    zIndex: 2,
    position: 'relative'
  }}>
    <span style={{ fontSize: '14px' }}>{icon}</span> {text}
  </div>
)

export function CausalTree() {
  const { physics } = useStore()

  const isImpact = physics.collisionProbability > 65
  const isEscape = physics.escapeProbability > 50
  const isSabotage = physics.humanInterferenceProbability > 50

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '2rem 1rem',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
      border: '2px dashed #a4673d',
      margin: '2rem 0'
    }}>
      <h3 style={{ fontFamily: 'Georgia, serif', color: 'var(--green-deep)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>INVESTIGATION FLOW</h3>
      
      <Node icon="🎬" text="INCIDENT" />
      <Line />
      <Node icon="📋" text="CASE REGISTERED" />
      <Line />
      <Node icon="🐇" text="WHAT HAPPENED?" />
      <Line />
      <Node icon="🎮" text="SIMULATION" />
      <Line />
      <Node icon="🐇" text="RABBIT RESULT" active={true} danger={isImpact} />
      <Line />
      <Node icon="🔎" text="INVESTIGATE" active={true} />
      <Line />

      {/* The 3-way split */}
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Top Connecting Line */}
        <div style={{ position: 'relative', width: '80%', height: 16 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '2px solid var(--ink)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 16, background: 'var(--ink)' }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', width: 2, height: 16, background: 'var(--ink)', marginLeft: -1 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 2, height: 16, background: 'var(--ink)' }} />
        </div>

        {/* The 3 Nodes */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '0.5rem' }}>
          <Node icon="🌿" text="WHY FALL?" active={true} />
          <Node icon="💥" text="HOW HIT?" active={true} danger={isImpact} />
          <Node icon="💨" text="CAN ESCAPE?" active={true} danger={!isEscape} />
        </div>

        {/* Bottom Connecting Line */}
        <div style={{ position: 'relative', width: '80%', height: 16 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 2, height: 16, background: 'var(--ink)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', width: 2, height: 16, background: 'var(--ink)', marginLeft: -1 }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: 16, background: 'var(--ink)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderBottom: '2px solid var(--ink)' }} />
        </div>

      </div>

      <Line />
      <Node icon="👤" text="HUMAN INVOLVEMENT" active={isSabotage} danger={isSabotage} />
      <Line />
      <Node icon="🎞️" text="RECONSTRUCTION" />
      <Line />
      <Node icon="🔮" text="WHAT IF?" />
      <Line />
      <Node icon="📜" text="FINAL REPORT" />
    </div>
  )
}
