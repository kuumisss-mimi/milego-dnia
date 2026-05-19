const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

const targetDate = new Date("July 19 2026 00:00:00").getTime();

function timer () {
    const currentDate = new Date().getTime();
    const distance = targetDate - currentDate;

    const days = Math.floor(distance / 1000 / 60 / 60 / 24);
    const hours = Math.floor(distance / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(distance / 1000 / 60) % 60;
    const seconds = Math.floor(distance / 1000) % 60;

    Days.innerHTML = days;
    Hours.innerHTML = hours;
    Minutes.innerHTML = minutes;
    Seconds.innerHTML = seconds;

    if(distance < 0){
        Days.innerHTML = "00";
        Hours.innerHTML = "00";
        Minutes.innerHTML = "00";
        Seconds.innerHTML = "00";
    }
}

setInterval(timer, 1000)


const znakiMap = {
    "aries": "Baran",
    "taurus": "Byk",
    "gemini": "Bliźnięta",
    "cancer": "Rak",
    "leo": "Lew",
    "virgo": "Panna",
    "libra": "Waga",
    "scorpio": "Skorpion",
    "sagittarius": "Strzelec",
    "capricorn": "Koziorożec",
    "aquarius": "Wodnik",
    "pisces": "Ryby"
};

document.getElementById('btn-horoskop').addEventListener('click', () => {
    const select = document.getElementById('znak-select');
    const wybranyZnak = select.value;
    const wynik = document.getElementById('horoskop-tekst');

    if (!wybranyZnak) {
        wynik.innerHTML = `<span style="color: red;">Proszę wybrać znak zodiaku!</span>`;
        return;
    }

    wynik.innerHTML = `<em>Generuję horoskop na dziś...</em>`;

    const horoskop = generujHoroskop(wybranyZnak);

    wynik.innerHTML = `
        <strong>${horoskop.znak} — ${horoskop.data}</strong><br>
        <small>${horoskop.dzien_tygodnia}</small><br><br>
        <pre style="white-space: pre-wrap; font-family: inherit; background: #1e1e1e; padding: 20px; border-radius: 10px; color: #e0e0e0; line-height: 1.65;">
${horoskop.tekst}
        </pre>
    `;
});

function generujHoroskop(znakKod) {
    const today = new Date();
    const dataStr = today.toISOString().split('T')[0];

    const znakPl = znakiMap[znakKod] || "Baran";

    const seed = dataStr + znakKod;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash = hash & hash;
    }

    const intro = [
        `Drogi ${znakPl}, dzisiejsza energia planet sprzyja...`,
        `${znakPl}, gwiazdy wskazują na...`,
        `Dla ${znakPl} dzisiejszy dzień będzie...`
    ];

    const sekcje = [
        "W miłości i relacjach",
        "W pracy i finansach",
        "Zdrowie i samopoczucie",
        "Rada dnia"
    ];

    const teksty = {
        "aries": ["będziesz pełen energii i gotowy do działania", "czas na odważne decyzje", "unikaj konfliktów", "nowe możliwości się pojawią"],
        "taurus": ["stabilizacja i przyjemności", "dbaj o finanse", "cierpliwość popłaca", "miłe spotkania"],
    };

    const love = [
        "W relacjach panuje dziś dobra atmosfera. Szczera rozmowa może zbliżyć Was do siebie.",
        "Single mogą liczyć na interesujące spotkanie lub wiadomość, która poprawi humor.",
        "W związkach czas na kompromis i wzajemne zrozumienie.",
        "Emocje będą dziś intensywne – kontroluj impulsy."
    ];

    const praca = [
        "W pracy czeka Cię produktywny dzień. Dobry moment na realizację planów.",
        "Możesz otrzymać ważną informację lub propozycję.",
        "Skup się na szczegółach, unikaj pośpiechu.",
        "Twoja kreatywność zostanie doceniona."
    ];

    const zdrowie = [
        "Dbaj o regenerację i sen. Organizm potrzebuje dziś więcej uwagi.",
        "Dobry dzień na ruch na świeżym powietrzu.",
        "Unikaj nadmiernego stresu i kofeiny.",
        "Czujesz przypływ energii – wykorzystaj to."
    ];

    const rada = [
        "Zaufaj swojej intuicji – dziś będzie Twoim najlepszym przewodnikiem.",
        "Małe kroki prowadzą do dużych zmian.",
        "Bądź otwarty na nowe perspektywy.",
        "Spokój i opanowanie to Twój największy atut dzisiaj."
    ];

    const r = Math.abs(hash);
    const t1 = r % love.length;
    const t2 = (r * 7) % praca.length;
    const t3 = (r * 13) % zdrowie.length;
    const t4 = (r * 37) % rada.length;

    const tekst = `
${znakPl} — ${dataStr}

${sekcje[0]}: ${love[t1]}

${sekcje[1]}: ${praca[t2]}

${sekcje[2]}: ${zdrowie[t3]}

${sekcje[3]}: ${rada[t4]}
    `.trim();

    return {
        znak: znakPl,
        data: dataStr,
        dzien_tygodnia: new Intl.DateTimeFormat('pl-PL', { weekday: 'long' }).format(today),
        tekst: tekst
    };
}

document.getElementById('znak-select').addEventListener('change', () => {
    document.getElementById('btn-horoskop').click();
});

window.addEventListener('load', () => {
    document.getElementById('znak-select').value = 'aries';
    document.getElementById('btn-horoskop').click();
});