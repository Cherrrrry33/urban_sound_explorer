let mapImg;
let soundSources = [];
let gridPoints = [];
let currentView = "city";
let soundTable;

let currentSound = null;
let playingSource = null;
let isPlaying = false;
let amplitude;

let mapDrawX = 0;
let mapDrawY = 0;
let mapDrawW = 0;
let mapDrawH = 0;

function preload() {
  mapImg = loadImage("assets/map.jpg");
  soundTable = loadTable("data/soundSources.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();

  loadSoundSources();

  updateMapSize();
  createGrid();

  document.getElementById("toggleView").onclick = () => {
    currentView = currentView === "city" ? "abstract" : "city";

    document.getElementById("toggleView").innerText =
      currentView === "city" ? "Switch to Abstract View" : "Switch to City View";
  };
}

function updateMapSize() {
  let imgRatio = mapImg.width / mapImg.height;
  let canvasRatio = width / height;

  if (canvasRatio > imgRatio) {
    mapDrawW = width;
    mapDrawH = width / imgRatio;
    mapDrawX = 0;
    mapDrawY = (height - mapDrawH) / 2;
  } else {
    mapDrawH = height;
    mapDrawW = height * imgRatio;
    mapDrawX = (width - mapDrawW) / 2;
    mapDrawY = 0;
  }
}

function loadSoundSources() {
  for (let i = 0; i < soundTable.getRowCount(); i++) {
    let source = {
      px: soundTable.getNum(i, "px"),
      py: soundTable.getNum(i, "py"),
      noise: soundTable.getNum(i, "noise"),
      label: soundTable.getString(i, "label"),
      type: soundTable.getString(i, "type"),
      audio: soundTable.getString(i, "audio"),
      insight: soundTable.getString(i, "insight")
    };

    soundSources.push(source);
  }
}

function draw() {
  drawMapBackground();

  if (currentView === "abstract") {
    background(10, 10, 10, 200);
  }

  drawSoundField();
  drawSourceMarkers();
  updateHoverInfo();
}

function drawMapBackground() {
  image(mapImg, mapDrawX, mapDrawY, mapDrawW, mapDrawH);

  fill(0, 120);
  noStroke();
  rect(0, 0, width, height);
}

function createGrid() {
  gridPoints = [];

  let spacing = 26;

  for (let x = 0; x <= width; x += spacing) {
    for (let y = 0; y <= height; y += spacing) {
      let noiseValue = calculateNoiseAtPoint(x, y);

      gridPoints.push({
        x: x,
        y: y,
        noise: noiseValue
      });
    }
  }
}

function getSourceX(s) {
  return mapDrawX + s.px * mapDrawW;
}

function getSourceY(s) {
  return mapDrawY + s.py * mapDrawH;
}

function calculateNoiseAtPoint(x, y) {
    let backgroundNoise = 48;

    let totalWeight = 1.8;
    let weightedNoise = backgroundNoise * totalWeight;

    for (let s of soundSources) {
        let sx = getSourceX(s);
        let sy = getSourceY(s);

        let d = dist(x, y, sx, sy);
        let weight = 1 / pow(d + 10, 1.65);

        weightedNoise += s.noise * weight * 1800;
        totalWeight += weight * 1800;
    }

    return weightedNoise / totalWeight;
}

function drawSoundField() {
  let revealRadius = 210;

  for (let p of gridPoints) {
    let d = dist(mouseX, mouseY, p.x, p.y);

    let baseSize = map(p.noise, 45, 75, 3, 24);
    baseSize = constrain(baseSize, 4, 20);

    // abstract mode：显示所有点
    if (currentView === "abstract") {
      noStroke();
      fill(255, 150);
      ellipse(p.x, p.y, baseSize);
    }

    // city mode：只显示鼠标附近
    else {
      if (d > revealRadius) continue;

      let alpha = map(d, 0, revealRadius, 230, 0);

      noStroke();
      fill(255, alpha);
      ellipse(p.x, p.y, baseSize);
    }
  }
}

function getTypeColor(type) {
  if (type === "transport") return [255, 90, 90];
  if (type === "commercial") return [255, 190, 90];
  if (type === "commercial/cultural") return [255, 120, 210];
  if (type === "entertainment") return [180, 120, 255];
  if (type === "nature") return [90, 220, 140];
  if (type === "riverside") return [90, 180, 255];
  if (type === "residential") return [180, 220, 255];
  if (type === "traffic") return [255, 130, 80];
  if (type === "urban") return [220, 220, 220];

  return [255, 255, 255];
}

function drawSourceMarkers() {
  for (let s of soundSources) {
    let sx = getSourceX(s);
    let sy = getSourceY(s);

    let d = dist(mouseX, mouseY, sx, sy);
    let markerSize = map(s.noise, 45, 85, 10, 28);

    let c = getTypeColor(s.type);

    let showMarker = false;

    if (currentView === "abstract") {
      showMarker = true;
    }

    if (d < 40 || (playingSource === s && isPlaying)) {
        showMarker = true;
    }

    if (showMarker) {
      noStroke();
      fill(c[0], c[1], c[2], 220);
      ellipse(sx, sy, markerSize + 8);

      stroke(0);
      strokeWeight(3);
      fill(c[0], c[1], c[2]);
      textSize(12);

      if (currentView === "abstract" || d < 40 || playingSource === s) {
        fill(c[0], c[1], c[2]);
        text(s.label, sx + markerSize + 10, sy + 4);
      }
    }

    if (playingSource === s && isPlaying && amplitude) {
      let level = amplitude.getLevel();
      let audioPulse = map(level, 0, 0.25, 0, 45);

      noFill();
      stroke(c[0], c[1], c[2], 180);
      strokeWeight(2);
      ellipse(sx, sy, markerSize + 22 + audioPulse);
    }
  }
}

function updateHoverInfo() {
  let nearest = null;
  let nearestDistance = Infinity;

  for (let s of soundSources) {
    let sx = getSourceX(s);
    let sy = getSourceY(s);

    let d = dist(mouseX, mouseY, sx, sy);

    if (d < nearestDistance) {
      nearestDistance = d;
      nearest = s;
    }
  }

  if (nearest && nearestDistance < 80) {

    let audioText;

    if (nearest.audio && nearest.audio !== "") {
        if (playingSource === nearest && isPlaying) {
            audioText = "Playing — click again to pause";
        } else if (playingSource === nearest && !isPlaying) {
            audioText = "Paused — click again to resume";
        } else {
            audioText = "Click to listen";
        }
    } else {
    audioText = "No recording available";
    }

    document.getElementById("info").innerHTML = `
        <strong>${nearest.label}</strong><br>
        Type: ${nearest.type}<br>
        Noise level: ${nearest.noise} dB<br><br>
        ${nearest.insight}<br><br>
        ${audioText}
    `;

  } else {
    let currentNoise = calculateNoiseAtPoint(mouseX, mouseY);

    document.getElementById("info").innerHTML = `
      Estimated sound intensity here:<br>
      <strong>${Math.round(currentNoise)} dB</strong><br>
      Move across the map to reveal nearby sound patterns.
    `;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateMapSize();
  createGrid();
}

function mousePressed() {
  for (let s of soundSources) {
    let sx = getSourceX(s);
    let sy = getSourceY(s);
    let d = dist(mouseX, mouseY, sx, sy);

    if (d < 40) {
      if (!s.audio || s.audio.trim() === "") return;

      // 点击正在播放的点 → 暂停
      if (playingSource === s && currentSound && isPlaying) {
        currentSound.pause();
        isPlaying = false;
        return;
      }

      // 点击暂停的同一个点 → 继续
      if (playingSource === s && currentSound && !isPlaying) {
        currentSound.play();
        isPlaying = true;
        return;
      }

      // 换新声音
      if (currentSound) {
        currentSound.stop();
      }

      currentSound = loadSound(s.audio, () => {
        currentSound.play();
        amplitude.setInput(currentSound);
        playingSource = s;
        isPlaying = true;
      });

      return;
    }
  }
}