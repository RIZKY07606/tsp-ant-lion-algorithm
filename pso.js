export function particleSwarmOptimization(
  cities,
  startIdx,
  endIdx,
  numParticles = 30,
  maxIterations = 100,
) {
  const particles = initializeParticles(cities, numParticles, startIdx, endIdx);
  let globalBest = particles[0];
  let eliteFitness = Infinity;
  let elitePosition = null;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    particles.forEach((particle) => {
      particle.velocity = updateVelocity(particle, globalBest);
      particle.position = updatePosition(particle);

      const fitnessValue = fitness(particle.position);
      if (fitnessValue < fitness(globalBest.position)) {
        globalBest = particle;
      }

      if (fitnessValue < eliteFitness) {
        eliteFitness = fitnessValue;
        elitePosition = particle.position;
      }
    });
  }

  return {
    route: globalBest.position,
    distance: fitness(globalBest.position),
  };

  function initializeParticles(cities, size, startIdx, endIdx) {
    return Array.from({ length: size }, () => ({
      position: generateRoute(cities, startIdx, endIdx),
      velocity: [],
    }));
  }

  function fitness(route) {
    let distance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      distance += euclidean(route[i], route[i + 1]);
    }
    distance += euclidean(route[route.length - 1], route[0]); // Kembali ke titik awal
    return distance;
  }

  function euclidean(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  function updateVelocity(particle, globalBest) {
    return [...particle.velocity]; // Update velocity if needed
  }

  function updatePosition(particle) {
    return particle.position; // Update position if needed
  }

  function generateRoute(cities, startIdx, endIdx) {
    const route = [
      cities[startIdx],
      ...cities.filter((_, idx) => idx !== startIdx && idx !== endIdx),
      cities[endIdx],
    ];
    return route;
  }
}
