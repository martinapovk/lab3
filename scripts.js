function addtoPL(name, path) {
    localStorage[name] = path; /* додаємо в localStorage шлях до аудіо файлу */
    window.parent.location.href = window.parent.location.href;/* Оскільки iframe підвантажує зовнішню html сторінку, то після додавання треку до списку, необхідно явно перезавантажити основну сторінку */
}

function loadAlbum(path) {
    var iframe = document.getElementById('target');
    iframe.setAttribute('src', path);
    sessionStorage["album"] = path; /* щоб при перезавантаженні батька, поточна веб - сторінка альбому не зникала, використовуємо sessionStorage, для збереження стану */
}

function testListen(path) {
    var audio = document.createElement('audio'); /* створюємо новий audio element */
    var div = document.getElementById('tracks'); /* Отримуємо доступ до контейнера з треками */
    audio.src = path; /* задаємо джерело для відтворення */
    audio.controls = false; /* Відключаємо елементи управління аудіо, фактично елемент не буде відображатися */
    div.appendChild(audio); /* додаємо створений audio елемент контейнера */
    audio.addEventListener('timeupdate', function () /* Обробник подій, що викликається на протязі всього відтворення аудіо, кожні 250 мс */ {
        if (audio.currentTime > 10) {
            audio.pause();
        } /* Перериваємо відтворення після 10 секунд прослуховування */
    }, false);
    audio.play(); /* початок відтворення аудіо */
}

function playtrack(track) {
    var b = false;
    for (var i in localStorage) {/* В даному циклі ми находм поточний трек і "запам'ятовуємо" наступний */
        if (b) {
            localStorage['next'] = localStorage[i]; break;
        }
        if (i == track) { b = true; }
    }
    var audio = document.getElementById('audio'); /* отримуємо доступ до елементу audio */
    audio.src = localStorage[track]; /* задаємо джерело відтворення */
    audio.controls = true;
    audio.play(); /* починаємо відтворення */
}

function load() {
    if (sessionStorage["album"] != undefined) /* Якщо документ відкривається вперше, або після довгої перерви, то sessionStorage не міститиме інформацію про останній відкритому альбомі */ {
        loadAlbum(sessionStorage["album"]);/* Відкриваємо останній альбом, до якого звернувся користувач, таким чином після примусового поновлення головної сторінки у функції adtoPL користувачеві не доведеться робити це самостійно */
    }
    var audio = document.getElementById('audio'); /* Отримуємо доступ до audio елементу */
    audio.addEventListener('ended', function () /* Додаємо обробник події - закінчення поточного воспроізвденія */ {
        playtrack('next');/* Ініціюємо відтворення наступного треку з користувальницького списку */
    }, false);
    /* Переходимо до завантаження користувацького списку відтворення */
    var list = document.getElementById('playlist'); /* Отримуємо доступ до списку відтворення */
    for (var i in localStorage) /* додаємо треки, збережені користувачем */ {
        var element = document.createElement('li');
        element.setAttribute('class', 'PL');
        element.setAttribute('onclick', "playtrack ('" + i + "')");
        element.innerText = i;
        if (i != 'next') {
            list.appendChild(element);
        }
    }
}
