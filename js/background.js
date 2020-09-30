/*
 * File: background.js
 * Created by Kevin Thai
 * Date: September 30, 2020
 *
 * This file will do all the background processes needed for the extension.
 * It contains a listener to check the URL of the sites that the user is
 * requesting to look into. If the URL includes a site that is supposed to be
 * blocked, the file would set the tab to the HTML page that says that it is
 * blocked. The user can go back to their initial page if the user went to the
 * URL page.
 */

var storage = chrome.storage.local; // the storage where data is saved.
var state, links, time, totalSeconds; // local vars that hold storage values

setDefault();
setInterval(setTime, 1000);

/*
 * Function: blockSite();
 * Description: It will update the active tab with the HTML page showing that
 * the page is blocked.
 */
function blockSite() 
{
    chrome.tabs.update({url: "../html/blockedSite.html"})
}

/*
 * Function: setDefault();
 * Description: It will set the array to block major social media websites and
 * it will save it into the local storage.
 */
function setDefault() {
    console.log("Set the default");
    storage.set({"links": ['facebook.com','youtube.com','twitter.com', 
        'linkedin.com', 'instagram.com']});
}


/*
 * Function: setTime();
 * Description: It will take the data from the local storage and increase
 * the number of seconds by 1. And set the final number into the local
 * storage. This will be called every time a second is passed.
 */
function setTime()
{

    chrome.storage.local.get(["state","time"], function(data)
    {
        // Gets data from the local storage
        state = data.state;
	    totalSeconds = data.time;

        // if not active productive session, then reset the session.
        if(!state) 
        {
            totalSeconds = 0;
            return;
        }
	    totalSeconds++;

        storage.set({"time" : totalSeconds});

    });
}

/*
 * This is the listener that checks if the URL is part of the blocked list.
 * If so, then it will update the tab. If not, it will continue as usual.
 */
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        chrome.storage.local.get(["state", "links"], function(data) {

            // Gets the data from the local storage.
            state = data.state;
            links = data.links;

            // If not active productive session, then continue as normal.
            if(!state) return;

            // checks every entry for a blocked URL.
            for(index=0; index< links.length; index++) {

                // check if there is a URL and if it should be blocked
                if (details.url && details.url.includes(links[index])) {

                        // This link shows when wanting to add a link to the blocked list
                        if (details.url.includes("settings.html?add_link=" + links[index])) {
                            return;
                        }

                        // This will update the tab to not go to the blocked URL.
                        blockSite();
                    return;
                }
            }
        })
    }, {urls: ["<all_urls>"]}
);
