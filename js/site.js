
// Load the initial JSON data
var jsonData;
// Add event listener to the filter button
var filterButton = document.getElementById('filter-button');
var filterActive = false;
var filteredData;
var filteredInteractionData;

var highlightColorArticles = 'lightgrey';



loadData();


// Function to load the JSON data from the file
function loadData() {
    fetch('./data/articlesslr.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data.filter(entry => {
                return entry["Include"] !== "FALSE" && entry["Include"] !== "";
            });
            filterAndDisplayData();
        });
}

function createInteractionData(data) {
    const result = [];

    // Define the keys you want to consider
    const keysToConsider = [
        "Interaction Partner A",
        "Interaction Partner A - Other",
        "Role of Interaction Partner A",
        "Interaction Partner B",
        "Interaction Partner B - Other",
        "Role of Interaction Partner B",
        "Situation - Traffic Density",
        "Situation - Traffic Density B",
        "Situation - Lane Number",
        "Situation - Lane Number B",
        "Situation - Traffic Autonomy",
        "Situation - Traffic Autonomy B",
        "Situation - Lane Setting",
        "Situation - Significant Other Situation Conditions",
        "Interaction Relationship - Entity Relationship",
        "Interaction Relationship - Interaction Mapping",
        "Interaction Relationship - Interaction Flow",
        "Interaction Relationship - Position Dependency",
        "Interaction Relationship - Time Synchronicity"
    ];

    data.forEach(entry => {
        let newEntries = [entry];

        // Iterate through the keys in the entry
        for (const key in entry) {
            // Check if the key is one of the keys to consider
            if (keysToConsider.includes(key)) {

                // Remove " (define)" from the value and trim spaces
                let cleanedValue = entry[key].replace(" (define)", "").trim();

                // Check if the value is a string and contains ","
                if (typeof cleanedValue === 'string' && cleanedValue.includes(', ')) {

                    const values = cleanedValue.split(', ').map(value => value.trim());

                    // Create new entries based on the split values
                    const tempEntries = [];
                    newEntries.forEach(newEntry => {
                        values.forEach(value => {
                            const clonedEntry = { ...newEntry };
                            clonedEntry[key] = value;
                            tempEntries.push(clonedEntry);
                        });
                    });

                    newEntries = tempEntries;
                } else {
                    // If the value doesn't need to be split, still update it to the cleaned value
                    entry[key] = cleanedValue;
                }
            }
        }
        result.push(...newEntries);
    });

    return result;
}

$(document).ready(function () {
    $('.btn-group .btn').click(function () {
        console.log("btn click");
        $(this).toggleClass('btn-outline-primary btn-primary active');
        filterAndDisplayData();
    });

    $('#clear-filters').click(function () {
        // Deselect all filter buttons
        $('.btn-group .btn').removeClass('btn-primary active').addClass('btn-outline-primary');
        // Update the displayed data (assuming you have a function for this)
        filterAndDisplayData();  // Display original data without any filters
    });
});

function filterAndDisplayData() {
    var activeFilters = [];
    $('.btn-group .btn.active').each(function () {
        activeFilters.push($(this).text().trim().toLowerCase());
    });


    filteredData = jsonData;


    if (activeFilters.length > 0) {
        filteredData = jsonData.filter(entry => {
            // Check for Filters
            var interactionPartnerA = entry['Interaction Partner A'].toLowerCase();
            var interactionPartnerB = entry['Interaction Partner B'].toLowerCase();
            var roleA = entry['Role of Interaction Partner A'].toLowerCase();
            var roleB = entry['Role of Interaction Partner B'].toLowerCase();
            var trafficDensityA = entry['Situation - Traffic Density'].toLowerCase();
            var laneNumberA = entry['Situation - Lane Number'].toLowerCase();
            var laneSettingA = entry['Situation - Lane Setting'].toLowerCase();
            var trafficAutonomy = entry['Situation - Traffic Autonomy'].toLowerCase();
            var entityRelationship = entry['Interaction Relationship - Entity Relationship'] ? entry['Interaction Relationship - Entity Relationship'].toLowerCase() : "not applicable";
            var interactionMapping = entry['Interaction Relationship - Interaction Mapping'].toLowerCase();
            var interactionFlow = entry['Interaction Relationship - Interaction Flow'].toLowerCase();
            var positionDependency = entry['Interaction Relationship - Position Dependency'].toLowerCase();
            var timeSynchronicity = entry['Interaction Relationship - Time Synchronicity'].toLowerCase();

            return activeFilters.every(filter => {
                console.log(filter)
                if (filter === "cyclist") {
                    return interactionPartnerA === filter ||
                        interactionPartnerB === filter
                } else {
                    return interactionPartnerA.includes(filter) ||
                        interactionPartnerB.includes(filter) ||
                        roleA.includes(filter) ||
                        roleB.includes(filter) ||
                        trafficDensityA.includes(filter) ||
                        laneNumberA.includes(filter) ||
                        laneSettingA.includes(filter) ||
                        trafficAutonomy.includes(filter) ||
                        entityRelationship.includes(filter) ||
                        interactionMapping.includes(filter) ||
                        interactionFlow.includes(filter) ||
                        positionDependency.includes(filter) ||
                        timeSynchronicity.includes(filter);
                }
            });
        });
    }

    filteredInteractionData = createInteractionData(filteredData);

    displayData(); // Make sure this function is defined to display the data
}





