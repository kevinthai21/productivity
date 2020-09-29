var storage = chrome.storage.local;

var blockedSitesOutput = document.getElementById("blockedSites");
var userInput = document.getElementById("inputLink");
var userEnter = document.getElementById("inputEnter");
var userInputDelete = document.getElementById("inputDeleteLink");
var userEnterDelete = document.getElementById("inputDeleteEnter");
userEnter.addEventListener("click", addLink);
userEnterDelete.addEventListener("click", deleteLink);


updateOutput();

function addLink()
{  
    var inputValue = userInput.value;
    console.log("<Attempting to add '" + inputValue + "'>");

    if(inputValue == 0) {
        alert("This is empty!");
        return;
    }
    storage.get("links", function(x)
    {
        for(i in x.links) {
            if(x.links[i] == inputValue) {
                alert("It is already in the list!");
                return;
            }
        }
        newLinks = x.links;
        newLinks.push(inputValue);
        storage.set({"links": newLinks});
        console.log(x.links);
        console.log("<Successfully added '" + inputValue + "'>");
    });
    updateOutput();
}


function deleteLink()
{
    var deleteValue = userInputDelete.value;
    console.log("<Attempting to delete '" + deleteValue + "'>");
    storage.get("links", function(x)
    {
        for(i in x.links) {
            if(x.links[i] == deleteValue) {
                x.links.splice(i,1);
                console.log("<Successfully deleted '" + deleteValue + "'>");

                storage.set({"links": x.links});
                console.log(x.links);
                return;
            }
        }
    });
    updateOutput();

}

function updateOutput()
{
    storage.get("links", function(data)
    {
        var list = document.createElement('ul');
        for(index in data.links)
        {
            var listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(data.links[index]));

            list.appendChild(listItem);
        }
        blockedSitesOutput.innerHTML = list.innerHTML;
    });

    // alert("Updated the list!");
}