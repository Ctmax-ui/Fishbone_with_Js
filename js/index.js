// create the configurable selection modifier
var fishbone = d3.fishbone();


//The json data
var jsonData = {
    "name": "Quality",
    "children": [
        {
            "name": "Machine",
            "children": [
            ]
        },
        {
            "name": "Method",
            "children": [
            ]
        },
        {
            "name": "Material",
            "children": [
            ]
        },
        {
            "name": "Man Power",
            "children": [
            ]
        },
        {
            "name": "Measurement",
            "children": [
            ]
        },
        {
            "name": "Milieu",
            "children": [
            ]
        }
    ]
};


function updateDiagram() {
    svg.datum(jsonData).call(fishbone.defaultArrow).call(fishbone);
    fishbone.force().start();
}

// the most reliable way to get the screen size
var size = (function () {
    return { width: this.clientWidth, height: this.clientHeight };
}).bind(window.document.documentElement),

    svg = d3.select("body")
        .append("svg")
        // firefox needs a real size
        .attr(size())
        // set the data so the reusable chart can find it
        .datum(jsonData)
        // set up the default arrowhead
        .call(fishbone.defaultArrow)
        // call the selection modifier
        .call(fishbone);

// this is the actual `force`: just start it
fishbone.force().start();

// handle resizing the window.
d3.select(window).on("resize", function () {
    fishbone.force()
        .size([size().width, size().height])
        .start();
    svg.attr(size())
});

//for json update delete and remove.
$('.node').on('contextmenu', function (e) {

    e.preventDefault();
    // Show the popup container
    $("#popupContainer").show();
    // Store the clicked node information in a data attribute of the popup container
    $("#popupContainer").data("clickedNode", $(this));


    //-----------------------for delete-----------------------
    $("#nodeDelete").on("click", function deleteNodes() {
        // Get the clicked node information from the data attribute
        let clickedNode = $("#popupContainer").data("clickedNode");
        // Get the text of the clicked node
        let nodeTxt = clickedNode.text();
        // Get the corresponding node from the JSON data
        let result = getNode(jsonData, nodeTxt);
        // Check if the clicked node is not a main parent node
        function isMainPnode() {
            return !result.parent || result.parent.name === jsonData.name;
        };
        if (!isMainPnode()) {
            var parentNode = getNode(jsonData, result.parent.name);
            deleteChild(parentNode, result.name);
            fnJson(); // Update the visualization
        } else {
            // console.log("error delete");
        };
        hidePopup(); // Hide the popup container after deleting
    });

    //------------------for add---------------------
    $("#nodeAdd").off("click").on("click", function addNode() {
        // Get the text of the clicked node
        let clickedNode = $("#popupContainer").data("clickedNode");
        let nodeText = clickedNode.text();

        // Prompt the user to enter the new sub-bone name
        let newText = prompt("Enter Sub Bone Name for '" + nodeText + "':");

        // Check if the user entered a name
        if (newText !== null && newText.trim() !== '') {
            // Get the corresponding node from the JSON data
            let parentNode = getNode(jsonData, nodeText);

            // Update the JSON data with the new sub-bone name
            if (parentNode) {
                updateData(newText, parentNode);
                fnJson();
            } else {
                console.log("Error: Parent node not found in JSON data");
            };
        };

        hidePopup(); // Hide the popup container after adding
    });

    //------------------for exiting--------------------------
    $("#nodeExit").on("click", hidePopup);

});


// This block of code for renameing the fishbone names.
$('.node').on('click', function (e) {
    e.preventDefault();

    // Get the text of the clicked node
    let nodeText = $(this).text();

    // Prompt the user to enter the new name for the node
    let newName = prompt("Enter the new name for the node:", nodeText);

    // Check if the user entered a new name
    if (newName !== null && newName.trim() !== '') {
        // Update the corresponding node's name in the JSON data
        let nodeToUpdate = getNode(jsonData, nodeText);
        if (nodeToUpdate) {
            nodeToUpdate.name = newName;
            // Update the visualization
            updateDiagram();
        } else {
            //   console.log("Error: Node not found in JSON data");
        }
    }
});


// the json updater function.
function fnJson() {
    // console.log(jsonData);
    updateDiagram(); // Update the visualization after modifying the JSON data
};


//to hide the popup box
function hidePopup() {
    $("#popupContainer").hide();
}


// The Function is used for adding the subbones inside main bones.
function updateData(text, parent) {
    if (!parent.children) {
        // If parent.children is not defined or null, initialize it as an empty array
        parent.children = [];
    }
    // Add the new item to the parent's children
    parent.children.push({ "name": text });
    // Redraw the fishbone diagram with the updated data
    updateDiagram();
};


// Function to delete a child node from the JSON data
function deleteChild(parentNode, childName) {
    // Find the index of the child node in the parent's children array
    var index = parentNode.children.findIndex(child => child.name === childName);
    if (index !== -1) {
        // Remove the child node from the parent's children array
        parentNode.children.splice(index, 1);
        // console.log("Child node '" + childName + "' deleted successfully.");
        fnJson();
    } else {
        // console.log("Child node '" + childName + "' not found.");
    };
};


// Function to check if a name already exists in the JSON data
function nameExists(node, name) {
    if (node.name === name) {
        return true; // Return true if the name matches the current node's name
    };
    if (node.children) {
        // Recursively check each child node
        for (var i = 0; i < node.children.length; i++) {
            if (nameExists(node.children[i], name)) {
                return true; // Return true if the name exists in any child node
            };
        };
    };
    return false; // Return false if the name does not exist in the JSON data
};



// Function to find and return the node in the JSON data
function getNode(node, text) {
    if (node.name === text) {
        return node;
    };
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            var result = getNode(node.children[i], text);
            if (result) {
                return result;
            };
        };
    };
    return null;
};

