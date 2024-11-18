export function antLionOptimization(
  cities,
  startIdx,
  endIdx,
  maxIterations = 100,
) {
  let bestRoute = null;
  let bestDistance = Infinity;

  // Inisialisasi Ant Lion dengan rute yang dimulai dari startIdx dan diakhiri oleh endIdx
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let currentRoute = generateRoute(cities, startIdx, endIdx);
    let currentDistance = calculateDistance(currentRoute);

    if (currentDistance < bestDistance) {
      bestDistance = currentDistance;
      bestRoute = currentRoute;
    }
  }

  return {
    route: bestRoute,
    distance: bestDistance,
  };

  function generateRoute(cities, startIdx, endIdx) {
    const route = [
      cities[startIdx],
      ...cities.filter((_, idx) => idx !== startIdx && idx !== endIdx),
      cities[endIdx],
    ];
    return route;
  }

  function calculateDistance(route) {
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
}