// Function to display the JSON data
function displayData() {

    var container = document.getElementById('json-container');
    container.innerHTML = ''; // Clear existing content

    // Create a Bootstrap list group
    var listGroup = document.createElement('div');
    listGroup.className = 'list-group';

    filteredData.forEach((entry, index) => {
        // Create a button for the title
        var titleButton = document.createElement('button');
        titleButton.className = 'list-group-item list-group-item-action';
        titleButton.setAttribute('data-bs-toggle', 'collapse');
        titleButton.setAttribute('data-bs-target', '#details-' + index);
        titleButton.setAttribute('id', entry['Unique Concept ID']);
        // Get the Article Title and Concept Number from the entry object
        const articleTitle = entry['Article Title'];
        const conceptNumber = entry['Concept Number'];

        // Initialize combinedText with the Article Title
        let combinedText = articleTitle;

        // Conditionally append Concept Number if it's not an empty string
        if (conceptNumber !== "") {
            combinedText += ` (${conceptNumber})`;
        }

        // Set the combined text as the content of the titleButton
        titleButton.textContent = combinedText;

        // Create a div for the details
        var detailsDiv = document.createElement('div');
        detailsDiv.className = 'collapse';
        detailsDiv.id = 'details-' + index;
        detailsDiv.style.paddingLeft = '16px'; // Add padding to the left

        // Add the other parameters (excluding the specified ones)
        for (var key in entry) {
            if (key !== 'Article ID' && key !== 'Resolve?' && key !== 'Concept Number' && key !== 'Unique Concept ID' && key !== 'BibTex Key' && key !== 'User Note' && key !== 'Notes' && key !== 'Status' && key !== 'User Count' && key !== 'User Name' && key !== 'Include' && key !== 'Article Title' && key !== 'Interaction Modalities') {

                // Check if entry[key] is not an empty string
                if (entry[key] !== "") {
                    var para = document.createElement('p');
                    para.style.margin = '4px 0'; // Reduce spacing between elements

                    // Create a strong element for bold text
                    var strong = document.createElement('strong');
                    strong.textContent = key + ': ';
                    para.appendChild(strong);

                    // Check if the value is a link
                    var value = entry[key];
                    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
                        var link = document.createElement('a');
                        link.href = value;
                        link.textContent = value;
                        link.target = '_blank'; // Open in a new tab
                        para.appendChild(link);
                    } else {
                        para.appendChild(document.createTextNode(value));
                    }

                    detailsDiv.appendChild(para);
                }
            }
        }

        listGroup.appendChild(titleButton);
        listGroup.appendChild(detailsDiv);
    });

    container.appendChild(listGroup);

    // Update the entry count
    var entryCount = document.getElementById('entry-count');
    entryCount.textContent = 'Cross-Traffic Interaction Concepts found: ' + filteredData.length;
    createParallelCategories();
    createArcDiagram();
}



