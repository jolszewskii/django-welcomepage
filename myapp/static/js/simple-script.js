var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// get all the icons and the tab contents
const icons = document.querySelectorAll('.icon');
const tabContents = document.querySelectorAll('.tab-content .content');
// variable to keep track of the selected icon index
let selectedIndex = null;
// add a click event listener to each icon 
icons.forEach((icon, index) => {
  icon.addEventListener('click', () => {
    // check if the clicked icon is already selected
    if (selectedIndex === index) {
      // revert the changes made and show all icons and tab contents again
      icons.forEach((icon) => {
        icon.style.display = 'inline-flex';
        icon.style.marginTop = '20px';
        icon.style.position = 'static'; // reset icon position
        icon.style.transform = 'none';
      });
      tabContents.forEach((tabContent) => {
        tabContent.style.display = 'none';
      });
      selectedIndex = null;
    } else {
      // hide all other icons and show only the clicked one at the top of the screen in center, and make it bigger 
      icons.forEach((icon, i) => {
        if (i !== index) {
          icon.style.display = 'none';
        } else {
          icon.style.display = 'flex';
          icon.style.marginTop = '0';
          icon.style.position = 'fixed';
          icon.style.top = '2%';
          icon.style.left = '50%';
          icon.style.transform = 'translateX(-65%)';
        }
      });
      // hide all other tab contents and show only the one that matches the clicked icon's index
      tabContents.forEach((tabContent, i) => {
        if (i !== index) {
          tabContent.style.display = 'none';
        } else {
          // show the tab content in popup window style below the icon that was clicked 
          tabContent.style.display = 'block';
          tabContent.style.position = 'fixed';
          tabContent.style.top = '50%';
          tabContent.style.left = '50%';
          tabContent.style.transform = 'translate(-50%, -50%)';
        }
      });
       
      // create a white frame with rounded boxes for the content
      const content = tabContents[index];
      content.style.border = 'solid 1px #fff';
      content.style.borderRadius = '10px';
      content.style.padding = '20px';
      content.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

      // update the selected index
      selectedIndex = index;
    }
  });
});
// add a click event listener to the document to close the tab content if the user presses the escape key
document.addEventListener('keydown', (e) => {
  if (selectedIndex !== null && e.key === 'Escape') {
    icons[selectedIndex].click();
  }
});
var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});
// creating the circles on mouse click
canvas.addEventListener("click", function() {
  for (var i = 0; i < 12; i++) {
    var radius = Math.random() * 3 + 1;
    var x = mouse.x;
    var y = mouse.y;
    var dx = (Math.random() - 0.5) * 8;
    var dy = (Math.random() - 0.5) * 8;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
});

var maxRadius = 40;
var minRadius = 10;

var colorArray = [
  "#FF6B6B",
  "#FFD06B",
  "#A0EB7B",
  "#66D9EF",
  "#AE81FF"
];

function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fill();
  }
  this.update = function() {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // Interactivity 
    if (mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }
    this.draw();
    // Add trail effect
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.dx, this.y - this.dy);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }
}
var circleArray = [];
function init() {
  circleArray = [];
  for (var i = 0; i < 10; i++) {
    var radius = Math.random() * 3 + 1;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 2;
    var dy = (Math.random() - 0.5) * 2;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function vignette() {
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = Math.min(centerX, centerY);
  var gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius*1.12);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
	gradient.addColorStop(1, 'rgba(0,0,0,0.76)');
  var time = new Date().getTime() * 0.0005;
  gradient.addColorStop(0.5, 'rgba(0,0,0,' + (Math.sin(time) * 0.12 + 0.5) + ')');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    vignette();
    for (var i = 0; i < circleArray.length; i++) {
      circleArray[i].update();
    }
    if (circleArray.length > 80) {
      circleArray.splice(0, 1);
    }
}   
init();
animate();