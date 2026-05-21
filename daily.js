async function loadJson(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Nie udało się wczytać ${filename}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getDailyIndex(arrayLength) {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash << 5) - hash + today.charCodeAt(i);
        hash = Math.abs(hash);
    }
    return hash % arrayLength;
}

async function initDailyContent() {
    const faktyData = await loadJson('fakty.json');
    if (faktyData && faktyData.fakty) {
        const index = getDailyIndex(faktyData.fakty.length);
        document.getElementById('fakt-dnia').textContent = faktyData.fakty[index];
    }

    const zdjeciaData = await loadJson('zdjecia.json');
    if (zdjeciaData && zdjeciaData.zdjecia) {
        const index = getDailyIndex(zdjeciaData.zdjecia.length);
        const img = document.getElementById('zdjecie-dnia');
        if (img) img.src = zdjeciaData.zdjecia[index];
    }

    const memyData = await loadJson('memy.json');
    if (memyData && memyData.memy) {
        const index = getDailyIndex(memyData.memy.length);
        const mem = document.getElementById('mem-dnia');
        if (mem) mem.src = memyData.memy[index];
    }
}

function initMiniPaint() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let painting = false;
    let color = '#000000';
    let size = 8;

    canvas.width = 820;
    canvas.height = 520;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    function draw(e) {
        if (!painting) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    canvas.addEventListener('mousedown', (e) => {
        painting = true;
        draw(e);
    });

    canvas.addEventListener('mouseup', () => {
        painting = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mousemove', draw);

    document.getElementById('color-picker')?.addEventListener('input', (e) => {
        color = e.target.value;
        ctx.strokeStyle = color;
    });

    document.getElementById('brush-size')?.addEventListener('input', (e) => {
        size = parseInt(e.target.value);
        ctx.lineWidth = size;
    });

    document.getElementById('clear-btn')?.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('download-btn')?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `mini-paint-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDailyContent();
    initMiniPaint();
});