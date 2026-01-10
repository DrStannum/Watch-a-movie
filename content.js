// Content script для внедрения кнопки в интерфейс Кинопоиска

(function() {
    'use strict';

    const BUTTON_CLASS = 'watch-free-btn-ext';

    // SVG иконка play
    const playIcon = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14v13.72c0 .97 1.06 1.58 1.9 1.1l10.74-6.86c.82-.52.82-1.68 0-2.2L9.9 4.04C9.06 3.56 8 4.17 8 5.14z" fill="currentColor"/>
        </svg>
    `;

    // Определяем тип контента по URL
    function getContentType() {
        const url = window.location.href;
        if (url.includes('/series/')) {
            return 'series';
        }
        if (url.includes('/film/')) {
            return 'film';
        }
        return null;
    }

    // Получаем текст кнопки в зависимости от типа
    function getButtonText() {
        const type = getContentType();
        if (type === 'series') {
            return 'Смотреть сериал';
        }
        return 'Смотреть кино';
    }

    // Функция для создания стилизованной кнопки
    function createWatchFreeButton() {
        const button = document.createElement('button');
        button.className = BUTTON_CLASS;
        button.innerHTML = playIcon + '<span>' + getButtonText() + '</span>';

        // Стили с синим фоном
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #3b82f6;
            border: none;
            border-radius: 48px;
            font-family: "YS Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 15px;
            font-weight: 500;
            color: #fff;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
            line-height: 1.2;
            margin-left: 8px;
        `;

        // Стили для иконки
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.cssText = `
                flex-shrink: 0;
                color: #fff;
            `;
        }

        button.addEventListener('mouseenter', () => {
            button.style.background = '#2563eb';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#3b82f6';
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newUrl = window.location.href.replace('kinopoisk.ru', 'sspoisk.ru');
            window.location.href = newUrl;
        });

        return button;
    }

    // Функция для поиска кнопки "Буду смотреть"
    function findWatchlistButton() {
        const buttons = document.querySelectorAll('button');

        for (const btn of buttons) {
            const text = btn.textContent?.trim().toLowerCase() || '';
            if (text === 'буду смотреть') {
                return btn;
            }
        }

        return null;
    }

    // Функция для поиска контейнера с кнопками действий
    function findButtonsContainer() {
        const watchlistBtn = findWatchlistButton();

        if (watchlistBtn) {
            // Ищем контейнер с кнопками - родитель, содержащий несколько кнопок
            let container = watchlistBtn.parentElement;

            for (let i = 0; i < 6; i++) {
                if (!container) break;

                // Проверяем, это ли контейнер с кнопками (горизонтальный flex)
                const style = window.getComputedStyle(container);
                if (style.display === 'flex' && style.flexDirection === 'row') {
                    return container;
                }

                container = container.parentElement;
            }

            // Возвращаем ближайший родительский контейнер
            return watchlistBtn.parentElement?.parentElement || watchlistBtn.parentElement;
        }

        return null;
    }

    // Функция для добавления кнопки
    function addWatchFreeButton() {
        // Проверяем, что мы на странице фильма или сериала
        if (!getContentType()) {
            return false;
        }

        // Если кнопка уже добавлена, не добавляем снова
        if (document.querySelector('.' + BUTTON_CLASS)) {
            return true;
        }

        const container = findButtonsContainer();

        if (!container) {
            return false;
        }

        // Создаём кнопку
        const button = createWatchFreeButton();

        // Вставляем кнопку в контейнер
        container.appendChild(button);

        console.log('[Watch a movie] Кнопка добавлена');
        return true;
    }

    // Функция для периодической проверки и добавления кнопки
    function tryAddButton(attempts = 0) {
        if (attempts > 30) {
            console.log('[Watch a movie] Не удалось найти место для кнопки');
            return;
        }

        const success = addWatchFreeButton();

        if (!success) {
            setTimeout(() => tryAddButton(attempts + 1), 500);
        }
    }

    // Запускаем при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => tryAddButton(), 1000);
        });
    } else {
        setTimeout(() => tryAddButton(), 1000);
    }

    // Отслеживаем изменение URL (для SPA навигации)
    let lastUrl = location.href;

    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;

            // Удаляем старую кнопку при смене страницы
            const oldButtons = document.querySelectorAll('.' + BUTTON_CLASS);
            oldButtons.forEach(btn => btn.remove());

            // Пробуем добавить новую кнопку
            setTimeout(() => tryAddButton(), 1500);
        }
    });

    urlObserver.observe(document, { subtree: true, childList: true });

})();
