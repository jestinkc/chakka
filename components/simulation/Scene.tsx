import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const artwork = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-8GBlp35TKlxgI6QLkvsYm4iTTpI9n0.jpeg'

function Rabbit({ emotion = 'calm', running = false, speed = 1 }: { emotion?: string; running?: boolean, speed?: number }) {
  return (
    <motion.div 
      className={`rabbit-figure ${running ? 'running' : ''}`} 
      animate={{ y: running ? [0, -8, 0] : [0, -2, 0] }} 
      transition={{ repeat: Infinity, duration: running ? 0.34 / speed : 2.8 }}
    >
      <div className="rabbit-ears"><i /><i /></div>
      <div className="rabbit-head">
        <span className="rabbit-eyes">{emotion === 'scared' || emotion === 'panic' ? '◉ ◉' : emotion === 'relieved' ? '⌒ ⌒' : '• •'}</span>
        <span className="rabbit-mouth">{emotion === 'scared' || emotion === 'panic' ? 'O' : emotion === 'happy' ? '⌣' : '—'}</span>
      </div>
      <div className="rabbit-body" />
      <small>{emotion.toUpperCase()}</small>
    </motion.div>
  )
}

export function Scene() {
  const { inputs, isSimulating, timelineTime, physics, stage, setStage } = useStore()
  
  // Calculate dynamic visual properties
  const treeScale = 0.8 + (inputs.treeHeight - 4) * 0.05
  const fruitScale = 0.8 + (inputs.fruitMass - 2) * 0.05
  // Map rabbit distance 0-4m to visual X offset 0-200px
  const rabbitX = inputs.rabbitDistance * 50
  
  // Timeline animations
  const falling = timelineTime >= 0 && timelineTime < physics.fallTime
  const impacted = timelineTime >= physics.fallTime && timelineTime < physics.fallTime + 1
  
  // Wind effect
  const windRotation = inputs.wind * 0.5
  
  // Determine rabbit emotion based on timeline
  let rabbitEmotion = 'calm'
  if (isSimulating) {
    if (timelineTime >= -1 && timelineTime < 0) rabbitEmotion = 'alert'
    if (timelineTime >= 0 && timelineTime < physics.fallTime) rabbitEmotion = 'panic'
    if (impacted) {
      if (physics.collisionProbability > 65) rabbitEmotion = 'dizzy'
      else rabbitEmotion = 'relieved'
    }
  } else if (stage === 'ROOT_CAUSE' || stage === 'OUTCOME') {
    rabbitEmotion = physics.collisionProbability > 65 ? 'dizzy' : 'relieved'
  }

  // Calculate fall y position
  const fallY = timelineTime >= physics.fallTime ? 245 : timelineTime >= 0 ? 150 + (timelineTime / physics.fallTime) * 95 : 150

  return (
    <motion.div className="folk-scene live-scene" style={{ height: '100%', width: '100%', borderRadius: 0 }}>
      <img src={artwork} alt="Kerala folk-art scene" className="folk-art" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      <div className="scene-wash" />
      
      <motion.div 
        className="storybook-tree" 
        style={{ scale: treeScale, transformOrigin: 'bottom center' }}
      >
        <div className="branch" />
        
        <motion.div 
          className="leaves leaf-a" 
          animate={{ rotate: [0, windRotation, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }} 
        />
        <motion.div 
          className="leaves leaf-b" 
          animate={{ rotate: [0, windRotation * 1.2, 0] }} 
          transition={{ repeat: Infinity, duration: 1.8 }} 
        />
        
        <motion.div 
          className="scene-fruit" 
          animate={{ 
            y: falling || impacted ? fallY : [0, 8, 0], 
            rotate: falling || impacted ? 18 : [0, inputs.wind * 0.1, 0],
            scale: fruitScale
          }} 
          transition={falling || impacted ? { duration: 0.1 } : { duration: 3, repeat: Infinity }}
        >
          <span>🍈</span>
        </motion.div>
        
        <div className="scene-ground" />
        
        <motion.div 
          className="scene-rabbit" 
          animate={{ x: rabbitX }}
          transition={{ type: 'spring', stiffness: 50 }}
        >
          <Rabbit emotion={rabbitEmotion} running={falling} speed={2 - inputs.reactionTime} />
        </motion.div>
        
        {impacted && physics.collisionProbability > 65 && (
          <motion.div className="thud" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            THUD!
          </motion.div>
        )}
        {impacted && <div className="dust-cloud" />}
      </motion.div>
      
      <div className="ornament corner top-left">✺ ❧</div>
      <div className="ornament corner top-right">❧ ✺</div>
      <div className="ornament corner bottom-left">❧ ✺</div>
      <div className="ornament corner bottom-right">✺ ❧</div>
      
      {/* Live HUD overly */}
      <div className="scene-hud" style={{ position: 'absolute', top: 20, left: 20, color: '#fff', opacity: 0.7, fontSize: 12 }}>
        {isSimulating && `T: ${timelineTime.toFixed(1)}s`}
        {!isSimulating && stage !== 'INTRO' && `LIVE SCENE / ${inputs.treeHeight}m / ${inputs.fruitMass}kg`}
      </div>
    </motion.div>
  )
}
