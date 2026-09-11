'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Scene } from '@/components/simulation/Scene'
import { RootCause } from '@/components/simulation/RootCause'
import { Verdict } from '@/components/report/Verdict'
import { RabbitOutcome } from '@/components/simulation/RabbitOutcome'

export default function Page() {
  const [tab, setTab] = useState('overview')
  const { inputs, setInput, physics, timelineTime, isSimulating, startSimulation, endSimulation, setTimelineTime } = useStore()

  const runReconstruction = () => {
    startSimulation()
    let t = -3
    setTimelineTime(t)
    const interval = setInterval(() => {
      t += 0.1
      setTimelineTime(Number(t.toFixed(1)))
      if (t >= physics.fallTime + 1.5) {
        clearInterval(interval)
        endSimulation()
      }
    }, 100)
  }

  return (
    <main className="storybook-app">
      <div className="case-page">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="hand-label">CASE CHX-001 / ILLUSTRATED INVESTIGATION</span>
            <div className="case-heading">
              <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--green-deep)', margin: '10px 0', fontSize: '4rem', fontWeight: 900 }}>
                ചക്ക വീണു. ഇനി<br />അന്വേഷണം.
              </h1>
            </div>
            <p style={{ fontSize: '1.2rem', color: '#5a3d2b' }}>Now let's find out exactly what happened.</p>
          </div>
          
          <div className="case-stamp" style={{ border: '3px solid var(--red)', color: 'var(--red)', padding: '10px 20px', transform: 'rotate(4deg)', fontFamily: 'monospace', textAlign: 'center' }}>
            OPEN CASE<br />
            <b style={{ fontSize: '24px' }}>CHX-<br />001</b>
          </div>
        </div>

        {/* Tabs */}
        <div className="story-tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '3px solid var(--line)', marginTop: '2rem', paddingBottom: '0.5rem' }}>
          {['INVESTIGATION BOARD', 'EVIDENCE', 'ANALYSIS', 'FINAL REPORT'].map((t) => {
            const tabKey = t.split(' ')[0].toLowerCase()
            return (
              <button 
                key={tabKey} 
                onClick={() => setTab(tabKey)}
                className={tab === tabKey ? 'active' : ''}
                style={{ 
                  background: 'none', border: 'none', 
                  fontFamily: 'monospace', fontWeight: 700, 
                  color: tab === tabKey ? 'var(--red)' : '#7d4b2c',
                  borderBottom: tab === tabKey ? '4px solid var(--red)' : 'none',
                  paddingBottom: '8px', cursor: 'pointer'
                }}
              >
                {t}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            
            {tab === 'investigation' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Top Row: Data Cards */}
                  <div className="board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'stretch' }}>
                    
                    {/* Left Card: Primary Object */}
                    <div className="evidence-card green-paper" style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '1.5rem', position: 'relative', transform: 'rotate(-1deg)', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                      <div className="pin" style={{ position: 'absolute', top: 10, right: 15, color: 'var(--red)', fontSize: '24px' }}>📌</div>
                      <span className="hand-label">PRIMARY OBJECT</span>
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🍈</span> Chakka
                      </h2>
                      <p>Mass: {inputs.fruitMass.toFixed(1)} kg</p>
                      <p>Height: {inputs.treeHeight.toFixed(1)} m</p>
                      <p>Force Applied: {inputs.pushForce} N</p>
                      <p>Potential energy: {physics.potentialEnergy} J</p>
                      <p>Impact Velocity: {physics.impactVelocity} m/s</p>
                    </div>

                    {/* Middle Card: Secondary Subject */}
                    <div className="evidence-card" style={{ background: '#e0d5c1', border: '3px solid var(--ink)', padding: '1.5rem', position: 'relative', transform: 'rotate(0.5deg)', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                      <div className="pin" style={{ position: 'absolute', top: 10, right: 15, color: 'var(--red)', fontSize: '24px' }}>📌</div>
                      <span className="hand-label">SECONDARY SUBJECT</span>
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🐇</span> Rabbit R-01
                      </h2>
                      <p>Distance from Drop: {inputs.rabbitDistance.toFixed(2)} m</p>
                      <p>Reaction Time: {inputs.reactionTime.toFixed(2)} s</p>
                      <p>Escape Model: {physics.escapeProbability}%</p>
                      <p>Collision Prob: {physics.collisionProbability}%</p>
                    </div>

                    {/* Right Card: Environment */}
                    <div className="evidence-card red-paper" style={{ background: '#f8dec3', border: '3px solid var(--ink)', padding: '1.5rem', position: 'relative', transform: 'rotate(1deg)', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                      <div className="pin" style={{ position: 'absolute', top: 10, right: 15, color: 'var(--red)', fontSize: '24px' }}>📌</div>
                      <span className="hand-label">ENVIRONMENT</span>
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🌬️</span> Wind & Weather
                      </h2>
                      <p>Wind speed: {inputs.wind} km/h</p>
                      <p>Stem Cut Depth: {inputs.stemCutDepth}%</p>
                      <p>Human Interference: {physics.humanInterferenceProbability}%</p>
                      <p>Sabotage Model: {physics.sabotageConclusion}</p>
                    </div>

                  </div>

                  {/* Wide Center Scene */}
                  <div className="scene-card" style={{ background: '#244835', border: '3px solid var(--ink)', padding: '12px', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, border: '5px solid #a65838', borderImage: 'repeating-linear-gradient(45deg, #a65838, #a65838 10px, #8c4226 10px, #8c4226 20px) 5', position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
                      <Scene />
                    </div>
                    <div className="scene-caption" style={{ background: 'var(--green)', color: '#f5dda0', padding: '15px', marginTop: '12px' }}>
                      <span className="hand-label">LIVE RECONSTRUCTION</span>
                      <p style={{ margin: '5px 0 0', fontFamily: 'Georgia, serif' }}>
                        {isSimulating 
                          ? `T: ${timelineTime.toFixed(1)}s` 
                          : `Trajectory intersects subject envelope at ${physics.fallTime}s.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="analysis-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginTop: '24px' }}>
                  
                  {/* Notebook Math */}
                  <div className="notebook" style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '1.5rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                    <span className="hand-label">WHAT THE NOTEBOOK SAYS</span>
                    <div className="formula" style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', marginTop: '1rem', lineHeight: 1.8 }}>
                      F = mg<br />
                      t = √(2h/g) = <b style={{ color: 'var(--orange)' }}>{physics.fallTime}s</b><br />
                      v = √(2gh + vx²) = <b style={{ color: 'var(--orange)' }}>{physics.impactVelocity}m/s</b>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="controls-panel" style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '1.5rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #a4673d', paddingBottom: '10px', marginBottom: '1rem' }}>
                      <span className="hand-label" style={{ color: 'var(--red)' }}>WHAT-IF MACHINE</span>
                      <button onClick={runReconstruction} disabled={isSimulating} style={{ background: 'var(--orange)', color: '#fff', border: '2px solid var(--ink)', padding: '5px 15px', fontFamily: 'monospace', fontWeight: 'bold', boxShadow: '3px 3px 0 var(--ink)', cursor: isSimulating ? 'wait' : 'pointer' }}>
                        {isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          TREE HEIGHT <span style={{ float: 'right', color: 'var(--red)' }}>{inputs.treeHeight.toFixed(2)} m</span>
                          <input type="range" min="4" max="12" step="0.1" value={inputs.treeHeight} onChange={e => setInput('treeHeight', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--orange)' }} disabled={isSimulating} />
                        </label>
                        <label style={{ display: 'block', marginBottom: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          CHAKKA MASS <span style={{ float: 'right', color: 'var(--red)' }}>{inputs.fruitMass.toFixed(2)} kg</span>
                          <input type="range" min="2" max="12" step="0.1" value={inputs.fruitMass} onChange={e => setInput('fruitMass', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--orange)' }} disabled={isSimulating} />
                        </label>
                        <label style={{ display: 'block', marginBottom: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          WIND SPEED <span style={{ float: 'right', color: 'var(--red)' }}>{inputs.wind} km/h</span>
                          <input type="range" min="0" max="30" step="1" value={inputs.wind} onChange={e => setInput('wind', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--orange)' }} disabled={isSimulating} />
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          RABBIT DISTANCE <span style={{ float: 'right', color: 'var(--red)' }}>{inputs.rabbitDistance.toFixed(2)} m</span>
                          <input type="range" min="0" max="4" step="0.01" value={inputs.rabbitDistance} onChange={e => setInput('rabbitDistance', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--orange)' }} disabled={isSimulating} />
                        </label>
                        <label style={{ display: 'block', marginBottom: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          REACTION TIME <span style={{ float: 'right', color: 'var(--red)' }}>{inputs.reactionTime.toFixed(2)} s</span>
                          <input type="range" min="0.1" max="1.5" step="0.01" value={inputs.reactionTime} onChange={e => setInput('reactionTime', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--orange)' }} disabled={isSimulating} />
                        </label>
                        <label style={{ display: 'block', marginBottom: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          PUSH FORCE <span style={{ float: 'right', color: 'var(--red)' }}>{inputs.pushForce} N</span>
                          <input type="range" min="0" max="50" step="1" value={inputs.pushForce} onChange={e => setInput('pushForce', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--orange)' }} disabled={isSimulating} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === 'evidence' && (
              <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                <RabbitOutcome />
              </div>
            )}

            {tab === 'analysis' && (
              <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                <RootCause />
              </div>
            )}

            {tab === 'final' && (
              <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
                <Verdict />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
