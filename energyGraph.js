let energyChart = new Chart(document.getElementById('energyChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Kinetic Energy',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
            },
            {
                label: 'Potential Energy',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
            },
            {
                label: 'Total Energy',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
            }
        ]
    },
    options: {
        scales: {
            x: { 
                title: { display: true, text: 'Time (s)' } 
            },
            y: { 
                title: { display: true, text: 'Energy (J)' },
                beginAtZero: true
            }
        }
    }
});

function calculateKineticEnergy(pendulum) {
    return 0.5 * pendulum.mass * Math.pow(pendulum.angularVelocity * pendulum.length, 2);
}

function calculatePotentialEnergy(pendulum) {
    let height = pendulum.length * (1 - Math.cos(pendulum.angle)); // Height from the lowest point
    return pendulum.mass * pendulum.gravity * height;
}

function updateEnergyChart() {
    let activePendulum = pendulums[activePendulumIndex];

    let kineticEnergy = calculateKineticEnergy(activePendulum);
    let potentialEnergy = calculatePotentialEnergy(activePendulum);
    let totalEnergy = kineticEnergy + potentialEnergy;

    energyChart.data.labels.push(time.toFixed(2));  // Adding the time label
    energyChart.data.datasets[0].data.push(kineticEnergy);  // Kinetic energy
    energyChart.data.datasets[1].data.push(potentialEnergy);  // Potential energy
    energyChart.data.datasets[2].data.push(totalEnergy);  // Total energy

    energyChart.update();
}

function startSimulation() {
    if (!running) return;
    
    pendulums.forEach(pendulum => {

        pendulum.angularAcceleration = (-pendulum.gravity / pendulum.length) * 
            Math.sin(pendulum.angle) - pendulum.damping * pendulum.angularVelocity;

        pendulum.angularVelocity += pendulum.angularAcceleration * timeStep;
        pendulum.angle += pendulum.angularVelocity * timeStep;
    });

    drawPendulum();
    updateStats();
    updateEnergyChart(); 
    time += timeStep;
    
    animationFrame = requestAnimationFrame(startSimulation);
}
