let canvas = document.getElementById('pendulumCanvas');
let ctx = canvas.getContext('2d');

const PENDULUM_COLORS = ['#ff0000', '#0000ff'];
const PENDULUM_STROKE_COLORS = ['#990000', '#000099'];

class Pendulum {
    constructor(color, strokeColor) {
        this.length = 1.0;
        this.damping = 0.0;
        this.mass = 1.0;
        this.driveAmplitude = 0.0;
        this.driveFrequency = 0.667;
        this.gravity = 7.0;
        this.angle = Math.PI / 4;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.color = color;
        this.strokeColor = strokeColor;
    }
}

let pendulums = [new Pendulum(PENDULUM_COLORS[0], PENDULUM_STROKE_COLORS[0])];
let activePendulumIndex = 0;
let running = false;
let paused = false;
let timeStep = 0.025;
let time = 0;
let animationFrame;

const addPendulumBtn = document.getElementById('addPendulum');
const switchSettingsBtn = document.getElementById('switchSettings');
const pendulumIndicator = document.querySelector('.pendulum-indicator');

function updateUIForActivePendulum() {
    const activePendulum = pendulums[activePendulumIndex];
    document.getElementById('length').value = activePendulum.length;
    document.getElementById('lengthVal').innerText = activePendulum.length.toFixed(2);
    document.getElementById('damping').value = activePendulum.damping;
    document.getElementById('dampingVal').innerText = activePendulum.damping.toFixed(2);
    document.getElementById('mass').value = activePendulum.mass;
    document.getElementById('massVal').innerText = activePendulum.mass.toFixed(2);
    document.getElementById('driveAmplitude').value = activePendulum.driveAmplitude;
    document.getElementById('driveAmplitudeVal').innerText = activePendulum.driveAmplitude.toFixed(2);
    document.getElementById('driveFrequency').value = activePendulum.driveFrequency;
    document.getElementById('driveFrequencyVal').innerText = activePendulum.driveFrequency.toFixed(3);
    document.getElementById('gravity').value = activePendulum.gravity;
    document.getElementById('gravityVal').innerText = activePendulum.gravity.toFixed(2);
    document.getElementById('angle').value = activePendulum.angle * (180 / Math.PI);
    document.getElementById('angleVal').innerText = (activePendulum.angle * (180 / Math.PI)).toFixed(0);
    
    pendulumIndicator.style.backgroundColor = activePendulum.color;
}

document.getElementById('length').addEventListener('input', function() {
    pendulums[activePendulumIndex].length = parseFloat(this.value);
    document.getElementById('lengthVal').innerText = this.value;
    updateInertiaAndPeriod();
});

document.getElementById('damping').addEventListener('input', function() {
    pendulums[activePendulumIndex].damping = parseFloat(this.value);
    document.getElementById('dampingVal').innerText = this.value;
});

document.getElementById('mass').addEventListener('input', function() {
    pendulums[activePendulumIndex].mass = parseFloat(this.value);
    document.getElementById('massVal').innerText = this.value;
    updateInertiaAndPeriod();
});

document.getElementById('driveAmplitude').addEventListener('input', function() {
    pendulums[activePendulumIndex].driveAmplitude = parseFloat(this.value);
    document.getElementById('driveAmplitudeVal').innerText = this.value;
});

document.getElementById('driveFrequency').addEventListener('input', function() {
    pendulums[activePendulumIndex].driveFrequency = parseFloat(this.value);
    document.getElementById('driveFrequencyVal').innerText = this.value;
});

document.getElementById('gravity').addEventListener('input', function() {
    pendulums[activePendulumIndex].gravity = parseFloat(this.value);
    document.getElementById('gravityVal').innerText = this.value;
    updateInertiaAndPeriod();
});

document.getElementById('angle').addEventListener('input', function() {
    pendulums[activePendulumIndex].angle = parseFloat(this.value) * (Math.PI / 180);
    document.getElementById('angleVal').innerText = this.value;
});


addPendulumBtn.addEventListener('click', function() {
    if (pendulums.length < PENDULUM_COLORS.length) {
        const newIndex = pendulums.length;
        pendulums.push(new Pendulum(PENDULUM_COLORS[newIndex], PENDULUM_STROKE_COLORS[newIndex]));
        switchSettingsBtn.disabled = false;
    }
    if (pendulums.length === PENDULUM_COLORS.length) {
        this.disabled = true;
    }
});

switchSettingsBtn.addEventListener('click', function() {
    activePendulumIndex = (activePendulumIndex + 1) % pendulums.length;
    updateUIForActivePendulum();
});

document.getElementById('start').addEventListener('click', function() {
    const pauseButton = document.getElementById('pause');
    
    if (!running) {
        running = true;
        paused = false;
        this.innerText = 'Reset';
        pauseButton.disabled = false;
        pauseButton.innerText = 'Pause';
        startSimulation();
    } else {
        running = false;
        paused = false;
        resetSimulation();
        this.innerText = 'Start Simulation';
        pauseButton.innerText = 'Pause';
        pauseButton.disabled = true;
    }
});

document.getElementById('pause').addEventListener('click', function() {
    if (running) {
        if (!paused) {
            paused = true;
            this.innerText = 'Resume';
            cancelAnimationFrame(animationFrame);
        } else {
            paused = false;
            this.innerText = 'Pause';
            startSimulation();
        }
    }
});

function resetSimulation() {
    cancelAnimationFrame(animationFrame);
    time = 0;
    pendulums.forEach(pendulum => {
        pendulum.angle = document.getElementById('angle').value * (Math.PI / 180);
        pendulum.angularVelocity = 0;
    });
    drawPendulum();
    updateStats();
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

    time += timeStep;
    
    animationFrame = requestAnimationFrame(startSimulation);
}

function drawPendulum() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pendulums.forEach(pendulum => {
        let pivotX = canvas.width / 2;
        let pivotY = 50;

        let bobX = pivotX + pendulum.length * 100 * Math.sin(pendulum.angle);
        let bobY = pivotY + pendulum.length * 100 * Math.cos(pendulum.angle);

        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = pendulum.strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        let bobRadius = 10 * Math.sqrt(pendulum.mass);

        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fillStyle = pendulum.color;
        ctx.fill();
        ctx.strokeStyle = pendulum.strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function updateStats() {
    let activePendulum = pendulums[activePendulumIndex];
    document.getElementById('timeVal').innerText = time.toFixed(2) + ' s';
    document.getElementById('inertiaVal').innerText = momentOfInertia().toFixed(2) + ' kg·m²';
    document.getElementById('periodVal').innerText = calculatePeriod().toFixed(2) + ' s';
    document.getElementById('amplitudeVal').innerText = 
        (activePendulum.angle * (180 / Math.PI)).toFixed(2) + '°';
}

function momentOfInertia() {
    let activePendulum = pendulums[activePendulumIndex];
    return (1 / 3) * activePendulum.mass * Math.pow(activePendulum.length, 2);
}

function calculatePeriod() {
    let activePendulum = pendulums[activePendulumIndex];
    return 2 * Math.PI * Math.sqrt(activePendulum.length / activePendulum.gravity);
}


function updateInertiaAndPeriod() {
    document.getElementById('inertiaVal').innerText = momentOfInertia().toFixed(2) + ' kg·m²';
    document.getElementById('periodVal').innerText = calculatePeriod().toFixed(2) + ' s';
}

updateUIForActivePendulum();