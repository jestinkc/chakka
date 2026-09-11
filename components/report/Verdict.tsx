import { useStore } from '@/lib/store'
import { FolkButton } from '../simulation/Controls'
import { RotateCcw } from 'lucide-react'

export function Verdict() {
  const { physics, resetInputs, setStage } = useStore()
  
  return (
    <div className="final-report" style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
      <span className="hand-label">അവസാന വിധി / FINAL VERDICT</span>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>We investigated this far because we could.</h2>
      
      <div className="verdict-lines" style={{ marginBottom: '3rem' }}>
        <p><b>WHY DID THE CHAKKA FALL?</b><span>{physics.humanInterferenceProbability > 50 ? 'SABOTAGE DETECTED' : 'Probable stem failure.'}</span></p>
        <p><b>DID IT HIT THE RABBIT?</b><span>{physics.collisionProbability > 65 ? 'IMPACT CONFIRMED' : 'MISSED'} ({physics.collisionProbability}% modeled)</span></p>
        <p><b>COULD THE RABBIT ESCAPE?</b><span>{physics.escapeProbability > 50 ? 'YES' : 'NO'}</span></p>
        <p><b>HUMAN INTERFERENCE</b><span className={physics.humanInterferenceProbability > 75 ? 'danger-text' : ''}>{physics.sabotageConclusion}</span></p>
      </div>
      
      <div className="big-joke" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ fontSize: '3rem' }}>🍈</span><br />
        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>ചക്ക വീണു.</h1>
        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '1rem' }}>🐇 മുയൽ അവിടെ ഉണ്ടായിരുന്നു.</span>
        <strong style={{ fontSize: '2.5rem', color: '#c62828' }}>{physics.humanInterferenceProbability > 50 ? 'കൊലപാതകം!' : 'എങ്ങനെ?'}</strong>
      </div>
      
      <div className="control-actions" style={{ display: 'flex', justifyContent: 'center' }}>
        <FolkButton secondary onClick={() => {
          resetInputs()
          setStage('SIMULATION')
        }}>
          <RotateCcw size={16} /> RESTART INVESTIGATION
        </FolkButton>
      </div>
    </div>
  )
}
