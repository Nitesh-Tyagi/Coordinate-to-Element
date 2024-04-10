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
};

let drawing = false;
let startX, startY;
let width, height;
let currentX, currentY;

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
            canvas.style.pointerEvents = 'auto';
        } else {
            canvas.style.pointerEvents = 'none';
        }
        console.log("POINTER EVENTS : ",canvas.style.pointerEvents);
    });
}

function setupKeypressActions() {
    console.log("Coordinate-to-Element");
    document.addEventListener('keydown', function(event) {
        if (event.key === '0') {
            togglePointerEventsForCanvas();
        } else if (event.key === '1') {
            clearCanvas();
        } else if (event.key === '2') {
            console.log("DRAWING START");
            clearCanvas();
            enableDrawing();
            console.log("DRAWING END");
        } else if (event.key === '3') {
            console.log("StartX : ",startX);
            console.log("StartY : ",startY);
            console.log("Width : ",width);
            console.log("Height : ",height);
        } else if (event.key === '4') {
            // FIND ELEMENT
            // DRAW FOUND ELEMENT
        }
    });
}
setupKeypressActions();