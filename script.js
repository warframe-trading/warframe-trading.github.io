
const proxyUrl = 'https://cors-proxy.fringe.zone/'; //Proxy url is required to bypass CORS errors
const apiUrl = 'https://api.warframe.market/v1/items/'; // This is the warframe.market api url
const dropSourcesUrl = 'https://api.warframestat.us/drops/search/'; //This is the dropsources api url  warframe.market's version doesnt really work well with the code

function checkPrice() {
    var itemName = document.getElementById('itemName').value;
    var selectedPlatform = document.getElementById('platformDropdown').value;

    if (!itemName) {
        
             alertify 
.alert("Error!","Please enter an item name.", function(){
    
})
        return;
    }

    // Convert to lowercase and replace spaces with underscores
    itemName = itemName.toLowerCase().replace(/\s+/g, '_');

    var fullApiUrl = proxyUrl + apiUrl + itemName + '/orders';

    // Measure the start time
    var startTime = performance.now();

    // Include the platform in the headers
    fetch(fullApiUrl, {
        headers: {
            'platform': selectedPlatform,
        }
    })
        .then(response => response.json())
        .then(data => {
            // Measure the end time
            var endTime = performance.now();

            // Calculate the duration in milliseconds
            var duration = endTime - startTime;

            // Log the duration to the console
            console.log(`API request took ${duration.toFixed(2)} ms`);

            displayPriceResult(data, itemName);
        })
        .catch(error => {
            console.error('Error:', error);
               alertify 
.alert("Error!","Error fetching data. Please try again.", function(){
})
          
        });
}