function createParallelCategories() {
    var colors = Array(filteredInteractionData.length).fill('lightgray');
    // Extract data from filteredData
    var lanes = filteredInteractionData.map(entry => entry['Situation - Lane Number']);
    var setting = filteredInteractionData.map(entry => entry['Situation - Lane Setting']);
    var density = filteredInteractionData.map(entry => entry['Situation - Traffic Density']);
    var autonomy = filteredInteractionData.map(entry => entry['Situation - Traffic Autonomy']);

    var entityRel = filteredInteractionData.map(entry => entry['Interaction Relationship - Entity Relationship'] ? entry['Interaction Relationship - Entity Relationship'].toLowerCase() : "not applicable");
    var mapping = filteredInteractionData.map(entry => entry['Interaction Relationship - Interaction Mapping']);
    var flow = filteredInteractionData.map(entry => entry['Interaction Relationship - Interaction Flow']);
    var posDep = filteredInteractionData.map(entry => entry['Interaction Relationship - Position Dependency']);
    var timeSync = filteredInteractionData.map(entry => entry['Interaction Relationship - Time Synchronicity']);

    var dataSituation = [{
        type: 'parcats',
        dimensions: [
            { label: 'Number of lanes', values: lanes },
            { label: 'Lane setting', values: setting },
            { label: 'Traffic density', values: density },
            { label: 'Traffic autonomy', values: autonomy }
        ],
        line: { color: colors, shape: 'hspline' }
    }];

    var dataInteractionRelationship = [{
        type: 'parcats',
        dimensions: [
            { label: 'Entitiy Relationship', values: entityRel },
            { label: 'Interaction Mapping', values: mapping },
            { label: 'Interaction Flow', values: flow },
            { label: 'Position Dependency', values: posDep },
            { label: 'Time Synchronicity', values: timeSync }
        ],
        line: { color: colors, shape: 'hspline' }
    }];

    var layout = {
        dragmode: 'lasso'
    };


    Plotly.newPlot('S-container', dataSituation, layout);
    Plotly.newPlot('IR-container', dataInteractionRelationship, layout)

    // Update color on selection and click
    var update_color = function (points_data, containerID) {
        resetColors();
        console.log(points_data);
        var new_color_S = Array(filteredInteractionData.length).fill('lightgrey');
        var new_color_IR = Array(filteredInteractionData.length).fill('lightgrey');
        var highlightColorS = '#80B3AC'; // Color for S-container
        var highlightColorIR = '#9EC1A3'; // Color for IR-container

        for (var i = 0; i < points_data.points.length; i++) {
            var clickedData = filteredInteractionData[points_data.points[i].pointNumber];
            console.log(clickedData['Unique Concept ID']);
            var articleID = clickedData['Unique Concept ID'];

            // Update colors for both containers but use different highlight colors
            new_color_S[points_data.points[i].pointNumber] = highlightColorS;
            new_color_IR[points_data.points[i].pointNumber] = highlightColorIR;

            // Update background color based on which container was clicked
            document.getElementById(articleID).style.backgroundColor = highlightColorArticles;

            highlightArcLinks(clickedData);
        }

        // Update color of selected paths in both parallel categories diagrams
        Plotly.restyle('S-container', { 'line.color': [new_color_S] });
        Plotly.restyle('IR-container', { 'line.color': [new_color_IR] });
    };

    var gd = document.getElementById('S-container');
    var gdIR = document.getElementById('IR-container');

    // Bind the click events and pass the container ID to update_color
    gd.on('plotly_click', function (points_data) { update_color(points_data, 'S-container'); });
    gdIR.on('plotly_click', function (points_data) { update_color(points_data, 'IR-container'); });

}


