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

    function resizeCanvas() {
        const containerWidth = Math.min(780, window.innerWidth - 40);
        canvas.width = containerWidth;
        canvas.height = Math.floor(containerWidth * 0.62);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX = e.clientX || (e.touches && e.touches[0].clientX);
        let clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let x = (clientX - rect.left) * scaleX;
        let y = (clientY - rect.top) * scaleY;

        return {
            x: Math.max(0, Math.min(canvas.width, x)),
            y: Math.max(0, Math.min(canvas.height, y))
        };
    }

    function startPainting(e) {
        painting = true;
        const pos = getPosition(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    }

    function draw(e) {
        if (!painting) return;
        const pos = getPosition(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    }

    function stopPainting() {
        painting = false;
    }

    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mouseleave', stopPainting);

    canvas.addEventListener('touchstart', startPainting, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopPainting);
    canvas.addEventListener('touchcancel', stopPainting);

    document.getElementById('color-picker')?.addEventListener('input', e => color = e.target.value);
    document.getElementById('brush-size')?.addEventListener('input', e => {
        size = parseInt(e.target.value);
        ctx.lineWidth = size;
    });

    document.getElementById('clear-btn')?.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDailyContent();
    initMiniPaint();
});