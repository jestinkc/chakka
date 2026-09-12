export type SimulationInputs = {
  treeHeight: number
  fruitMass: number
  wind: number
  rabbitDistance: number
  reactionTime: number
  pushForce: number
  stemCutDepth: number
}

export type PhysicsResult = {
  potentialEnergy: number
  impactVelocity: number
  fallTime: number
  collisionProbability: number
  survivalProbability: number
  escapeProbability: number
  impactEnergy: number
  humanInterferenceProbability: number
  sabotageConclusion: string
}

const gravity = 9.81

export function calculatePhysics(inputs: SimulationInputs): PhysicsResult {
  const { treeHeight, fruitMass, wind, rabbitDistance, reactionTime, pushForce, stemCutDepth } = inputs
  
  // Basic kinematics
  const fallTime = Math.sqrt((2 * treeHeight) / gravity)
  
  // Horizontal velocity from push force: F = ma => a = F/m
  // Assume force is applied for 0.5s: v_x = a * t = (pushForce / fruitMass) * 0.5
  const horizontalVelocity = (pushForce / fruitMass) * 0.5
  
  const verticalImpactVelocity = Math.sqrt(2 * gravity * treeHeight)
  const impactVelocity = Math.sqrt(verticalImpactVelocity ** 2 + horizontalVelocity ** 2)
  const potentialEnergy = fruitMass * gravity * treeHeight
  
  // Sabotage calculation
  const forceSabotage = Math.min(50, pushForce * 2)
  const cutSabotage = stemCutDepth * 0.8
  const humanInterferenceProbability = Math.min(99, Math.max(1, forceSabotage + cutSabotage))
  
  const sabotageConclusion = humanInterferenceProbability > 75 ? 'MURDER CONFIRMED' : humanInterferenceProbability > 40 ? 'SUSPICIOUS' : 'ACCIDENT'

  // If pushed, the zone width is shifted. The fruit lands at distance = v_x * fallTime + windFactor
  const windFactor = Math.min(20, Math.abs(wind)) * 0.9
  const horizontalDisplacement = horizontalVelocity * fallTime + windFactor * 0.1
  const dynamicRabbitDistance = Math.abs(rabbitDistance - horizontalDisplacement)

  const zoneWidth = 1.2 + windFactor * 0.035 + fruitMass * 0.015
  const distancePenalty = Math.max(0, Math.abs(dynamicRabbitDistance) - zoneWidth) * 11
  const reactionPenalty = Math.max(0, reactionTime - 0.35) * 18
  
  // Being pushed makes collision more likely if it's pushed towards the rabbit
  const collisionProbability = Math.max(4, Math.min(98, 84 + windFactor * 0.4 + fruitMass * 0.6 - distancePenalty - reactionPenalty + pushForce * 0.5))
  const escapeProbability = Math.max(3, Math.min(97, 38 + Math.abs(dynamicRabbitDistance) * 13 + reactionTime * 17 - fruitMass * 1.2 - windFactor * 0.25 - pushForce * 0.4))
  const survivalProbability = Math.max(2, Math.min(98, 100 - collisionProbability * 0.68 + escapeProbability * 0.42))
  
  return {
    potentialEnergy: Math.round(potentialEnergy),
    impactVelocity: Number(impactVelocity.toFixed(2)),
    fallTime: Number(fallTime.toFixed(2)),
    collisionProbability: Number(collisionProbability.toFixed(1)),
    survivalProbability: Number(survivalProbability.toFixed(1)),
    escapeProbability: Number(escapeProbability.toFixed(1)),
    impactEnergy: Math.round(potentialEnergy * 0.92 + 0.5 * fruitMass * horizontalVelocity ** 2),
    humanInterferenceProbability: Number(humanInterferenceProbability.toFixed(1)),
    sabotageConclusion,
  }
}

export function runMonteCarlo(inputs: SimulationInputs, count = 100000) {
  const base = calculatePhysics(inputs)
  let escaped = 0
  let survived = 0
  let impacted = 0
  let missed = 0
  let sabotageDetected = 0
  let seed = 104729
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  for (let i = 0; i < count; i += 1) {
    const collision = base.collisionProbability + (random() - 0.5) * 24
    const escape = base.escapeProbability + (random() - 0.5) * 22
    if (collision < 34) missed += 1
    else if (escape > 56) escaped += 1
    else if (random() * 100 < base.survivalProbability) survived += 1
    else impacted += 1
    
    if (base.humanInterferenceProbability + (random() - 0.5) * 10 > 75) {
      sabotageDetected += 1
    }
  }
  return { count, escaped, survived, impacted, missed, sabotageDetected, base }
}
