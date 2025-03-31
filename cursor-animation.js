(function(){
    // Dynamically create and append the cursor ball if not already in the DOM
    let ball = document.getElementById('cursorBall');
    if (!ball) {
      ball = document.createElement('div');
      ball.id = 'cursorBall';
      ball.className = 'cursor-ball';
      document.body.appendChild(ball);
    }
    
    // Dynamically create and append the canvas for the trail if not already in the DOM
    let canvas = document.getElementById('trailCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'trailCanvas';
      document.body.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set the canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Store points for the trail
    const points = [];
    const maxPoints = 40;
    const trailLifetime = 200;
    
    // Variables for mouse and ball positions with easing for smooth movement
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    let lastX = 0, lastY = 0;
    const easing = 0.2;
    const minDistance = 1;
    
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function updateBallPosition() {
      // Smoothly update the ball's position
      ballX += (mouseX - ballX) * easing;
      ballY += (mouseY - ballY) * easing;
      ball.style.left = ballX + 'px';
      ball.style.top = ballY + 'px';
      
      // Add a new point only if the movement is enough
      const dx = Math.abs(ballX - lastX);
      const dy = Math.abs(ballY - lastY);
      if (dx + dy > minDistance) {
        lastX = ballX;
        lastY = ballY;
        addPoint(ballX, ballY);
      }
    }
    
    function addPoint(x, y) {
      points.push({ x, y, timestamp: Date.now() });
      if (points.length > maxPoints) {
        points.shift();
      }
    }
    
    function drawTrail() {
      // Clear the canvas with a transparent fade effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (points.length < 2) return;
      
      const now = Date.now();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      // Create a smooth curve through the points
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      // Solid black trail with opacity 1
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Solid black, no transparency
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Remove points that have exceeded their lifetime
      while (points.length > 0 && now - points[0].timestamp > trailLifetime) {
        points.shift();
      }
    }
    
    function animate() {
      updateBallPosition();
      drawTrail();
      requestAnimationFrame(animate);
    }
    
    // Start the animation loop
    animate();
  })();
  