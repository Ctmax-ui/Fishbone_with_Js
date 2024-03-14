# Fishbone Structure/Diagram Project

This project implements a fishbone structure/diagram visualization using D3.js. The fishbone diagram, also known as a cause-and-effect diagram, is a tool used for visualizing the potential causes of a problem or effect.


## Overview

The fishbone diagram consists of a central spine (representing the main problem or effect) and branches that radiate from it (representing potential causes or categories of causes). Each branch can further branch out into subcategories, creating a hierarchical structure.


## Features

- **Interactive Visualization:** Users can interact with the diagram by adding, updating, or removing bones (nodes) from the structure.
- **Addition of Bones:** Users can add new bones to the diagram by clicking on existing bones and providing a name for the new bone.
- **Update Bones:** Users can rename existing bones by clicking on them and entering a new name.
- **Removal of Bones:** Users can remove bones from the diagram by right-clicking on them and selecting the delete option.
- **Dynamic Layout:** The diagram layout dynamically adjusts to accommodate new nodes and changes in the structure.


## Technologies Used

- **D3.js:** Utilized for creating the interactive visualization of the fishbone diagram.
- **jQuery:** Used for handling DOM events and interactions.
- **Bootstrap:** Used for styling and layout of the popup container and buttons.


## Usage

1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser to view the fishbone diagram.
3. Interact with the diagram by left-clicking to add or rename bones, and right-clicking to delete bones.


## Project Structure

fishbone_project/
│
├── index.html # HTML file containing the fishbone diagram visualization
├── js/ # Directory containing JavaScript files
│ ├── d3.min.js # D3.js library
│ ├── jquery.min.js# jQuery library
│ └── script.js # Main JavaScript file for handling interactions
├── style.css # Cascading Style Sheets (CSS) file for styling
└── README.md # Project README file

#### Visit [Fishbone_with_Js](https://www.github.com/Ctmax-ui/Fishbone_with_Js) to access the GitHub repository.
