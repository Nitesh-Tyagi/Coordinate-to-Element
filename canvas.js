var ctx,canvas;

window.onload = function() {
    canvas = document.createElement('canvas');
    canvas.className = 'extension-canvas';
    document.body.appendChild(canvas);
    
    ctx = canvas.getContext("2d");

    // Resize the canvas to fill the browser window dynamically
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();

    let ripples = [];
    let currentInterval = null;

    
    function addRipple(x, y) {
      if (ripples.length === 0 || ripples[ripples.length - 1].circles.length >= 2) {
        // Start a new ripple if there is no ripple or the last ripple already has two circles
        ripples.push({
          x: x,
          y: y,
          circles: [{ radius: 0, opacity: 0.8 }]
        });
      } else {
        // Add second circle to the last ripple
        ripples[ripples.length - 1].circles.push({ radius: 0, opacity: 0.8 });
      }
    }

    canvas.addEventListener("click", function (event) {
      // Clear previous interval
      if (currentInterval !== null) {
        clearInterval(currentInterval);
      }
      // Start a new interval for creating ripples
      currentInterval = setInterval(() => {
        addRipple(event.clientX, event.clientY);
      }, 800); // Adjust timing of circles
    });

    // function draw() {
    //   // if(ripples.length>0) console.log("DRAWING : ",ripples);
    //   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    //   // Draw each ripple
    //   ripples.forEach((ripple, index) => {
    //     ripple.circles.forEach((circle) => {
    //       if (circle.radius > 0) {
    //         ctx.beginPath();
    //         ctx.arc(ripple.x, ripple.y, circle.radius, 0, 2 * Math.PI);
    //         ctx.fillStyle = `rgba(66, 164, 245, ${circle.opacity})`; // Sky blue color with alpha
    //         ctx.fill();
    //       }

    //       circle.radius += 0.6; // Speed of radius increase
    //       circle.opacity -= 0.011; // Speed of fading
    //     });

    //     if (ripple.circles.every((circle) => circle.opacity <= 0)) {
    //       ripples.splice(index, 1);
    //     }
    //   });

    //   requestAnimationFrame(draw);
    // }

    // draw();

    drawInterval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    
      // Draw each ripple
      ripples.forEach((ripple, index) => {
        ripple.circles.forEach((circle) => {
          if (circle.radius > 0) {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, circle.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(66, 164, 245, ${circle.opacity})`; // Sky blue color with alpha
            ctx.fill();
          }
    
          circle.radius += 2; // Speed of radius increase
          circle.opacity -= 0.04; // Speed of fading
        });
    
        if (ripple.circles.every((circle) => circle.opacity <= 0)) {
          ripples.splice(index, 1);
        }
      });
    }, 50);
}