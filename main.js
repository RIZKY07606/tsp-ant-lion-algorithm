import { antLionOptimization } from "./alo.js";
import { particleSwarmOptimization } from "./pso.js";

const cities = [
  { name: "Surabaya", x: 200, y: 100 },
  { name: "Ngawi", x: 150, y: 120 },
  { name: "Bojonegoro", x: 180, y: 90 },
  { name: "Malang", x: 220, y: 140 },
  { name: "Banyuwangi", x: 300, y: 200 },
  { name: "Mojokerto", x: 190, y: 110 },
];

document.getElementById("runALO").addEventListener("click", () => {
  const startIdx = parseInt(document.getElementById("startCity").value);
  const endIdx = parseInt(document.getElementById("endCity").value);
  const result = antLionOptimization(cities, startIdx, endIdx);
  updateTable("ALO", result);
  drawRoute(result.route);
});

document.getElementById("runPSO").addEventListener("click", () => {
  const startIdx = parseInt(document.getElementById("startCity").value);
  const endIdx = parseInt(document.getElementById("endCity").value);
  const result = particleSwarmOptimization(cities, startIdx, endIdx);
  updateTable("PSO", result);
  drawRoute(result.route);
});

function updateTable(algorithm, result) {
  const tableBody = document.querySelector("#resultTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${algorithm}</td>
        <td>${result.distance.toFixed(2)}</td>
        <td>${result.route.map((city) => city.name).join(" → ")}</td>
    `;
  tableBody.appendChild(row);
}

function drawRoute(route) {
  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  route.forEach((city, i) => {
    const nextCity = route[(i + 1) % route.length];
    ctx.moveTo(city.x, city.y);
    ctx.lineTo(nextCity.x, nextCity.y);
  });
  ctx.stroke();

  route.forEach((city) => {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
  });
}
