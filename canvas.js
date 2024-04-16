var ctx,canvas;

window.onload = function() {
    canvas = document.createElement('canvas');
    canvas.className = 'extension-canvas';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    function adjustCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', adjustCanvasSize);
    function onUserInput(event) {
        console.log("EVENT : ",event);
        clearCanvas();
        printRect(xpath);
    }
    
    // document.addEventListener('click', onUserInput);
    document.addEventListener('scroll', onUserInput, true);
    // document.addEventListener('keypress', onUserInput);
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', onUserInput);
    });
    const scrollableElements = document.querySelectorAll('.scrollable');
    scrollableElements.forEach(element => {
        element.addEventListener('scroll', onUserInput);
    });
    
};

// function getXPathByElement(element) {
//     if (element.id !== '') { // If ID Exists
//         return `id("${element.id}")`;
//     }
//     if (element === document.body) { // Body, base case
//         return '/html/body';
//     }

//     let ix = 0;
//     const siblings = element.parentNode.childNodes;
//     for (let i = 0; i < siblings.length; i++) {
//         const sibling = siblings[i];
//         if (sibling === element) {
//             return `${getXPathByElement(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
//         }
//         if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
//             ix++;
//         }
//     }
// }
function getXPathByElement(element) {
    if (element.id && element.id !== '') { // Use ID if possible
        return `//*[@id="${element.id}"]`;
    }
    if (element === document.body) { // The body element is the XPath root
        return '/html/body';
    }

    var index = 1; // XPath is 1-indexed
    for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
            index++;
        }
    }

    return `${getXPathByElement(element.parentNode)}/${element.tagName.toLowerCase()}[${index}]`;
}

function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}



let drawing = false;
let startX, startY;
let width, height;
let currentX, currentY;
let closestMatch = null, xpath;

function enableDrawing() {
    canvas.onmousedown = function(e) {
        drawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    };

    canvas.onmousemove = function(e) {
        if (drawing) {
            currentX = e.offsetX;
            currentY = e.offsetY;
            width = currentX - startX;
            height = currentY - startY;

            // Clear the canvas and redraw the last rectangle
            clearCanvas();
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Translucent green
            ctx.fillRect(startX, startY, width, height);
        }
    };

    canvas.onmouseup = function() {
        drawing = false;
    };

    canvas.onmouseout = function() {
        drawing = false;
    };
}

function clearCanvas() {
    if(!ctx) return;
    console.log("CLEARED CANVAS");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function togglePointerEventsForCanvas() {
    var canvasElements = document.querySelectorAll('.extension-canvas');
    canvasElements.forEach(function(canvas) {
        if (canvas.style.pointerEvents === 'none') {
            console.log("CANVAS RESUMED");
            canvas.style.pointerEvents = 'auto';
        } else {
            console.log("CANVAS STOPPED");
            canvas.style.pointerEvents = 'none';
        }
        // console.log("POINTER EVENTS : ",canvas.style.pointerEvents);
    });
}

function printRect (xpath) {
    if(!xpath) return;
    var el = getElementByXPath(xpath);
    if(!el) return;

    const rect = el.getBoundingClientRect();
    const startX = rect.left;
    const startY = rect.top;
    const width = rect.right-rect.left;
    const height = rect.bottom-rect.top;
    console.log("ELEMENT COORDINATES - RED");
    console.log("StartX : ",startX);
    console.log("StartY : ",startY);
    console.log("Width : ",width);
    console.log("Height : ",height);

    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Translucent green
    ctx.fillRect(startX, startY, width, height);
}

function findClosestElement() {
    const allElements = document.querySelectorAll("*");
    closestMatch = null;
    let smallestDifference = Infinity;
    let highestZIndex = -Infinity;

    allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const distance = Math.sqrt(Math.pow(rect.left - startX, 2) + Math.pow(rect.top - startY, 2));
        const sizeDifference = Math.abs(rect.width - width) + Math.abs(rect.height - height);
        const totalDifference = distance + sizeDifference;
        const zIndex = window.getComputedStyle(el).zIndex;
        const numericZIndex = isNaN(parseInt(zIndex)) ? 0 : parseInt(zIndex);

        // Check if this element is a better match based on distance/size and z-index
        if ((totalDifference < smallestDifference) || (totalDifference === smallestDifference && numericZIndex > highestZIndex)) {
            closestMatch = el;
            smallestDifference = totalDifference;
            highestZIndex = numericZIndex;
        }
    });

    if (closestMatch) {
        console.log("CLOSEST MATCH:", closestMatch);
    
        var xpath = getXPathByElement(closestMatch);
        var matchedEle = getElementByXPath(xpath);

        printRect(xpath);

        console.log(xpath,' : ',matchedEle);
        if(closestMatch === matchedEle) console.log("XPATH WORKING FINE");
        else console.log("XPATH DIDN'T MATCH");

    } else {
        console.log("No matching element found.");
    }
}


function setupKeypressActions() {
    console.log("Coordinate-to-Element");
    document.addEventListener('keydown', function(event) {
        if (event.key === '0') {
            togglePointerEventsForCanvas();
        } else if (event.key === '1') {
            console.log("CANVAS CLEARED");
            clearCanvas();
        } else if (event.key === '2') {
            console.log("DRAWING START - GREEN");
            clearCanvas();
            enableDrawing();
            console.log("DRAWING END");
        } else if (event.key === '3') {
            console.log("COORDINATES")
            console.log("StartX : ",startX);
            console.log("StartY : ",startY);
            console.log("Width : ",width);
            console.log("Height : ",height);
        } else if (event.key === '4') {
            findClosestElement();
            // FIND ELEMENT
            // DRAW FOUND ELEMENT
        }
    });
}
setupKeypressActions();