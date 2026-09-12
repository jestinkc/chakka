import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { FolkButton } from '../simulation/Controls'
import { ArrowRight } from 'lucide-react'
import { Scene } from '../simulation/Scene'

export function Intro() {
  const { setStage, startSimulation, setTimelineTime } = useStore()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Intro sequence timeline
    const sequence = [
      { t: 0, time: -3, p: 0 },   // Scene 1: Peaceful
      { t: 2000, time: -1, p: 1 }, // Scene 3: Shaking, rabbit alert
      { t: 4000, time: 0, p: 2 },  // Scene 4: Fall starts
      { t: 5000, time: 2, p: 3 },  // Scene 5: Impact
      { t: 7000, time: 2, p: 4 }   // Text reveal
    ]

    let timeouts: NodeJS.Timeout[] = []
    
    // Set simulating to true so Scene respects timelineTime instead of inputs directly
    startSimulation()

    sequence.forEach(step => {
      timeouts.push(setTimeout(() => {
        setTimelineTime(step.time)
        setPhase(step.p)
      }, step.t))
    })

    return () => timeouts.forEach(clearTimeout)
  }, [setTimelineTime, startSimulation])

  const skipIntro = () => {
    useStore.getState().endSimulation()
    setStage('SIMULATION')
  }

  return (
    <main className="intro-screen" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Scene />
      </div>

      <div className="intro-copy" style={{ zIndex: 10, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: phase >= 3 ? 'rgba(0,0,0,0.4)' : 'transparent', transition: 'background 1s' }}>
        <AnimatePresence mode="wait">
          {phase === 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="intro-text-box"
              style={{ textAlign: 'center', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>ചക്ക വീണു, മുയൽ ചത്തു.</h1>
              <h2 style={{ fontSize: '2rem', marginBottom: '3rem', fontWeight: 400 }}>പക്ഷേ... എങ്ങനെ?</h2>
              
              <FolkButton onClick={skipIntro}>
                START INVESTIGATION <ArrowRight size={16} />
              </FolkButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase < 4 && (
        <div style={{ position: 'absolute', bottom: 30, right: 30, zIndex: 10 }}>
          <button onClick={skipIntro} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 20, cursor: 'pointer' }}>
            SKIP INTRO
          </button>
        </div>
      )}
    </main>
  )
}
