
function Particle(x,y,radius,grad,v) {
    this.x=x;
    this.y=y;
    this.dx=Math.cos(grad+randomFloat(-0.05,0.05))*v;
    this.dy=Math.sin(grad+randomFloat(-0.05,0.05))*v-1.1;
    this.radius=radius;
    this.alpha=1;
    

    this.draw= function(idx) {
        c.save();
        c.globalAlpha=this.alpha;
        c.beginPath();
        
        c.arc(this.x,this.y,this.radius,0, 2*Math.PI);
        c.fillStyle=color[idx][randomInt(0,1)];
        c.fill();
        c.closePath();
        c.restore();
    }
    this.update= function(idx) {
        this.x+=this.dx;
        this.y+=this.dy;
        this.dy+=0.05;
        this.dx*=0.999;
        this.dy*=0.999;
        if(this.alpha>=0.1) {
            this.alpha-=0.01;
        }
        else if(this.alpha<0.1) {
            this.alpha=0;
        }
        
        this.draw(idx);
    }
}

function Fly(x,idx){
    this.x=x;
    this.y=canvas.height;
    this.dy=randomInt(-11,-7);
    this.radius=2;
    this.idx=idx;

    this.draw=function() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0, 2*Math.PI);
        c.fillStyle=color[idx][randomInt(0,1)];
        c.fill();
    }
    this.update=function() {
        this.y+=this.dy;
        this.dy+=0.1
        this.draw();
    }
}

function FireWork(fireWork,idx) {
    this.fireWork=fireWork;
    this.color=idx;


    this.update = function() {
        this.fireWork = this.fireWork.filter(element => {
            element.update(this.color);
            return element.alpha>0.01;
        });
    }
}

function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min)+min);
}
function randomFloat(min, max) {
    return Math.random()*(max-min)+min;
}

function animation() {
    c.fillStyle='rgba(0,0,0,0.1)';
    c.fillRect(0,0,canvas.width,canvas.height);
    fly = fly.filter(element => {
        element.update();
        if(element.dy >= randomInt(-0.5,5)) {
            audioExplode[currentAudioIndex].play();
            currentAudioIndex = (currentAudioIndex + 1) % 50;
            console.log(currentAudioIndex);
            var firework = new FireWork(initFirework(numParticle,element.x,element.y,element.idx),element.idx);
            fireWorkList.push(firework);
            return false; // This will remove the element from the array
        }
        return true; // This will keep the element in the array
    });

    fireWorkList=fireWorkList.filter(element=>{
        element.update();
        return element.length!==0;
    });
    
    requestAnimationFrame(animation);
}

function initFirework(num,x,y) {
    var fireWork=[];
    for(i=0;i<num;i++) {
        var v=randomFloat(1,2);
        fireWork.push(new Particle(x,y,2,Math.PI*2/num*i,v));
    }
    return fireWork;
}

//MAIN
var canvas=document.querySelector('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var c=canvas.getContext('2d');
var numParticle=100;

var color=[
    ['#F5FF7B','#C2CC5E'],
    ['#FF7213','#CC5C0F'],
    ['#69E82F','#FFC636'],
    ['#16FFC1','#13CC9D'],
    ['#38C8E8','#13CC9D'],
    ['#FF6444','#00ADA9'],
    ['#69E82F','#13CC9D'],
    ['#FF0000','#EE8656']
]
var mouse={
    x:100,
    y:100,
}

var fireWorkList=[];
var fly=[];

var length=100;

var audioFly = [];
var audio = document.getElementById('voot');

// Create and initialize audio elements
for (var i = 0; i < 50; i++) {
    audioFly.push(audio.cloneNode(true));
}
var currentAudioIndex = 0;


var audioExplode = [];
var audio = document.getElementById('explode');
// Create and initialize audio elements
for (var i = 0; i < 50; i++) {
    audioExplode.push(audio.cloneNode(true));
}

function handleInteraction(event) {
    if (event.type === 'mousedown' || event.type === 'mouseup') {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    } else if (event.type === 'touchstart' || event.type === 'touchend') {
        // Use the first touch in the array of touches
        var touch = event.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
    }

    var idx = randomInt(0, color.length);
    fly.push(new Fly(mouse.x, idx));

    // Play the current audio element
    audioElements[currentAudioIndex].play();

    // Move to the next audio element or go back to the first one if at the end
    currentAudioIndex = (currentAudioIndex + 1) % audioCount;

    console.log(fly);

    // Prevent the default behavior for touch events
    if (event.type === 'touchstart' || event.type === 'touchend') {
        event.preventDefault();
    }
}

// Add event listeners for both mouse and touch events
window.addEventListener('mousedown', handleInteraction);
window.addEventListener('touchstart', handleInteraction);

animation();
