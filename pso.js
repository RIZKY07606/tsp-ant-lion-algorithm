// Daftar kota beserta koordinatnya (latitude dan longitude)
const cities = [
  { id: 0, name: "Surabaya", lat: -7.2575, lon: 112.7521 },
  { id: 1, name: "Ngawi", lat: -7.3667, lon: 111.4167 },
  { id: 2, name: "Bojonegoro", lat: -7.15, lon: 111.8833 },
  { id: 3, name: "Malang", lat: -8.112, lon: 112.2384 },
  { id: 4, name: "Banyuwangi", lat: -8.208, lon: 114.3667 },
  { id: 5, name: "Mojokerto", lat: -7.4667, lon: 112.4333 },
];

// Menghitung jarak Haversine antara dua kota
function calculateDistance(cityA, cityB) {
  const R = 6371; // Radius Bumi dalam km
  const lat1 = (cityA.lat * Math.PI) / 180;
  const lon1 = (cityA.lon * Math.PI) / 180;
  const lat2 = (cityB.lat * Math.PI) / 180;
  const lon2 = (cityB.lon * Math.PI) / 180;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Kembalikan jarak dalam km
}

// Fungsi untuk menghitung total jarak dari urutan kota yang diberikan
function calculateTotalDistance(route) {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(cities[route[i]], cities[route[i + 1]]);
  }
  totalDistance += calculateDistance(
    cities[route[route.length - 1]],
    cities[route[0]],
  );
  return totalDistance;
}

// **PSO** Algoritma

class Particle {
  constructor(nCities) {
    this.position = this.initializePosition(nCities);
    this.velocity = Array(nCities).fill(0);
    this.pbest = [...this.position];
    this.pbestDistance = Infinity;
    this.distance = Infinity;
  }

  initializePosition(nCities) {
    let position = Array.from({ length: nCities }, (_, index) => index);
    position = position.sort(() => Math.random() - 0.5);
    return position;
  }

  calculateDistance() {
    this.distance = calculateTotalDistance(this.position);
  }

  updatePbest() {
    if (this.distance < this.pbestDistance) {
      this.pbestDistance = this.distance;
      this.pbest = [...this.position];
    }
  }

  updatePosition() {
    let i = Math.floor(Math.random() * this.position.length);
    let j = Math.floor(Math.random() * this.position.length);
    [this.position[i], this.position[j]] = [this.position[j], this.position[i]];
  }
}

class PSO {
  constructor(nParticles, nCities) {
    this.nParticles = nParticles;
    this.particles = [];
    this.nCities = nCities;
    this.gbest = null;
    this.gbestDistance = Infinity;
    this.bestDistances = []; // Track the best distances

    for (let i = 0; i < this.nParticles; i++) {
      this.particles.push(new Particle(nCities));
    }
  }

  evaluateDistance() {
    this.particles.forEach((particle) => {
      particle.calculateDistance();
      if (particle.distance < this.gbestDistance) {
        this.gbestDistance = particle.distance;
        this.gbest = [...particle.position];
      }
      particle.updatePbest();
    });
  }

  update() {
    this.particles.forEach((particle) => {
      particle.updatePosition();
    });
  }

  run(iterations) {
    for (let i = 0; i < iterations; i++) {
      console.log(
        `PSO Iteration ${i + 1} - Best Distance: ${this.gbestDistance.toFixed(2)} km`,
      );
      this.evaluateDistance();
      this.update();
      displayRoute(this.gbest);
      updateBestDistanceDisplay(this.gbestDistance);

      // Track best distances for chart
      this.bestDistances.push(this.gbestDistance);
      updateDistanceChart(this.bestDistances);
    }
  }
}

// **Ant Lion** Algoritma

class AntLion {
  constructor(nAnts, nCities) {
    this.nAnts = nAnts;
    this.ants = [];
    this.nCities = nCities;
    this.bestSolution = null;
    this.bestDistance = Infinity;
    this.bestDistances = []; // Track the best distances

    for (let i = 0; i < this.nAnts; i++) {
      this.ants.push(new Ant(nCities));
    }
  }

  evaluateAnts() {
    this.ants.forEach((ant) => {
      ant.calculateDistance();
      if (ant.distance < this.bestDistance) {
        this.bestDistance = ant.distance;
        this.bestSolution = [...ant.path];
      }
    });
  }

  updateAnts() {
    this.ants.forEach((ant) => {
      ant.updatePosition();
    });
  }

  run(iterations) {
    for (let i = 0; i < iterations; i++) {
      console.log(
        `AntLion Iteration ${i + 1} - Best Distance: ${this.bestDistance.toFixed(2)} km`,
      );
      this.evaluateAnts();
      this.updateAnts();
      displayRoute(this.bestSolution);
      updateBestDistanceDisplay(this.bestDistance);

      // Track best distances for chart
      this.bestDistances.push(this.bestDistance);
      updateDistanceChart(this.bestDistances);
    }
  }
}

// Kelas untuk Semut (Ant)
class Ant {
  constructor(nCities) {
    this.path = this.initializePath(nCities);
    this.distance = Infinity;
  }

  initializePath(nCities) {
    let path = Array.from({ length: nCities }, (_, index) => index);
    path = path.sort(() => Math.random() - 0.5);
    return path;
  }

  calculateDistance() {
    this.distance = calculateTotalDistance(this.path);
  }

  updatePosition() {
    let i = Math.floor(Math.random() * this.path.length);
    let j = Math.floor(Math.random() * this.path.length);
    [this.path[i], this.path[j]] = [this.path[j], this.path[i]];
  }
}

// Fungsi untuk menampilkan rute terbaik
function displayRoute(route) {
  const routeList = document.getElementById("routeList");
  routeList.innerHTML = "";
  route.forEach((cityIndex) => {
    const li = document.createElement("li");
    li.textContent = cities[cityIndex].name;
    routeList.appendChild(li);
  });
}

// Memperbarui jarak terbaik di layar
function updateBestDistanceDisplay(distance) {
  const bestDistanceStart = document.getElementById("bestDistanceStart");
  const bestDistanceEnd = document.getElementById("bestDistanceEnd");
  bestDistanceStart.textContent = `Jarak Terbaik Awal: ${distance.toFixed(2)} km`;
  bestDistanceEnd.textContent = `Jarak Terbaik Akhir: ${distance.toFixed(2)} km`;
}

// Fungsi untuk memperbarui grafik perubahan jarak
let distanceChart;

function updateDistanceChart(bestDistances) {
  const ctx = document.getElementById("distanceChart").getContext("2d");
  if (distanceChart) {
    distanceChart.destroy(); // Hancurkan chart sebelumnya jika ada
  }
  distanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: bestDistances.map((_, index) => index + 1), // Iterasi
      datasets: [
        {
          label: "Best Distance per Iteration",
          data: bestDistances,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Iteration" },
        },
        y: {
          title: { display: true, text: "Best Distance (km)" },
        },
      },
    },
  });
}

// Event Listener untuk tombol PSO
document.getElementById("startButton").addEventListener("click", () => {
  const pso = new PSO(50, cities.length); // 50 partikel
  pso.run(15); // Jalankan PSO selama 15 iterasi
});

// Event Listener untuk tombol Ant Lion
document.getElementById("startAntLionButton").addEventListener("click", () => {
  const antLion = new AntLion(50, cities.length); // 50 semut
  antLion.run(15); // Jalankan Ant Lion Algorithm selama 15 iterasi
});