function displayDropSources(data, itemName) {
    var dropSourcesContainer = document.getElementById('dropSources');

    // Check if the container exists
    if (!dropSourcesContainer) {
        console.error('Drop sources container not found.');
        return;
    }

    dropSourcesContainer.innerHTML = ''; // Clear previous results

    if (data.length > 0) {
        // Sort the data by item, chance, place, and rarity
        data.sort((a, b) => {
            if (a.item !== b.item) {
                return a.item.localeCompare(b.item);
            }
            if (a.chance !== b.chance) {
                return b.chance - a.chance;
            }
            if (a.place !== b.place) {
                return a.place.localeCompare(b.place);
            }
            return a.rarity.localeCompare(b.rarity);
        });

        var table = document.createElement('table');
        table.classList.add('drop-sources-table');

        // Create table header
        var headerRow = table.insertRow(0);
        var headers = ['Item', 'Chance (%)', 'Place', 'Rarity'];
        headers.forEach(headerText => {
            var header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        // Populate the table
        data.forEach(source => {
            var row = table.insertRow(-1);

            var itemCell = row.insertCell(0);
            var chanceCell = row.insertCell(1);
            var placeCell = row.insertCell(2);
            var rarityCell = row.insertCell(3);

            itemCell.textContent = source.item || itemName;
            chanceCell.textContent = source.chance.toFixed(2);
            placeCell.textContent = source.place;
            rarityCell.textContent = source.rarity;
        });

        dropSourcesContainer.appendChild(table);
    } else {
        dropSourcesContainer.textContent = `No drop sources available for ${itemName}.`;
    }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function copyMessage(user, orderType, itemName, mod_rank, platinum) {
    // Switch order type
    var oppositeOrderType = orderType === 'buy' ? 'sell' : 'buy';

    // Replace "undefined" with the actual item or mod name
    itemName = itemName || document.getElementById('itemName').value;
    
    // Convert itemName to title case
    itemName = toTitleCase(itemName);

    var message = `/w ${user} Hey there! I want to ${oppositeOrderType}: "[${itemName}] (rank ${mod_rank})" for ${platinum} platinum. (Sent from Warframe.market Minimized!)`;

    navigator.clipboard.writeText(message).then(function() {
        alertify.alert("Success!", `${message} copied to clipboard!`, function(){});
    }).catch(function(err) {
        console.error('Unable to copy message to clipboard', err);
        alertify.alert("Error!", "Error copying message to clipboard. Please try again.", function(){});
    });
}



function filterOrders(orders) {
    var buyOrders = document.getElementById('buyOrders').checked;
    var sellOrders = document.getElementById('sellOrders').checked;
    var ingameOnly = document.getElementById('ingameOnly').checked;

    return orders.filter(order => {
        // Check online status only if the onlineOnly checkbox is checked
        if (ingameOnly) {
            return (
                ((buyOrders && order.order_type === 'buy') || (sellOrders && order.order_type === 'sell')) &&
                order.user.status === 'ingame'
            );
        } else {
            return (buyOrders && order.order_type === 'buy') || (sellOrders && order.order_type === 'sell');
        }
    });
}

function sortOrders(orders) {
    var sortBy = document.getElementById('sortBy').value;

    return orders.sort((a, b) => {
        switch (sortBy) {
            case 'platinumAsc':
                return a.platinum - b.platinum;
            case 'platinumDesc':
                return b.platinum - a.platinum;
            case 'rankAsc':
                return a.mod_rank - b.mod_rank;
            case 'rankDesc':
                return b.mod_rank - a.mod_rank;
            default:
                return 0;
        }
    });
}

document.getElementById('checkPriceBtn').addEventListener('click', checkPrice);
document.getElementById('showDropSourcesBtn').addEventListener('click', showDropSources);

function showDropSources() {
    var itemName = document.getElementById('itemName').value;
    var selectedPlatform = document.getElementById('platformDropdown').value;

    if (!itemName) {
        alertify 
.alert("Error!","Please enter an item name.", function(){
})
        return;
    }

    // Convert to lowercase and replace spaces with spaces
    itemName = itemName.toLowerCase().replace(/\s+/g, '%20');

    var fullDropSourcesUrl = dropSourcesUrl + itemName;

    // Include the platform in the headers
    fetch(fullDropSourcesUrl, {
        headers: {
            'platform': selectedPlatform,
        }
    })
        .then(response => response.json())
        .then(data => {
            displayDropSources(data, itemName);
        })
        .catch(error => {
            console.error('Error:', error);
            alertify 
.alert("Error!","Error fetching drop sources. Please try again.", function(){
})

        });
}
function displayDropSources(data) {
      var dropSourcesContainer = document.getElementById('dropSources');

        // Check if the container exists
        if (!dropSourcesContainer) {
            console.error('Drop sources container not found.');
            return;
        }

        dropSourcesContainer.innerHTML = ''; // Clear previous results

        if (data.length > 0) {
        // Sort the data by item, chance, place, and rarity
        data.sort((a, b) => {
            if (a.item !== b.item) {
                return a.item.localeCompare(b.item);
            }
            if (a.chance !== b.chance) {
                return b.chance - a.chance;
            }
            if (a.place !== b.place) {
                return a.place.localeCompare(b.place);
            }
            return a.rarity.localeCompare(b.rarity);
        });

        var table = document.createElement('table');
        table.classList.add('drop-sources-table');

        // Create table header
        var headerRow = table.insertRow(0);
        var headers = ['Item', 'Chance (%)', 'Place', 'Rarity'];
        headers.forEach(headerText => {
            var header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        // Populate the table
        data.forEach(source => {
            var row = table.insertRow(-1);

            var itemCell = row.insertCell(0);
            var chanceCell = row.insertCell(1);
            var placeCell = row.insertCell(2);
            var rarityCell = row.insertCell(3);

            itemCell.textContent = source.item;
            chanceCell.textContent = source.chance.toFixed(2);
            placeCell.textContent = source.place;
            rarityCell.textContent = source.rarity;
        });

        dropSourcesContainer.appendChild(table);
    } else {
        dropSourcesContainer.textContent = `No drop sources available for ${itemName}`;
    }
}
function fetchDropSources(itemName) {
    var fullDropSourcesUrl = dropSourcesUrl + itemName;

    fetch(fullDropSourcesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayDropSources(data);
        })
        .catch(error => {
            console.error('Error fetching drop sources:', error);
               alertify 
.alert("Error!","Error fetching drop sources. Please try again.", function(){
})
        });
}










function displayPriceResult(data, itemName) {
    var priceResultContainer = document.getElementById('priceResult');
    priceResultContainer.innerHTML = ''; // Clear previous results

    if (data.payload && data.payload.orders && data.payload.orders.length > 0) {
        var filteredOrders = filterOrders(data.payload.orders);
        var sortedOrders = sortOrders(filteredOrders);

        var orderList = document.createElement('ul');
        sortedOrders.forEach(order => {
            var listItem = document.createElement('li');
            listItem.textContent = ` Item: ${order.item || itemName} | User: ${order.user.ingame_name} | Rank: ${order.mod_rank} | Platinum: ${order.platinum} | Order Type: ${order.order_type} | Status: ${order.user.status} | Platform: ${order.platform}`;
            listItem.addEventListener('click', function() {
                copyMessage(order.user.ingame_name, order.order_type, order.item, order.mod_rank, order.platinum);
            });
            orderList.appendChild(listItem);
        });

        priceResultContainer.appendChild(orderList);
    } else {
         alertify 
.alert("Error!","No pricing information available for " + itemName, function(){
});
        
    }
}





function copyMessage(user, orderType, itemName, mod_rank, platinum) {
    // Switch order type
    var oppositeOrderType = orderType === 'buy' ? 'sell' : 'buy';

    // Replace "undefined" with the actual item or mod name
    itemName = itemName || document.getElementById('itemName').value;
    // Convert itemName to title case
    itemName = toTitleCase(itemName);
    var message = `/w ${user} Hey there! I want to ${oppositeOrderType}: "[${itemName}] (rank ${mod_rank})" for ${platinum} platinum. (Sent from Warframe.market Minimized!)`;

    navigator.clipboard.writeText(message).then(function() {
           alertify 
.alert("Success!",`${message} copied to clipboard!`, function(){
})
        
    }).catch(function(err) {
        console.error('Unable to copy message to clipboard', err);
         alertify 
.alert("Error!","Error copying message to clipboard. Please try again.", function(){
})
        
    });
}


function filterOrders(orders) {
    var buyOrders = document.getElementById('buyOrders').checked;
    var sellOrders = document.getElementById('sellOrders').checked;
    var ingameOnly = document.getElementById('ingameOnly').checked;

    return orders.filter(order => {
        // Check online status only if the onlineOnly checkbox is checked
        if (ingameOnly) {
            return (
                ((buyOrders && order.order_type === 'buy') || (sellOrders && order.order_type === 'sell')) &&
                order.user.status === 'ingame'
            );
        } else {
            return (buyOrders && order.order_type === 'buy') || (sellOrders && order.order_type === 'sell');
        }
    });
}

function sortOrders(orders) {
    var sortBy = document.getElementById('sortBy').value;

    return orders.sort((a, b) => {
        switch (sortBy) {
            case 'platinumAsc':
                return a.platinum - b.platinum;
            case 'platinumDesc':
                return b.platinum - a.platinum;
            case 'rankAsc':
                return a.mod_rank - b.mod_rank;
            case 'rankDesc':
                return b.mod_rank - a.mod_rank;
            default:
                return 0;
        }
    });
}

function calculateStatistics() {
    var itemName = document.getElementById('itemName').value;
    var apiUrl = 'https://api.warframe.market/v1/items/';
    const proxyUrl = 'https://cors-proxy.fringe.zone/';
    itemName = itemName.toLowerCase().replace(/\s+/g, '_');
    var fullApiUrl = proxyUrl + apiUrl + itemName + '/statistics';

    fetch(fullApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayStatistics(data);
        })
        .catch(error => {
            console.error('Error fetching statistics:', error);
            alertify.alert("Error!", "Error fetching statistics. Please try again.", function(){});
        });
}


function displayStatistics(data) {
    var statisticsResultContainer = document.getElementById('statisticsResult');
    statisticsResultContainer.innerHTML = ''; // Clear previous results

    if (data.payload && data.payload.statistics_closed && data.payload.statistics_closed['48hours']) {
        var statisticsList = document.createElement('ul');
        

        var minPrice = Number.MAX_VALUE;
        var maxPrice = Number.MIN_VALUE;
        var totalPrices = 0;
        var numPrices = 0;

        
        var minVolume = Number.MAX_VALUE;
        var maxVolume = Number.MIN_VALUE;
        var totalVolume = 0;
        var numVolume = 0;
        
        var minOpenPrice = Number.MAX_VALUE;
        var maxOpenPrice = Number.MIN_VALUE;
        var totalOpenPrice = 0;
        var numOpenPrice = 0;        
    
        var minClosedPrice = Number.MAX_VALUE;
        var maxClosedPrice = Number.MIN_VALUE;
        var totalClosedPrice = 0;
        var numClosedPrice = 0;          

        var minWaPrice= Number.MAX_VALUE;
        var maxWaPrice = Number.MIN_VALUE;
        var totalWaPrice = 0;
        var numWaPrice = 0;       
        
        var minMedian= Number.MAX_VALUE;
        var maxMedian = Number.MIN_VALUE;
        var totalMedian = 0;
        var numMedian = 0;       

        var minDonchTop= Number.MAX_VALUE;
        var maxDonchTop = Number.MIN_VALUE;
        var totalDonchTop = 0;
        var numDonchTop = 0;     
        
         var minDonchBot= Number.MAX_VALUE;
        var maxDonchBot = Number.MIN_VALUE;
        var totalDonchBot = 0;
        var numDonchBot = 0;     
        data.payload.statistics_closed['48hours'].forEach(statistic => {
              

            numPrices++;
            totalPrices += statistic.min_price; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.min_price < minPrice) {
                minPrice = statistic.min_price;
            }
            if (statistic.max_price > maxPrice) {
                maxPrice = statistic.max_price;
            }
            numVolume++;
            totalVolume += statistic.volume; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.volume < minVolume) {
                minVolume = statistic.volume;
            }
            if (statistic.volume > maxVolume) {
                maxVolume = statistic.volume;
            }
             numOpenPrice++;
            totalOpenPrice += statistic.open_price; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.open_price < minOpenPrice) {
                minOpenPrice = statistic.open_price;
            }
            if (statistic.open_price > maxOpenPrice) {
                maxOpenPrice = statistic.open_price;
            }
               numClosedPrice++;
            totalClosedPrice += statistic.closed_price; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.closed_price < minClosedPrice) {
                minClosedPrice = statistic.closed_price;
            }
            if (statistic.closed_price > maxClosedPrice) {
                maxClosedPrice = statistic.closed_price;
            }
            numWaPrice++;
            totalWaPrice += statistic.wa_price; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.closed_price < minWaPrice) {
                minWaPrice = statistic.wa_price;
            }
            if (statistic.wa_price > maxWaPrice) {
                maxWaPrice = statistic.wa_price;
            }
              numMedian++;
            totalMedian += statistic.median; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.median < minMedian) {
                minMedian = statistic.median;
            }
            if (statistic.median > maxMedian) {
                maxMedian = statistic.median;
            }
              numDonchTop++;
            totalDonchTop += statistic.donch_top; // Add min price to totalPrices

            // Update min and max prices if needed
            if (statistic.donch_top < minDonchTop) {
                minDonchTop = statistic.donch_top;
            }
            if (statistic.donch_top > maxDonchTop) {
                maxDonchTop = statistic.donch_top;
            }
            

        });
  
        var averagePrice = totalPrices / numPrices; // Calculate average price
        var averageVolume = totalVolume / numVolume; // Calculate average price
        var averageOpenPrice = totalOpenPrice / numOpenPrice; // Calculate average price
        var averageClosedPrice = totalClosedPrice / numClosedPrice; // Calculate average price
        var averageWaPrice = totalWaPrice / numWaPrice; // Calculate average price
        var averageMedian = totalMedian / numMedian; // Calculate average price
        var averageDonchTop = totalDonchTop / numDonchTop; // Calculate average price

        // Create list item for overall statistics
        var overallStatsItem = document.createElement('li');
          var itemName = document.getElementById('itemName').value;
          itemName = toTitleCase(itemName);
        overallStatsItem.textContent = `Overall Statistics for ${itemName}: Min Price: ${minPrice} |\nMax Price: ${maxPrice} |\nAverage Price: ${averagePrice.toFixed(2)} |\nVolume: ${averageVolume.toFixed(2)} |\nOpen Price: ${averageOpenPrice.toFixed(2)} |\nClosed Price: ${averageClosedPrice.toFixed(2)} |\n WA Price: ${averageWaPrice.toFixed(2)} |\nMedian: ${averageWaPrice.toFixed(2)} |\nDonch Top: ${averageDonchTop.toFixed(2)}`;
        overallStatsItem.classList.add('overall-stats-item'); // Add class for styling
        statisticsList.appendChild(overallStatsItem);

        statisticsResultContainer.appendChild(statisticsList);
    } else {
        var itemName = document.getElementById('itemName').value;
itemName = itemName.toLowerCase().replace(/\s+/g, '_');
alertify.alert("Error!", "No statistics available for the past 48 hours.", function(){});
        statisticsResultContainer.textContent = "";
    }
}
