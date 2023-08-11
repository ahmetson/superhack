chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    })
})

const websites = "*"

chrome.action.onClicked.addListener(async (tab) => {
    console.log(`Tab id: ${tab.id}, tab url: ${tab.url}`);
    const prevState = await chrome.action.getBadgeText({tabId: tab.id});
    const nextState = prevState === 'ON' ? 'OFF': 'ON';

    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    })

    if (nextState === "ON") {
        await chrome.scripting.insertCSS({
            files: ["styles/focus-mode.css"],
            target: {tabId: tab.id},
        });
    } else if (nextState === "OFF") {
        await chrome.scripting.removeCSS({
            files: ["styles/focus-mode.css"],
            target: {tabId: tab.id},
        })
    }
})