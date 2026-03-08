const startBtn=document.getElementById("startBtn")
const cakeScene=document.getElementById("cakeScene")
const startScreen=document.getElementById("startScreen")
const flames=document.querySelectorAll(".flame")
const world=document.querySelector(".world")

let blown=false

startBtn.onclick=()=>{
startScreen.classList.add("hidden")
cakeScene.classList.remove("hidden")
startMicrophone()
}

/* MICRÓFONO */

async function startMicrophone(){

const stream=await navigator.mediaDevices.getUserMedia({audio:true})

const audioContext=new AudioContext()
const analyser=audioContext.createAnalyser()
const mic=audioContext.createMediaStreamSource(stream)

mic.connect(analyser)

analyser.fftSize=512

const data=new Uint8Array(analyser.frequencyBinCount)

function detect(){

analyser.getByteFrequencyData(data)

let volume=data.reduce((a,b)=>a+b)/data.length

if(volume>60 && !blown){
blown=true
blowCandles()
}

requestAnimationFrame(detect)
}

detect()
}

/* SOPLAR */

function blowCandles(){

flames.forEach(f=>{

f.style.opacity=0

let candle=f.parentElement

for(let i=0;i<4;i++){

let smoke=document.createElement("div")
smoke.className="smoke"
smoke.style.left="2px"
smoke.style.top="-20px"

candle.appendChild(smoke)

setTimeout(()=>smoke.remove(),2000)

}

})

setTimeout(()=>{

world.style.transform="translateY(-100vh)"

startStars()
startFireworks()

},1200)

}

/* ================= CIELO ================= */

const starCanvas=document.getElementById("stars")
const sctx=starCanvas.getContext("2d")

starCanvas.width=window.innerWidth
starCanvas.height=window.innerHeight

let stars=[]
let milkyStars=[]

/* estrellas normales */


for(let i=0;i<3500;i++){

let x = Math.random()*starCanvas.width

let center = starCanvas.height*0.5

let wave = Math.sin(x*0.002)*80

let noise = (Math.random()-0.5)*120

let y = center + wave + noise

milkyStars.push({
x:x,
y:y,
r:Math.random()*1.3,
alpha:Math.random()*0.7
})

}

/* estrellas de la via lactea */

for(let i=0;i<3000;i++){

milkyStars.push({

x:Math.random()*starCanvas.width,
y:(Math.random()*starCanvas.height*0.35)+(starCanvas.height*0.32),
r:Math.random()*1.3,
alpha:Math.random()*0.7

})

}

function drawMilkyWay(){

let gradient = sctx.createRadialGradient(
starCanvas.width/2,
starCanvas.height/2,
0,
starCanvas.width/2,
starCanvas.height/2,
starCanvas.width*0.7
)

gradient.addColorStop(0,"rgba(255,255,255,0.22)")
gradient.addColorStop(0.3,"rgba(200,210,255,0.12)")
gradient.addColorStop(0.6,"rgba(120,150,255,0.05)")
gradient.addColorStop(1,"rgba(0,0,0,0)")

sctx.fillStyle = gradient
sctx.fillRect(0,0,starCanvas.width,starCanvas.height)

}
function startStars(){

function animate(){

sctx.clearRect(0,0,starCanvas.width,starCanvas.height)

/* VIA LACTEA GRADIENTE */

drawMilkyWay()

/* estrellas de la via lactea */

milkyStars.forEach(s=>{

sctx.beginPath()
sctx.arc(s.x,s.y,s.r,0,Math.PI*2)
sctx.fillStyle=`rgba(255,255,255,${s.alpha})`
sctx.fill()

})

/* estrellas normales */

stars.forEach(s=>{

s.t+=0.02

let alpha=Math.abs(Math.sin(s.t))

sctx.beginPath()
sctx.arc(s.x,s.y,s.r,0,Math.PI*2)
sctx.fillStyle=`rgba(255,255,255,${alpha})`
sctx.fill()

})

requestAnimationFrame(animate)

}

animate()

}

/* ================= FUEGOS ARTIFICIALES ================= */

const canvas = document.getElementById("fireworks")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particles = []

class Particle{

constructor(x,y,color){

let angle = Math.random() * Math.PI * 2
let speed = Math.random() * 6 + 2

this.x = x
this.y = y

this.vx = Math.cos(angle) * speed
this.vy = Math.sin(angle) * speed

this.life = 80 + Math.random()*20
this.gravity = 0.04

this.color = color
this.size = 2 + Math.random()*2

}

update(){

this.vy += this.gravity

this.x += this.vx
this.y += this.vy

this.life--

}

draw(){

ctx.beginPath()
ctx.arc(this.x,this.y,this.size,0,Math.PI*2)
ctx.fillStyle=this.color
ctx.fill()

}

alive(){

return this.life > 0 &&
this.x > -50 &&
this.x < canvas.width + 50 &&
this.y > -50 &&
this.y < canvas.height + 50

}

}

function explode(x,y){

/* rangos de color románticos */

let hueRanges = [
[0,10],      // rojo
[320,340],   // rosa
[270,300]    // morado
]

let range = hueRanges[Math.floor(Math.random()*hueRanges.length)]

let hue = range[0] + Math.random()*(range[1]-range[0])

let color = `hsl(${hue},100%,70%)`

for(let i=0;i<150;i++){

particles.push(new Particle(x,y,color))

}


}

function startFireworks(){

setInterval(()=>{

let x=Math.random()*canvas.width
let y=Math.random()*canvas.height*0.5

explode(x,y)

},1200)

}

function animateFireworks(){

ctx.clearRect(0,0,canvas.width,canvas.height)

let newParticles=[]

for(let p of particles){

p.update()

if(p.alive()){

p.draw()
newParticles.push(p)

}

}

particles = newParticles

requestAnimationFrame(animateFireworks)

}

animateFireworks()