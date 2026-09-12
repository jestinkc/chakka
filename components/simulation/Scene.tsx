'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Eye, Wind, Zap, Activity } from 'lucide-react'

export function Scene() {
  const { inputs, isSimulating, timelineTime, physics, stage } = useStore()
  const [showOverlay, setShowOverlay] = useState(true)

  // Simulation coordinate constants (% of container)
  // The jackfruit tree branch in Gemini_Generated_Image_tthn8wtthn8wtthn.png extends around x=64%, y=22%
  // Height variation moves starting branch Y from 16% (12m) to 28% (4m)
  const startY = 28 - ((inputs.treeHeight - 4) / 8) * 12 // 16% to 28%
  const startX = 64 // %
  const groundY = 74 // ground landing line at 74% height

  // Fruit size scaled by mass (2kg to 12kg)
  const fruitScale = 0.75 + ((inputs.fruitMass - 2) / 10) * 0.45 // 0.75x to 1.2x
  const fruitWidth = 72 * fruitScale // px

  // Horizontal push and wind deflection
  // Horizontal velocity: vx = (pushForce / fruitMass) * 0.5
  // Total horizontal drift by impact
  const horizontalDisplacement = ((inputs.pushForce / inputs.fruitMass) * 0.5 * physics.fallTime) + (inputs.wind * 0.12)
  const impactX = Math.min(85, Math.max(30, startX - horizontalDisplacement * 3.5))

  // Timeline progress (0 to 1 during fall)
  const clampedTime = Math.max(0, timelineTime)
  const fallProgress = physics.fallTime > 0 ? Math.min(1, clampedTime / physics.fallTime) : 0
  
  // Natural quadratic acceleration: y = y0 + 0.5 * g * t^2 => progress^2
  const currentY = timelineTime < 0 
    ? startY 
    : startY + (groundY - startY) * Math.pow(fallProgress, 2)

  // Current X during flight
  const currentX = timelineTime < 0
    ? startX
    : startX + (impactX - startX) * fallProgress

  // Fall states
  const isFalling = timelineTime >= 0 && timelineTime < physics.fallTime
  const hasImpacted = timelineTime >= physics.fallTime
  const windSway = Math.sin(Date.now ? 0 : 0) // handled by framer animation

  // Rabbit coordinates and escape logic
  // rabbitDistance: 0 to 4 meters, mapped to screen % offset from impact point
  // Rabbit starts at impactX - (rabbitDistance * 8)%
  const rabbitStartX = Math.max(15, impactX - (inputs.rabbitDistance * 9))
  
  // Escape movement when t > reactionTime
  let rabbitCurrentX = rabbitStartX
  let rabbitEscaping = false
  let rabbitDizzy = false

  if (timelineTime >= inputs.reactionTime) {
    rabbitEscaping = true
    const escapeTime = timelineTime - inputs.reactionTime
    const escapeSpeed = 22 // % per second
    
    if (physics.collisionProbability > 65) {
      // Rabbit tries to run but gets caught in impact zone
      rabbitCurrentX = Math.max(12, rabbitStartX - escapeTime * (escapeSpeed * 0.45))
      if (hasImpacted) {
        rabbitDizzy = true
      }
    } else {
      // Rabbit escapes successfully
      rabbitCurrentX = Math.max(8, rabbitStartX - escapeTime * escapeSpeed)
    }
  }

  // Trajectory arc path data for SVG overlay
  const trajectorySvgPath = useMemo(() => {
    // Parabolic quadratic curve from start to impact
    const sx = startX
    const sy = startY
    const ex = impactX
    const ey = groundY
    // Mid control point with horizontal drift
    const cx = (sx + ex) / 2
    const cy = sy + (ey - sy) * 0.2
    return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`
  }, [startX, startY, impactX, groundY])

  // Current instantaneous vertical velocity v = g * t
  const currentVy = isFalling ? (9.81 * clampedTime).toFixed(1) : hasImpacted ? physics.impactVelocity.toFixed(1) : '0.0'

  return (
    <div className="folk-scene live-scene" style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
      
      {/* Background Kerala Mural Canvas */}
      <img 
        src="/Gemini_Generated_Image_tthn8wtthn8wtthn.png" 
        alt="Kerala Jackfruit Forest Backdrop" 
        className="folk-art" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} 
      />

      {/* Atmospheric wash */}
      <div className="scene-wash" />

      {/* Trajectory Forensic Overlay */}
      {showOverlay && (
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 6 }}
        >
          {/* Parabolic Flight Path */}
          <path
            d={trajectorySvgPath}
            fill="none"
            stroke="rgba(255, 204, 0, 0.75)"
            strokeWidth="0.6"
            strokeDasharray="1.5 1"
          />

          {/* Start Point Marker (Branch point) */}
          <circle cx={startX} cy={startY} r="1" fill="#f39c12" stroke="#fff" strokeWidth="0.3" />

          {/* Impact Zone Target Marker */}
          <ellipse
            cx={impactX}
            cy={groundY}
            rx={2.5 + inputs.fruitMass * 0.25}
            ry={1.0 + inputs.fruitMass * 0.1}
            fill={hasImpacted && physics.collisionProbability > 65 ? "rgba(231, 76, 60, 0.45)" : "rgba(243, 156, 18, 0.35)"}
            stroke={physics.collisionProbability > 65 ? "#e74c3c" : "#f1c40f"}
            strokeWidth="0.5"
            strokeDasharray="1 0.8"
          />
        </svg>
      )}

      {/* Ground Impact Shockwave (when impacted) */}
      <AnimatePresence>
        {hasImpacted && (
          <motion.div
            key="shockwave"
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `${impactX}%`,
              top: `${groundY}%`,
              width: `${fruitWidth * 2}px`,
              height: `${fruitWidth * 0.8}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '3px solid #f39c12',
              boxShadow: '0 0 20px #e67e22',
              pointerEvents: 'none',
              zIndex: 7
            }}
          />
        )}
      </AnimatePresence>

      {/* Comic Impact THUD Effect */}
      <AnimatePresence>
        {hasImpacted && (
          <motion.div
            key="thud-effect"
            initial={{ scale: 0, rotate: -15, opacity: 0 }}
            animate={{ scale: 1.1, rotate: -6, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
            className="thud"
            style={{
              position: 'absolute',
              left: `${Math.max(20, Math.min(75, impactX - 8))}%`,
              top: `${groundY - 14}%`,
              zIndex: 20
            }}
          >
            {physics.collisionProbability > 65 ? 'THUD!!' : 'BUMP!'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dust Cloud upon impact */}
      {hasImpacted && (
        <div 
          className="dust-cloud"
          style={{
            left: `${impactX - 10}%`,
            top: `${groundY - 6}%`,
            zIndex: 8
          }}
        />
      )}

      {/* Chakka (Jackfruit) Falling Sprite */}
      <motion.div
        className="chakka-sprite"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          width: `${fruitWidth}px`,
          transform: 'translate(-50%, -20%)',
          zIndex: 15
        }}
        animate={
          timelineTime < 0
            ? {
                rotate: [-(inputs.wind * 0.2 + 2), inputs.wind * 0.2 + 2, -(inputs.wind * 0.2 + 2)],
                y: [0, 4, 0]
              }
            : isFalling
            ? {
                rotate: (horizontalDisplacement * 6) + (fallProgress * 30),
                scale: [fruitScale, fruitScale * 1.03, fruitScale]
              }
            : hasImpacted
            ? {
                rotate: 22,
                scaleY: fruitScale * 0.88, // squash upon ground impact!
                scaleX: fruitScale * 1.12
              }
            : {}
        }
        transition={
          timelineTime < 0
            ? { repeat: Infinity, duration: Math.max(1.2, 3 - inputs.wind * 0.08), ease: 'easeInOut' }
            : { duration: 0.08 }
        }
      >
        <img 
          src="/chakka.png" 
          alt="Chakka (Jackfruit)" 
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(2px 6px 10px rgba(20, 10, 5, 0.75))'
          }}
        />

        {/* Stem connection indicator when on tree */}
        {timelineTime < 0 && (
          <div 
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '14px',
              background: inputs.stemCutDepth > 0 ? '#c0392b' : '#3d2516',
              borderRadius: '2px',
              boxShadow: inputs.stemCutDepth > 0 ? '0 0 6px rgba(231,76,60,0.8)' : 'none'
            }}
          />
        )}
      </motion.div>

      {/* Rabbit (Muyal) Sprite */}
      <motion.div
        className="rabbit-sprite-container"
        style={{
          left: `${rabbitCurrentX}%`,
          top: `${groundY - 8}%`,
          zIndex: 12,
          pointerEvents: 'none'
        }}
        animate={
          rabbitDizzy
            ? {
                rotate: [-12, 12, -12],
                y: [0, -6, 0]
              }
            : rabbitEscaping
            ? {
                y: [0, -14, 0],
                scaleX: 1.05,
                scaleY: 0.95
              }
            : {
                y: [0, -2, 0]
              }
        }
        transition={{
          repeat: Infinity,
          duration: rabbitDizzy ? 0.4 : rabbitEscaping ? 0.28 : 2.5,
          ease: 'easeInOut'
        }}
      >
        <div style={{ position: 'relative', width: '150px' }}>
          {/* Flip rabbit to run away towards left */}
          <img 
            src="/rabbit.png" 
            alt="Running Rabbit (Muyal)" 
            className="rabbit-sprite"
            style={{
              width: '100%',
              height: 'auto',
              transform: 'scaleX(-1)', // facing left, running away from tree
              filter: rabbitDizzy 
                ? 'drop-shadow(0 0 12px rgba(231,76,60,0.8)) sepia(0.3)' 
                : 'drop-shadow(2px 8px 12px rgba(20, 10, 5, 0.6))'
            }}
          />

          {/* Dizzy stars or emotion balloon */}
          {rabbitDizzy && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: -10 }}
              style={{
                position: 'absolute',
                top: '-18px',
                left: '25%',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#f1c40f',
                textShadow: '1px 1px 2px #000'
              }}
            >
              💫 ⭐ 💫
            </motion.div>
          )}

          {!rabbitDizzy && rabbitEscaping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute',
                top: '-20px',
                left: '20%',
                background: 'rgba(231, 76, 60, 0.9)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '1px',
                border: '1px solid #fff'
              }}
            >
              PANIC! 💨
            </motion.div>
          )}

          {!rabbitEscaping && (
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                left: '20%',
                background: 'rgba(39, 174, 96, 0.85)',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '9px',
                fontWeight: 700
              }}
            >
              GRAZING 🍃
            </div>
          )}
        </div>
      </motion.div>

      {/* Scene HUD Overlays */}
      <div 
        style={{
          position: 'absolute',
          top: 14,
          left: 16,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          background: 'rgba(23, 40, 29, 0.88)',
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1.5px solid #d99025',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          color: '#fdf3d6',
          fontFamily: 'monospace',
          fontSize: '11px',
          zIndex: 22
        }}
      >
        <span style={{ color: isSimulating ? '#e67e22' : '#2ecc71', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Activity size={13} />
          {isSimulating ? `LIVE RECONSTRUCTION / T: ${timelineTime.toFixed(1)}s` : `STANDBY / READY`}
        </span>
        <span style={{ color: '#aaa' }}>|</span>
        <span>Alt: <b>{(inputs.treeHeight * (1 - (currentY - startY) / (groundY - startY))).toFixed(1)}m</b></span>
        <span style={{ color: '#aaa' }}>|</span>
        <span>Vel: <b>{currentVy} m/s</b></span>
      </div>

      {/* Top Right Controls & Toggle */}
      <div 
        style={{
          position: 'absolute',
          top: 14,
          right: 16,
          display: 'flex',
          gap: '8px',
          zIndex: 22
        }}
      >
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          title="Toggle Forensic Trajectory Overlay"
          style={{
            background: showOverlay ? '#c65725' : 'rgba(23, 40, 29, 0.85)',
            border: '1.5px solid #d99025',
            color: '#fff1c9',
            padding: '5px 10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
        >
          <Eye size={12} /> {showOverlay ? 'FORENSIC GRID: ON' : 'GRID: OFF'}
        </button>

        <div 
          style={{
            background: 'rgba(23, 40, 29, 0.85)',
            border: '1.5px solid #d99025',
            color: '#fff1c9',
            padding: '5px 10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Wind size={12} style={{ transform: `rotate(${inputs.wind * 5}deg)` }} />
          <span>{inputs.wind} km/h</span>
        </div>
      </div>

      {/* Decorative Ornaments */}
      <div className="ornament corner top-left">✺ ❧</div>
      <div className="ornament corner top-right">❧ ✺</div>
      <div className="ornament corner bottom-left">❧ ✺</div>
      <div className="ornament corner bottom-right">✺ ❧</div>

    </div>
  )
}
