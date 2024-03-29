// create the configurable selection modifier
var fishbone = d3.fishbone();

//The json data
var jsonData = {
    "name": "Quality",
    "children": [
        {
            "name": "Machine",
            "children": [
                {
                    "name": "Needle",
                    "children": [{ "name": "Automation" }]
                },
                { "name": "Gearbox" }
            ]
        },
        {
            "name": "Method",
            "children": [{ "name": "Procedure" }]
        },
        {
            "name": "Material",
            "children": [{ "name": "Component" }]
        },
        {
            "name": "Man Power",
            "children": [{ "name": "Employee" }]
        },
        {
            "name": "Measurement",
            "children": [
                {
                    "name": "Tool",
                    "children": [{ "name": "Scale" }]
                },
                { "name": "Gauge" }
            ]
        },
        {
            "name": "Milieu",
            "children": [{ "name": "Environment" }]
        }
    ]
};

function updateDiagram() {
    svg.datum(jsonData).call(fishbone.defaultArrow).call(fishbone);
    fishbone.force().start();
};

var customWidth = 1100; // Specify your desired width
var customHeight = 400; // Specify your desired height

// the most reliable way to get the screen size
var size = (function () {
    return { width: this.clientWidth-250, height: this.clientHeight };
}).bind(window.document.documentElement),

    svg = d3.select("#svgContainer")
        .append("svg")
        // firefox needs a real size
        .attr(size())
        // .attr("width",customWidth)
        // .attr("height",customHeight)
        // set the data so the reusable chart can find it
        .datum(jsonData)
        // set up the default arrowhead
        .call(fishbone.defaultArrow)
        // call the selection modifier
        .call(fishbone);

// this is the actual `force`: just start it
fishbone.force().start();

// for the checkbox logic.
function unselectOthers(clickedId) {
    // Remove red background from all labels
    $('[name="checkbox"]').siblings('label').css({
        'background-color': '',
        'color': '',
    });

    // Uncheck other checkboxes
    $('[name="checkbox"]').not('#' + clickedId).prop('checked', false);

    // Add red background to labels associated with checked checkboxes
    $('[name="checkbox"]').each(function () {
        if ($(this).prop('checked')) {
            $(this).next('label').css({
                'background': '#0ca929',
                'color': '#fff',
            });
        };
    });
};
unselectOthers("bone-add");
unselectOthers("bone-delete");
unselectOthers("bone-rename");

$(document).on("click", ".toggle-tree", function () {
    $(".maintree-container").toggle("slow");
});

$(document).ready(function () {
    //for the bones color
    $('.link-0').css({
        "stroke": "#000",
        "stroke-width": "2px"
      });
      $('.link-1').css({
        "stroke": "#333",
        "stroke-width": "1px"
      });
      $('.link-2').css({
        "stroke": "#666",
        "stroke-width": ".5px"
      });
      $('.link-3').css({
        "stroke": "#666",
        "stroke-width": ".5px"
      });
      $('.link-4').css({
        "stroke": "#666",
        "stroke-width": ".5px"
      });

      //for converting svg to image.
      $('#convertButton').on('click', function () {
        var svgElement = $('#svgContainer').find('svg').get(0); // Find SVG within container
        if (!svgElement) {
          // console.error('SVG element not found.');
          return;
        }
        var canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth;
        canvas.height = svgElement.clientHeight;
        var ctx = canvas.getContext('2d');
        // Fill the canvas with white color
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var svgXml = new XMLSerializer().serializeToString(svgElement);
        var img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          var pngDataUrl = canvas.toDataURL('image/png');
          var link = $('<a>').attr({
            href: pngDataUrl,
            download: 'Fishbone_digram.png' // Set the filename for the downloaded PNG file
          });
          $('body').append(link);
          link[0].click();
          link.remove();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgXml);
      });


    // Function to create the tree diagram
    function showTree(container, data) {
        const ul = $('<ul></ul>');
        data.forEach(node => {
            const li = $("<li class='tree-node'></li>").text(node.name);
            if (node.children && node.children.length > 0) {
                li.addClass('has-children');
                li.click(function (event) {
                    event.stopPropagation(); // Prevent event propagation
                    $(this).children('ul').toggle();
                });
                showTree(li, node.children);
            };
            ul.append(li);
        });
        container.append(ul);
    };





    $("#tree-box").on("contextmenu", function (e) {
        let resultNode = getNode(jsonData, e.target.innerText);
        let parentNode = resultNode.parent;
        // console.log(resultNode.name, parentNode ? parentNode.name : null, e);

        if (!parentNode) {
            console.log("Error: Parent node not found in JSON data");
            return;
        };

        // Find the immediate parent node to add the sub-bone
        while (parentNode.name !== "Quality" && parentNode.children.length === 0) {
            resultNode = parentNode;
            parentNode = parentNode.parent;
        };

        // for adding bones
        if (whichIsSelected() === 0) {
            let nodeText = resultNode.name;
            let newText = prompt("Enter Sub Bone Name for '" + nodeText + "':");
            if (newText !== null && newText.trim() !== '') {
                updateData(newText, resultNode);
                updateTree($("#tree-box"), jsonData.children);
            }
        }

        // for delete bones
        if (whichIsSelected() === 1) {
            if (parentNode.name !== "Quality") {
                let deleteConfirm = confirm("are you sure you want to delete this bone : '" + resultNode.name + "' !! Note the sub bones will also get delted")
                if (deleteConfirm) {
                    deleteChild(parentNode, resultNode.name);
                    updateTree($("#tree-box"), jsonData.children);
                } else {
                    return;
                };
            } else {
                console.log("Cannot delete the 'Quality' node.");
            };
        };

        // for renaming the bones
        if (whichIsSelected() === 2) {
            let nodeText = resultNode.name;
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
                    updateTree($("#tree-box"), jsonData.children);
                } else {
                    //   console.log("Error: Node not found in JSON data");
                };
            };
        };
    });

    // which task is selected
    function whichIsSelected() {
        let boneAdd = $("#bone-add")[0].checked
        let boneDelete = $("#bone-delete")[0].checked
        let boneRename = $("#bone-rename")[0].checked

        switch (true) {
            case boneAdd:
                return 0;
                break;
            case boneDelete:
                return 1;
                break;
            case boneRename:
                return 2;
            default:
                return null;
                break;
        };
    };

    function updateData(text, parent) {
        if (!parent.children) {
            // If parent.children is not defined or null, initialize it as an empty array
            parent.children = [];
        };
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
            updateFishbone();


        } else {
            // console.log("Child node '" + childName + "' not found.");
        };
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
    // Function to update the tree diagram
    function updateTree(container, data) {
        container.empty();
        showTree(container, data);
    };
    // Function to update the fishbone diagram
    function updateFishbone() {
        svg.datum(jsonData).call(fishbone.defaultArrow).call(fishbone);
        fishbone.force().start();
    };

    showTree($("#tree-box"), jsonData.children);
    $("#tree-box").append('')
    updateFishbone();
});