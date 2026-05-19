const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

const targetDate = new Date("July 19, 2026 00:00:00").getTime();

function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        Days.textContent = Hours.textContent = Minutes.textContent = Seconds.textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    Days.textContent = days < 10 ? "0" + days : days;
    Hours.textContent = hours < 10 ? "0" + hours : hours;
    Minutes.textContent = minutes < 10 ? "0" + minutes : minutes;
    Seconds.textContent = seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateTimer, 1000);
updateTimer();

const znakiMap = {
    aries: "Baran", taurus: "Byk", gemini: "Bliźnięta", cancer: "Rak",
    leo: "Lew", virgo: "Panna", libra: "Waga", scorpio: "Skorpion",
    sagittarius: "Strzelec", capricorn: "Koziorożec", aquarius: "Wodnik", pisces: "Ryby"
};

function generujHoroskop(znakKod) {
    const today = new Date();
    const dataStr = today.toISOString().split('T')[0];
    const znakPl = znakiMap[znakKod] || "Baran";

    const seed = dataStr + znakKod;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }

    const love = ["W relacjach panuje dziś ciepła atmosfera ❤️", "Single mogą liczyć na miłe spotkanie ✨", "Czas na szczerą rozmowę w związku", "Emocje silne – zachowaj równowagę"];
    const praca = ["Produktywny dzień, Twoje pomysły będą docenione 💼", "Możesz dostać ważną wiadomość", "Kreatywność przyniesie efekty", "Dobry dzień na realizację planów"];
    const zdrowie = ["Dbaj o regenerację 🌿", "Ruch na świeżym powietrzu dobrze Ci zrobi", "Organizm potrzebuje uwagi", "Przypływ energii – wykorzystaj mądrze"];
    const rada = ["Zaufaj intuicji", "Małe kroki dają duże rezultaty", "Bądź otwarty na nowe rzeczy", "Spokój to Twój największy atut"];

    const r = Math.abs(hash);
    
    const tekstHTML = `
        <div class="horoskop-sekcja"><strong>❤️ W miłości:</strong><br>${love[r % love.length]}</div>
        <div class="horoskop-sekcja"><strong>💼 W pracy:</strong><br>${praca[(r*7)%praca.length]}</div>
        <div class="horoskop-sekcja"><strong>🌿 Zdrowie:</strong><br>${zdrowie[(r*13)%zdrowie.length]}</div>
        <div class="horoskop-sekcja"><strong>⭐ Rada dnia:</strong><br>${rada[(r*37)%rada.length]}</div>
    `;

    return {
        znak: znakPl,
        data: dataStr,
        dzien_tygodnia: today.toLocaleDateString('pl-PL', { weekday: 'long' }),
        tekst: tekstHTML
    };
}

const select = document.getElementById('znak-select');
const wynik = document.getElementById('horoskop-tekst');

function pokazHoroskop() {
    const znak = select.value;
    if (!znak) return;
    
    const h = generujHoroskop(znak);
    wynik.innerHTML = `
        <strong style="font-size:1.6em;">${h.znak} — ${h.data}</strong><br>
        <small>${h.dzien_tygodnia}</small><br><br>
        ${h.tekst}
    `;
}

select.addEventListener('change', pokazHoroskop);

window.addEventListener('load', () => {
    select.value = 'sagittarius';
    pokazHoroskop();
});