import { create } from 'zustand'
import { calculatePhysics, type SimulationInputs, type PhysicsResult } from './physics'

export type AppStage = 'INTRO' | 'SIMULATION' | 'OUTCOME' | 'ROOT_CAUSE' | 'WHAT_IF' | 'VERDICT'

export const defaultInputs: SimulationInputs = {
  treeHeight: 7.4,
  fruitMass: 6.8,
  wind: 12,
  rabbitDistance: 0.92,
  reactionTime: 0.42,
  pushForce: 0,
  stemCutDepth: 0
}

interface AppState {
  // Navigation
  stage: AppStage
  setStage: (stage: AppStage) => void
  
  // Animation/Timeline
  isSimulating: boolean
  timelineTime: number // T-3 to T+2
  startSimulation: () => void
  endSimulation: () => void
  setTimelineTime: (t: number) => void
  
  // Physics & Inputs
  inputs: SimulationInputs
  physics: PhysicsResult
  setInput: (key: keyof SimulationInputs, value: number) => void
  resetInputs: () => void
}

export const useStore = create<AppState>((set) => ({
  stage: 'INTRO',
  setStage: (stage) => set({ stage }),
  
  isSimulating: false,
  timelineTime: -3,
  startSimulation: () => set({ isSimulating: true, timelineTime: -3 }),
  endSimulation: () => set({ isSimulating: false }),
  setTimelineTime: (t) => set({ timelineTime: t }),
  
  inputs: defaultInputs,
  physics: calculatePhysics(defaultInputs),
  
  setInput: (key, value) => set((state) => {
    const newInputs = { ...state.inputs, [key]: value }
    return {
      inputs: newInputs,
      physics: calculatePhysics(newInputs)
    }
  }),
  resetInputs: () => set({ inputs: defaultInputs, physics: calculatePhysics(defaultInputs) })
}))
