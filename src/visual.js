function handleFiles(fnCounterFile, sourceMapFile) {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(event) {
        const fnCounterData = JSON.parse(event.target.result);
        reader2.readAsText(sourceMapFile);
    };

    reader2.onload = function(event) {
        const sourceMapData = JSON.parse(event.target.result);
        visualizeData(fnCounterData, sourceMapData);
    };

    reader1.readAsText(fnCounterFile);
}

function visualizeData(fnCounterData, sourceMapData) {
    // Implement visualization logic here
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = JSON.stringify(fnCounterData, null, 2) + '<br>' + JSON.stringify(sourceMapData, null, 2);
}

window.visualize = function() {
    const fnCounterFile = document.getElementById('fnCounterFile').files[0];
    const sourceMapFile = document.getElementById('sourceMapFile').files[0];
    if (fnCounterFile && sourceMapFile) {
        handleFiles(fnCounterFile, sourceMapFile);
    } else {
        alert('Please upload both __fn__counter JSON file and sourcemap file.');
    }
};
