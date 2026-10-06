// Background script для расширения Watch a movie
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Watch a movie установлен');
});

// Обработчик для установки иконки расширения
chrome.action.onClicked.addListener(function(tab) {
    // Эта функция будет вызвана только если popup не определен
    // Но у нас есть popup, поэтому эта функция не будет использоваться
});

// Обработчик сообщений от popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'redirect') {
        chrome.tabs.update(sender.tab.id, {
            url: request.url
        });
        sendResponse({success: true});
    }
});
