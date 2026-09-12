import { calculatePhysics, runMonteCarlo, type SimulationInputs } from './physics'

self.addEventListener('message', (event: MessageEvent<{ inputs: SimulationInputs; count: number }>) => {
  const { inputs, count } = event.data
  try {
    const result = runMonteCarlo(inputs, count)
    self.postMessage({ success: true, result })
  } catch (error) {
    self.postMessage({ success: false, error: String(error) })
  }
})