function createArcDiagram() {

    var arcClicked = false;
    // Clear any existing visualization
    d3.select("#arcDiagram").selectAll("*").remove();

    // Set the dimensions and margins of the graph
    var margin = { top: 0, right: 30, bottom: 200, left: 90 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Append the svg object to the container
    var svg = d3.select("#arcDiagram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var nodes = [];
    var links = [];
    var linkSet = new Set(); // To ensure unique links
    var nodeCounts = {};

    filteredInteractionData.forEach(entry => {
        // Remove unnecessary spaces from node names
        let ipA = entry['Interaction Partner A'].trim();
        let ipB = entry['Interaction Partner B'].trim();

        // Increment the count for each node
        nodeCounts[ipA] = (nodeCounts[ipA] || 0) + 1;
        nodeCounts[ipB] = (nodeCounts[ipB] || 0) + 1;

        // Add nodes
        if (!nodes.some(node => node.name === ipA)) {
            nodes.push({ name: ipA });
        }
        if (!nodes.some(node => node.name === ipB)) {
            nodes.push({ name: ipB });
        }

        //// Check for unique links
        //var linkKey = [ipA, ipB].sort().join('-');
        //if (!linkSet.has(linkKey)) {
        //    links.push({
        //        source: ipA,
        //        target: ipB
        //    });
        //    linkSet.add(linkKey);
        //}


        // Check for unique links
        var linkKey = [ipA, ipB].sort().join('-');
        if (!linkSet.has(linkKey)) {
            links.push({
                source: ipA,
                target: ipB,
                selfLink: ipA === ipB // Add this line to identify self-links
            });
            linkSet.add(linkKey);
        }
    });

    // List of node names
    var allNodes = nodes.map(function (d) { return d.name });

    // A linear scale for node size
    var size = d3.scaleLinear()
        .domain([1, Math.max(...Object.values(nodeCounts))])
        .range([10, 30]);

    // A linear scale to position the nodes on the X axis
    var x = d3.scalePoint()
        .range([0, width])
        .domain(allNodes);

    // Add the links
    var linksElements = svg
        .selectAll('path.mylinks')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'mylinks')
        .attr('d', function (d) {
            if (d.selfLink) { // Handle self-links
                const radius = size(nodeCounts[d.source]);
                return `M ${x(d.source)} ${height - 30} 
                    a ${radius} ${radius} 0 1 0 ${radius * 2} 0 
                    a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
            } else {
                // Existing logic for normal links
                start = x(d.source);
                end = x(d.target);
                return ['M', start, height - 30,
                    'A',
                    (start - end) / 2, ',',
                    (start - end) / 2, 0, 0, ',',
                    start < end ? 1 : 0, end, ',', height - 30]
                    .join(' ');
            }
        })
        .style("fill", "none")
        .attr("stroke", "lightgrey")
        .style("stroke-width", 1);

    // Add the circle for the nodes
    var nodesElements = svg
        .selectAll("path.mynodes")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "mynodes")
        .attr("cx", function (d) { return (x(d.name)) })
        .attr("cy", height - 30)
        .attr("r", function (d) { return size(nodeCounts[d.name]) })
        .style("fill", 'lightgrey')
        .attr("stroke", "white");

    // And give them a label
    var labels = svg
        .selectAll("mylabels")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text(function (d) { return (d.name) })
        .style("text-anchor", "end")
        .attr("transform", function (d) { return ("translate(" + (x(d.name)) + "," + (height - 15) + ")rotate(-45)") })
        .style("font-size", 16);

    nodesElements
        .on('click', function (d) {

            resetColors();

            // Highlight the clicked node
            nodesElements.style('fill', 'lightgrey');
            d3.select(this).style('fill', "#CFE0C3");


            // Highlight the connections
            linksElements
                .style('stroke', function (link_d) {
                    console.log("Checking link:", link_d.source, link_d.target); // This is for debugging
                    if (link_d.source === d.name || link_d.target === d.name) {
                        return "#CFE0C3";
                    } else {
                        return 'lightgrey';
                    }
                    return (link_d.source === d.name || link_d.target === d.name) ? "#CFE0C3" : 'lightgrey';
                });


            var currentColorsLength = Plotly.d3.select('#S-container')[0][0].data[0].line.color.length;
            currentColorsS = Array(currentColorsLength).fill('lightgrey');
            var currentColorsIR = Plotly.d3.select('#IR-container')[0][0].data[0].line.color;
            console.log("Initial currentColorsS:", currentColorsS);
            console.log("Initial currentColorsIR:", currentColorsIR);

            console.log("Länge:" + filteredInteractionData.length);

            // Update the color of the corresponding data streams
            filteredInteractionData.forEach((entry, index) => {
                let ipA = entry['Interaction Partner A'].trim();
                let ipB = entry['Interaction Partner B'].trim();
                if (ipA === d.name.trim() ||
                    ipB === d.name.trim()) {
                    currentColorsS[index] = '#80B3AC';
                    currentColorsIR[index] = '#9EC1A3';
                    var articleID = entry['Unique Concept ID'];
                    document.getElementById(articleID).style.backgroundColor = highlightColorArticles;
                }
            });

            console.log("After coloring currentColorsS:", currentColorsS);
            console.log("After coloring currentColorsIR:", currentColorsIR);

            // Redraw the parallel categories with the updated colors
            Plotly.restyle('S-container', { 'line.color': [currentColorsS] });
            Plotly.restyle('IR-container', { 'line.color': [currentColorsIR] });

        });
}


function resetColors() {

    // Get the container that holds the buttons
    var container = document.getElementById("json-container");

    // Get all the buttons inside the container
    var buttons = container.getElementsByTagName("button");

    // Loop through all the buttons and reset their color
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "";
    }


    d3.select("#arcDiagram").selectAll('.mylinks').style('stroke', 'lightgrey');
    d3.select("#arcDiagram").selectAll('.mynodes').style('fill', 'lightgrey');


    var new_color = Array(filteredInteractionData.length).fill('lightgrey');
    Plotly.restyle('S-container', { 'line.color': [new_color] });
    Plotly.restyle('IR-container', { 'line.color': [new_color] });


}


function highlightArcLinks(clickedData) {
    
    // Remove unnecessary spaces from node names
    let ipA = clickedData['Interaction Partner A'].trim();
    let ipB = clickedData['Interaction Partner B'].trim();


    d3.select("#arcDiagram").selectAll('.mylinks').style('stroke', function (link_d) {

        if ((link_d.source === ipA && link_d.target === ipB) || (link_d.source === ipB && link_d.target === ipA)) {
            return "#CFE0C3";
        } else {
            return d3.select(this).style("stroke"); // return current stroke color
        }
    });

    d3.select("#arcDiagram").selectAll('.mynodes').style('fill', function (node) {

        if (node.name === ipA || node.name === ipB) {
            console.log(node.name);
            return "#CFE0C3";
        } else {
            return d3.select(this).style("fill"); // return current stroke color
        }
    });
}



