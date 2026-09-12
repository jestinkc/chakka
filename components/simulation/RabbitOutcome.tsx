import { useStore } from '@/lib/store'
import { FolkButton } from './Controls'
import { ArrowRight } from 'lucide-react'

export function RabbitOutcome() {
  const { physics, setStage } = useStore()
  
  let resultTitle = 'SAFE'
  let resultColor = '#2e7d32'
  if (physics.collisionProbability > 65) {
    resultTitle = 'IMPACT (CRITICAL)'
    resultColor = '#c62828'
  } else if (physics.collisionProbability > 35) {
    resultTitle = 'NEAR MISS'
    resultColor = '#f57f17'
  } else if (physics.escapeProbability > 50) {
    resultTitle = 'ESCAPED'
    resultColor = '#1565c0'
  }

  return (
    <div className="outcome-panel" style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
      <span className="hand-label">SIMULATION OUTCOME</span>
      <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: resultColor }}>{resultTitle}</h1>
      <h2 style={{ fontSize: '1.8rem', marginTop: '1rem', marginBottom: '2rem' }}>മുയലിന് എന്ത് സംഭവിച്ചു?</h2>
      
      <div className="evidence-card" style={{ marginBottom: '2rem' }}>
        <p><strong>Collision Probability:</strong> {physics.collisionProbability}%</p>
        <p><strong>Escape Probability:</strong> {physics.escapeProbability}%</p>
        <p><strong>Survival Model:</strong> {physics.survivalProbability}%</p>
      </div>

      <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '2rem', fontSize: '0.9rem' }}>
        * These are fictional simulation categories based on Newtonian physics modeling, NOT veterinary diagnosis.
      </p>

      <div className="control-actions">
        <FolkButton onClick={() => setStage('ROOT_CAUSE')}>
          INVESTIGATE ROOT CAUSE <ArrowRight size={16} />
        </FolkButton>
      </div>
    </div>
  )
}
