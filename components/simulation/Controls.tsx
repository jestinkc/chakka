import { useStore } from '@/lib/store'
import { Play } from 'lucide-react'

export function FolkButton({ children, onClick, secondary = false, disabled = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean; disabled?: boolean }) {
  return <button className={`folk-button ${secondary ? 'secondary' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>
}

function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) { 
  return <div className="metric-card" style={{ flex: '1 1 45%', minWidth: 120 }}><span>{label}</span><strong>{value}<small>{unit}</small></strong></div> 
}

export function Controls() {
  const { inputs, setInput, physics, isSimulating, startSimulation, setTimelineTime, setStage } = useStore()

  const runSimulation = () => {
    startSimulation()
    
    // Timeline logic
    let t = -3
    setTimelineTime(t)
    
    const interval = setInterval(() => {
      t += 0.1
      setTimelineTime(Number(t.toFixed(1)))
      
      if (t >= physics.fallTime + 1.5) {
        clearInterval(interval)
        useStore.getState().endSimulation()
        setStage('OUTCOME')
      }
    }, 100) // 100ms per 0.1s in simulation = 1x realtime
  }

  return (
    <div className="controls-panel" style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
      <div className="section-title">SIMULATION CONTROLS</div>
      
      <div className="control-group">
        <span className="hand-label">TREE & ENVIRONMENT</span>
        <label>TREE HEIGHT <output>{inputs.treeHeight.toFixed(1)} m</output>
          <input type="range" min={4} max={12} step={0.1} value={inputs.treeHeight} onChange={e => setInput('treeHeight', Number(e.target.value))} disabled={isSimulating} />
        </label>
        <label>WIND SPEED <output>{inputs.wind} km/h</output>
          <input type="range" min={0} max={30} step={1} value={inputs.wind} onChange={e => setInput('wind', Number(e.target.value))} disabled={isSimulating} />
        </label>
        <label>STEM CUT DEPTH (Sabotage) <output>{inputs.stemCutDepth}%</output>
          <input type="range" min={0} max={100} step={1} value={inputs.stemCutDepth} onChange={e => setInput('stemCutDepth', Number(e.target.value))} disabled={isSimulating} />
        </label>
      </div>

      <div className="control-group" style={{ marginTop: '1.5rem' }}>
        <span className="hand-label">CHAKKA</span>
        <label>FRUIT MASS <output>{inputs.fruitMass.toFixed(1)} kg</output>
          <input type="range" min={2} max={12} step={0.1} value={inputs.fruitMass} onChange={e => setInput('fruitMass', Number(e.target.value))} disabled={isSimulating} />
        </label>
        <label>PUSH FORCE <output>{inputs.pushForce} N</output>
          <input type="range" min={0} max={50} step={1} value={inputs.pushForce} onChange={e => setInput('pushForce', Number(e.target.value))} disabled={isSimulating} />
        </label>
      </div>

      <div className="control-group" style={{ marginTop: '1.5rem' }}>
        <span className="hand-label">RABBIT</span>
        <label>RABBIT DISTANCE <output>{inputs.rabbitDistance.toFixed(2)} m</output>
          <input type="range" min={0} max={4} step={0.01} value={inputs.rabbitDistance} onChange={e => setInput('rabbitDistance', Number(e.target.value))} disabled={isSimulating} />
        </label>
        <label>REACTION TIME <output>{inputs.reactionTime.toFixed(2)} s</output>
          <input type="range" min={0.1} max={1.5} step={0.01} value={inputs.reactionTime} onChange={e => setInput('reactionTime', Number(e.target.value))} disabled={isSimulating} />
        </label>
      </div>

      <div className="notebook" style={{ marginTop: '2rem' }}>
        <div className="section-title">LIVE CALCULATION PANEL</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Metric label="FALL TIME" value={physics.fallTime} unit=" s" />
          <Metric label="IMPACT VELOCITY" value={physics.impactVelocity} unit=" m/s" />
          <Metric label="POTENTIAL ENERGY" value={physics.potentialEnergy} unit=" J" />
          <Metric label="COLLISION PROB." value={physics.collisionProbability} unit="%" />
        </div>
        <div className="formula" style={{ marginTop: 15 }}>
          F = mg<br/>
          t = √(2h/g) = <b>{physics.fallTime}s</b><br/>
          v = √(2gh + vx²) = <b>{physics.impactVelocity}m/s</b>
        </div>
      </div>

      <div className="control-actions" style={{ marginTop: '2rem' }}>
        <FolkButton onClick={runSimulation} disabled={isSimulating}>
          {isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'} <Play size={16} />
        </FolkButton>
      </div>
    </div>
  )
}
