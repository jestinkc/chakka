'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { runMonteCarlo } from '@/lib/physics'
import { playClick, playThud, playWhoosh, playScurry } from '@/lib/sound'
import { Scene } from '@/components/simulation/Scene'
import { RootCause } from '@/components/simulation/RootCause'
import { Verdict } from '@/components/report/Verdict'
import { RabbitOutcome } from '@/components/simulation/RabbitOutcome'
import { Volume2, VolumeX, RotateCcw, Play, RefreshCw } from 'lucide-react'

export default function Page() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [centerView, setCenterView] = useState<'aftermath' | 'simulation'>('aftermath')
  const [multiverseData, setMultiverseData] = useState<ReturnType<typeof runMonteCarlo> | null>(null)

  const { inputs, setInput, physics, timelineTime, isSimulating, startSimulation, endSimulation, setTimelineTime, resetInputs } = useStore()

  // Initialize Monte Carlo calculation
  useEffect(() => {
    setMultiverseData(runMonteCarlo(inputs, 100000))
  }, [inputs])

  // Replay Incident function
  const handleReplayIncident = () => {
    playClick(soundEnabled)
    setCenterView('simulation')
    startSimulation()
    let t = -3
    setTimelineTime(t)
    playWhoosh(soundEnabled)

    const interval = setInterval(() => {
      t += 0.1
      const curT = Number(t.toFixed(1))
      setTimelineTime(curT)

      // Sound triggers along the trajectory
      if (Math.abs(curT - inputs.reactionTime) < 0.08) {
        playScurry(soundEnabled)
      }
      if (Math.abs(curT - physics.fallTime) < 0.08) {
        playThud(soundEnabled)
      }

      if (t >= physics.fallTime + 1.8) {
        clearInterval(interval)
        endSimulation()
      }
    }, 100)
  }

  const handleReset = () => {
    playClick(soundEnabled)
    endSimulation()
    resetInputs()
    setTimelineTime(-3)
    setCenterView('aftermath')
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) {
      playClick(true)
    }
  }

  return (
    <main className="storybook-app">
      {/* 1. TOP MASTHEAD HEADER */}
      <header className="folk-header">
        <div className="brand-lockup">
          <span className="mini-ornament">✹</span>
          <div>
            <strong>CHAKKA-X</strong>
            <small>ചക്ക വീണു, മുയൽ ചത്തു. എങ്ങനെ?</small>
          </div>
        </div>

        <div className="header-actions">
          <button 
            onClick={handleReplayIncident} 
            disabled={isSimulating}
            title="Replay the incident physics drop"
          >
            {isSimulating ? 'SIMULATING...' : 'REPLAY INCIDENT'}
          </button>

          <button 
            onClick={toggleSound} 
            className="icon-btn" 
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button 
            onClick={handleReset} 
            className="icon-btn" 
            title="Reset to default case"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* MAIN CASE CONTENT */}
      <div className="case-page">
        
        {/* Case Heading Banner */}
        <div className="case-heading">
          <div>
            <span className="hand-label">CASE CHX-001 / ILLUSTRATED INVESTIGATION</span>
            <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--green-deep)' }}>
              ചക്ക വീണു. ഇനി<br />അന്വേഷണം.
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#5a3d2b', margin: '4px 0 0' }}>
              Now let's find out exactly what happened.
            </p>
          </div>

          <div className="case-stamp">
            OPEN CASE<br />
            <b>CHX-<br />001</b>
          </div>
        </div>

        {/* Scrollable Stacked Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
          
          {/* SECTION 1: INVESTIGATION BOARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 3-Column Primary Incident Board */}
            <div className="board-grid">
              
              {/* Left Column: PRIMARY OBJECT */}
              <div className="evidence-card green-paper">
                <div className="pin">📌</div>
                <span className="hand-label">PRIMARY OBJECT</span>
                <h2>
                  <span>🍈</span> Chakka
                </h2>
                <p>Mass: <b>{inputs.fruitMass.toFixed(1)} kg</b></p>
                <p>Height: <b>{inputs.treeHeight.toFixed(1)} m</b></p>
                <p>Potential energy: <b>{physics.potentialEnergy} J</b></p>
                <div style={{ marginTop: '14px', borderTop: '1px dashed #c09e74', paddingTop: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#7a4b2c' }}>Velocity: <b>{physics.impactVelocity} m/s</b></p>
                  <p style={{ fontSize: '12px', color: '#7a4b2c' }}>Fall Time: <b>{physics.fallTime} s</b></p>
                </div>
              </div>

              {/* Center Column: FRAMED FOLK-ART INCIDENT SCENE */}
              <div className="center-incident-card">
                {/* View Switcher Overlay Tabs */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 12, 
                    zIndex: 30, 
                    display: 'flex', 
                    gap: '6px',
                    background: 'rgba(23, 40, 29, 0.88)',
                    padding: '4px',
                    borderRadius: '4px',
                    border: '1px solid #d99025'
                  }}
                >
                  <button
                    onClick={() => {
                      playClick(soundEnabled)
                      setCenterView('aftermath')
                    }}
                    style={{
                      background: centerView === 'aftermath' ? '#c65725' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    AFTERMATH ART
                  </button>
                  <button
                    onClick={() => {
                      playClick(soundEnabled)
                      setCenterView('simulation')
                    }}
                    style={{
                      background: centerView === 'simulation' ? '#c65725' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    PHYSICS SIMULATION
                  </button>
                </div>

                {/* Mode A: Authentic Aftermath Folk-Art Illustration */}
                {centerView === 'aftermath' && (
                  <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
                    <img 
                      src="/incident_aftermath.jpg" 
                      alt="Chakka veenu, muyal chathu incident scene" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Quick Trigger Button */}
                    <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10 }}>
                      <button
                        onClick={handleReplayIncident}
                        style={{
                          background: 'rgba(198, 87, 37, 0.95)',
                          border: '2px solid var(--ink)',
                          color: '#fff',
                          padding: '6px 14px',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          boxShadow: '3px 3px 0 var(--ink)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Play size={13} /> REPLAY RECONSTRUCTION
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode B: Interactive Physics Simulation Canvas */}
                {centerView === 'simulation' && (
                  <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
                    <Scene />
                  </div>
                )}

                {/* Footer caption & scrub controls */}
                <div className="scene-caption">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className="hand-label" style={{ color: '#ffd277' }}>
                      {centerView === 'aftermath' ? 'INCIDENT SCENE CHX-001' : 'LIVE PHYSICS RECONSTRUCTION'}
                    </span>
                    <span style={{ fontSize: '13px', fontFamily: 'Georgia, serif' }}>
                      {isSimulating 
                        ? `T: ${timelineTime.toFixed(1)}s (Impact: ${physics.fallTime}s)` 
                        : `Collision probability modeled at ${physics.collisionProbability}%.`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={handleReplayIncident}
                      disabled={isSimulating}
                      style={{
                        background: 'var(--orange)',
                        color: '#fff',
                        border: '1.5px solid var(--ink)',
                        padding: '4px 10px',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '2px 2px 0 var(--ink)',
                        cursor: isSimulating ? 'wait' : 'pointer'
                      }}
                    >
                      {isSimulating ? 'SIMULATING...' : '▶ PLAY'}
                    </button>
                    <button
                      onClick={() => {
                        endSimulation()
                        setTimelineTime(-3)
                      }}
                      style={{
                        background: '#301b13',
                        color: '#f5dda0',
                        border: '1.5px solid #5a3d2b',
                        padding: '4px 8px',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: SECONDARY SUBJECT */}
              <div className="evidence-card subject-paper">
                <div className="pin">📌</div>
                <span className="hand-label">SECONDARY SUBJECT</span>
                <h2>
                  <span>🐇</span> Rabbit R-01
                </h2>
                <p>Distance: <b>{inputs.rabbitDistance.toFixed(2)} m</b></p>
                <p>Reaction: <b>{inputs.reactionTime.toFixed(2)} s</b></p>
                <p>Escape model: <b>{physics.escapeProbability.toFixed(1)}%</b></p>
                <div style={{ marginTop: '14px', borderTop: '1px dashed #9baa82', paddingTop: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#3d4d29' }}>Survival Model: <b>{physics.survivalProbability}%</b></p>
                  <p style={{ fontSize: '12px', color: '#3d4d29' }}>Collision Prob: <b style={{ color: physics.collisionProbability > 65 ? '#b71c1c' : '#27ae60' }}>{physics.collisionProbability}%</b></p>
                </div>
              </div>

            </div>

            {/* Lower Row: Notebook Math & Controls Panel */}
            <div className="analysis-grid">
              
              {/* Notebook Math */}
              <div className="notebook">
                <span className="hand-label">WHAT THE NOTEBOOK SAYS</span>
                <div className="formula">
                  F = mg<br />
                  t = √(2h/g) = <b style={{ color: 'var(--orange)' }}>{physics.fallTime}s</b><br />
                  v = √(2gh + vx²) = <b style={{ color: 'var(--orange)' }}>{physics.impactVelocity}m/s</b>
                </div>
                <p style={{ fontFamily: 'Georgia, serif', color: '#5a3d2b', fontSize: '14px', margin: 0 }}>
                  Potential energy converted to kinetic impact force: <b>{physics.impactEnergy} Joules</b>.
                </p>
              </div>

              {/* What-If Controls */}
              <div className="controls-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #a4673d', paddingBottom: '10px', marginBottom: '1rem' }}>
                  <span className="section-title">WHAT-IF MACHINE</span>
                  <button 
                    onClick={handleReplayIncident} 
                    disabled={isSimulating}
                    style={{ 
                      background: 'var(--orange)', 
                      color: '#fff', 
                      border: '2px solid var(--ink)', 
                      padding: '5px 14px', 
                      fontFamily: 'monospace', 
                      fontWeight: 'bold', 
                      boxShadow: '3px 3px 0 var(--ink)', 
                      cursor: isSimulating ? 'wait' : 'pointer' 
                    }}
                  >
                    {isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label>
                      TREE HEIGHT <output>{inputs.treeHeight.toFixed(1)} m</output>
                      <input type="range" min="4" max="12" step="0.1" value={inputs.treeHeight} onChange={e => setInput('treeHeight', Number(e.target.value))} disabled={isSimulating} />
                    </label>
                    <label>
                      CHAKKA MASS <output>{inputs.fruitMass.toFixed(1)} kg</output>
                      <input type="range" min="2" max="12" step="0.1" value={inputs.fruitMass} onChange={e => setInput('fruitMass', Number(e.target.value))} disabled={isSimulating} />
                    </label>
                    <label>
                      WIND SPEED <output>{inputs.wind} km/h</output>
                      <input type="range" min="0" max="30" step="1" value={inputs.wind} onChange={e => setInput('wind', Number(e.target.value))} disabled={isSimulating} />
                    </label>
                  </div>
                  <div>
                    <label>
                      RABBIT DISTANCE <output>{inputs.rabbitDistance.toFixed(2)} m</output>
                      <input type="range" min="0" max="4" step="0.01" value={inputs.rabbitDistance} onChange={e => setInput('rabbitDistance', Number(e.target.value))} disabled={isSimulating} />
                    </label>
                    <label>
                      REACTION TIME <output>{inputs.reactionTime.toFixed(2)} s</output>
                      <input type="range" min="0.1" max="1.5" step="0.01" value={inputs.reactionTime} onChange={e => setInput('reactionTime', Number(e.target.value))} disabled={isSimulating} />
                    </label>
                    <label>
                      PUSH FORCE <output>{inputs.pushForce} N</output>
                      <input type="range" min="0" max="50" step="1" value={inputs.pushForce} onChange={e => setInput('pushForce', Number(e.target.value))} disabled={isSimulating} />
                    </label>
                  </div>
                </div>

                {/* Presets */}
                <div style={{ marginTop: '16px', borderTop: '1px dashed #a4673d', paddingTop: '10px' }}>
                  <span className="hand-label" style={{ display: 'block', marginBottom: '8px' }}>SCENARIO PRESETS:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      { label: 'DEFAULT ACCIDENT', h: 7.4, m: 6.8, w: 12, d: 0.92, r: 0.42, f: 0 },
                      { label: 'HIGH ALTITUDE DROP', h: 11.5, m: 9.5, w: 6, d: 0.75, r: 0.55, f: 0 },
                      { label: 'GALE FORCE GUST', h: 8.0, m: 4.5, w: 28, d: 2.2, r: 0.35, f: 0 },
                      { label: 'LIGHTNING ESCAPE', h: 7.0, m: 5.0, w: 8, d: 2.8, r: 0.15, f: 0 },
                      { label: 'SUSPECTED SABOTAGE', h: 8.5, m: 10.0, w: 10, d: 1.1, r: 0.65, f: 35 },
                    ].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          playClick(soundEnabled)
                          setInput('treeHeight', preset.h)
                          setInput('fruitMass', preset.m)
                          setInput('wind', preset.w)
                          setInput('rabbitDistance', preset.d)
                          setInput('reactionTime', preset.r)
                          setInput('pushForce', preset.f)
                          endSimulation()
                          setTimelineTime(-3)
                        }}
                        disabled={isSimulating}
                        style={{
                          background: '#efd18e',
                          border: '1.5px solid var(--ink)',
                          padding: '4px 8px',
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '2px 2px 0 var(--ink)'
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* SECTION 2: EVIDENCE */}
          <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
            <span className="hand-label">FORENSIC DOSSIER</span>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', color: 'var(--green-deep)', margin: '10px 0 20px' }}>
              Physical Evidence & Measurements
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="evidence-card" style={{ background: '#faf3e3' }}>
                <span className="hand-label">SPECIMEN A: CHAKKA</span>
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                  <img src="/chakka.png" alt="Chakka specimen" style={{ maxHeight: '140px', width: 'auto' }} />
                </div>
                <p><b>Specimen ID:</b> CHX-FRUIT-88</p>
                <p><b>Botanical Name:</b> Artocarpus heterophyllus</p>
                <p><b>Calculated Mass:</b> {inputs.fruitMass} kg</p>
                <p><b>Ripeness Index:</b> 94% (High fermentation, weakened stem pectin)</p>
                <p><b>Kinetic Energy at Ground:</b> {physics.potentialEnergy} Joules</p>
              </div>

              <div className="evidence-card" style={{ background: '#faf3e3' }}>
                <span className="hand-label">SPECIMEN B: RABBIT SUBJECT</span>
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                  <img src="/rabbit.png" alt="Rabbit subject" style={{ maxHeight: '115px', width: 'auto', transform: 'scaleX(-1)' }} />
                </div>
                <p><b>Subject ID:</b> R-01 (Lepus nigricollis)</p>
                <p><b>Resting Distance:</b> {inputs.rabbitDistance} m from drop plumb line</p>
                <p><b>Auditory Reaction Latency:</b> {inputs.reactionTime} s</p>
                <p><b>Escape Velocity Needed:</b> {((inputs.rabbitDistance + 1.2) / physics.fallTime).toFixed(2)} m/s</p>
                <p><b>Collision Model:</b> {physics.collisionProbability}% probability</p>
              </div>

              <div className="evidence-card" style={{ background: '#faf3e3' }}>
                <span className="hand-label">SPECIMEN C: CANOPY & CLIMATE</span>
                <div style={{ height: '140px', overflow: 'hidden', border: '2px solid var(--ink)', margin: '15px 0' }}>
                  <img src="/Gemini_Generated_Image_nvmv8cnvmv8cnvmv.png" alt="Canopy context" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p><b>Branch Elevation:</b> {inputs.treeHeight} meters</p>
                <p><b>Wind Vector:</b> {inputs.wind} km/h (East to West gust)</p>
                <p><b>Stem Cut Depth:</b> {inputs.stemCutDepth}% (Tool markings checked)</p>
                <p><b>Sabotage Probability:</b> {physics.humanInterferenceProbability}%</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PHYSICS NOTEBOOK */}
          <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
            <span className="hand-label">NEWTONIAN FORENSICS</span>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', color: 'var(--green-deep)', margin: '10px 0 20px' }}>
              The Physics of the Fall
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="notebook">
                <h3>Free Fall Kinematics:</h3>
                <div className="formula" style={{ fontSize: '1.2rem', lineHeight: 2 }}>
                  h = 0.5 × g × t²<br />
                  t = √(2h / g) = √(2 × {inputs.treeHeight} / 9.81) = <b>{physics.fallTime} s</b><br />
                  v_y = g × t = 9.81 × {physics.fallTime} = <b>{(9.81 * physics.fallTime).toFixed(2)} m/s</b>
                </div>
              </div>
              <div className="notebook">
                <h3>Energy & Impact:</h3>
                <div className="formula" style={{ fontSize: '1.2rem', lineHeight: 2 }}>
                  PE = m × g × h = {inputs.fruitMass} × 9.81 × {inputs.treeHeight} = <b>{physics.potentialEnergy} Joules</b><br />
                  KE = 0.5 × m × v² = <b>{physics.impactEnergy} Joules</b><br />
                  Impact Force (Δt = 0.05s) ≈ <b>{Math.round(physics.impactEnergy / 0.05)} N</b>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: RABBIT OUTCOME */}
          <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
            <RabbitOutcome />
          </div>

          {/* SECTION 5: FORENSICS & CAUSAL TREE */}
          <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
            <RootCause />
          </div>

          {/* SECTION 6: MULTIVERSE (Monte Carlo) */}
          <div style={{ background: '#173329', color: '#f5dda0', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
            <span className="hand-label" style={{ color: '#ffd277' }}>100,000 MONTE CARLO SIMULATIONS</span>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', color: '#ffd277', margin: '10px 0 20px' }}>
              Parallel Universe Analysis
            </h2>
            <p style={{ maxWidth: '600px', lineHeight: 1.7, marginBottom: '24px' }}>
              We simulated 100,000 alternate realities introducing stochastic wind turbulence, erratic rabbit panic vectors, and microscopic stem fatigue.
            </p>

            {multiverseData && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f5ebd9', color: 'var(--ink)', padding: '16px', border: '2px solid var(--ink)' }}>
                  <span className="hand-label">RABBIT STRUCK</span>
                  <strong style={{ display: 'block', fontSize: '28px', color: '#c0392b', margin: '8px 0' }}>
                    {((multiverseData.impacted / multiverseData.count) * 100).toFixed(1)}%
                  </strong>
                  <small>({multiverseData.impacted.toLocaleString()} worlds)</small>
                </div>

                <div style={{ background: '#f5ebd9', color: 'var(--ink)', padding: '16px', border: '2px solid var(--ink)' }}>
                  <span className="hand-label">CLEAN ESCAPE</span>
                  <strong style={{ display: 'block', fontSize: '28px', color: '#27ae60', margin: '8px 0' }}>
                    {((multiverseData.escaped / multiverseData.count) * 100).toFixed(1)}%
                  </strong>
                  <small>({multiverseData.escaped.toLocaleString()} worlds)</small>
                </div>

                <div style={{ background: '#f5ebd9', color: 'var(--ink)', padding: '16px', border: '2px solid var(--ink)' }}>
                  <span className="hand-label">TRAJECTORY MISSED</span>
                  <strong style={{ display: 'block', fontSize: '28px', color: '#2980b9', margin: '8px 0' }}>
                    {((multiverseData.missed / multiverseData.count) * 100).toFixed(1)}%
                  </strong>
                  <small>({multiverseData.missed.toLocaleString()} worlds)</small>
                </div>

                <div style={{ background: '#f5ebd9', color: 'var(--ink)', padding: '16px', border: '2px solid var(--ink)' }}>
                  <span className="hand-label">FOUL PLAY DETECTED</span>
                  <strong style={{ display: 'block', fontSize: '28px', color: '#8e44ad', margin: '8px 0' }}>
                    {((multiverseData.sabotageDetected / multiverseData.count) * 100).toFixed(1)}%
                  </strong>
                  <small>({multiverseData.sabotageDetected.toLocaleString()} worlds)</small>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                playClick(soundEnabled)
                setMultiverseData(runMonteCarlo(inputs, 100000))
              }}
              className="folk-button"
              style={{ background: 'var(--orange)' }}
            >
              <RefreshCw size={15} /> RERUN 100,000 UNIVERSES
            </button>
          </div>

          {/* SECTION 7: FINAL VERDICT */}
          <div style={{ background: '#f5ebd9', border: '3px solid var(--ink)', padding: '2rem', boxShadow: '6px 6px 0 rgba(89, 43, 23, 0.4)' }}>
            <Verdict />
          </div>

        </div>
      </div>
    </main>
  )
}
