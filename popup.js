// popup.js - скрипт для popup расширения
document.addEventListener('DOMContentLoaded', function() {
    const redirectBtn = document.getElementById('redirectBtn');

    // Проверяем текущую вкладку
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;

        // Проверяем тип контента на kinopoisk.ru
        if (currentUrl.includes('kinopoisk.ru/film')) {
            redirectBtn.disabled = false;
            redirectBtn.textContent = 'Смотреть кино';
        } else if (currentUrl.includes('kinopoisk.ru/series/')) {
            redirectBtn.disabled = false;
            redirectBtn.textContent = 'Смотреть сериал';
        } else {
            redirectBtn.disabled = true;
            redirectBtn.textContent = 'Не здесь';
        }
    });

    // Обработчик клика на кнопку
    redirectBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            const currentUrl = currentTab.url;

            // Проверяем, что это фильм или сериал на kinopoisk.ru
            if (currentUrl.includes('kinopoisk.ru/film') || currentUrl.includes('kinopoisk.ru/series/')) {
                // Заменяем kinopoisk.ru на kinokino.win
                const newUrl = currentUrl.replace('kinopoisk.ru', 'kinokino.win');

                // Обновляем вкладку и закрываем popup
                chrome.tabs.update(currentTab.id, {url: newUrl}, function() {
                    window.close();
                });
            }
        });
    });
});
