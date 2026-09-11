import { useStore } from '@/lib/store'
import { FolkButton } from './Controls'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { CausalTree } from './CausalTree'

export function RootCause() {
  const { physics, inputs, setStage } = useStore()
  
  // Calculate relative probabilities
  const pushProb = Math.min(100, inputs.pushForce * 2)
  const cutProb = inputs.stemCutDepth
  const windProb = Math.min(100, inputs.wind * 3)
  const weightProb = inputs.fruitMass > 8 ? 20 : 0
  
  let primaryCause = 'Stem Failure (Natural)'
  if (pushProb > 40) primaryCause = 'Human Interference (Pushed)'
  else if (cutProb > 30) primaryCause = 'Human Interference (Cut)'
  else if (windProb > 60) primaryCause = 'Environmental (Wind)'
  
  return (
    <div className="root-cause-panel" style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
      <span className="hand-label">FORENSIC INVESTIGATION</span>
      <h2 style={{ fontSize: '1.8rem', marginTop: '1rem', marginBottom: '1.5rem' }}>ചക്ക എന്തുകൊണ്ട് വീണു?</h2>
      
      <div className="evidence-card" style={{ marginBottom: '2rem' }}>
        <h3>Primary Modeled Cause:</h3>
        <strong style={{ color: '#c62828', fontSize: '1.2rem' }}>{primaryCause}</strong>
        <div style={{ marginTop: '1rem' }}>
          <p>Stem Failure: {Math.max(1, 100 - pushProb - cutProb - windProb - weightProb)}%</p>
          <p>Human Interference: {physics.humanInterferenceProbability}%</p>
          <p>Wind Factor: {windProb}%</p>
          <p>Excess Weight: {weightProb}%</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginTop: '1rem', marginBottom: '1.5rem' }}>മുയൽ എന്തുകൊണ്ട് രക്ഷപ്പെട്ടില്ല?</h2>
      
      <div className="notebook" style={{ marginBottom: '2rem' }}>
        <p><strong>TRAJECTORY:</strong> t={physics.fallTime}s</p>
        <p><strong>REACTION:</strong> {inputs.reactionTime}s</p>
        <p><strong>DISTANCE TO IMPACT:</strong> {inputs.rabbitDistance}m</p>
        <p style={{ marginTop: '1rem' }}>
          <em>{physics.collisionProbability > 65 ? "The rabbit was within the high-probability impact zone and reaction time was insufficient." : "The rabbit successfully cleared the impact zone."}</em>
        </p>
      </div>

      <CausalTree />

      <div className="control-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FolkButton onClick={() => setStage('WHAT_IF')} secondary>
          <RotateCcw size={16} /> ഇങ്ങനെ ആയിരുന്നെങ്കിൽ? (WHAT-IF)
        </FolkButton>
        
        <FolkButton onClick={() => setStage('VERDICT')}>
          GENERATE FINAL VERDICT <ArrowRight size={16} />
        </FolkButton>
      </div>
    </div>
  )
}
