// Hive Mind: initial agent-based simulation. No external services or personal data.
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const countInput = document.getElementById('count');
const countLabel = document.getElementById('countLabel');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const W = canvas.width, H = canvas.height;
let bees = [], paused = false, target = { x: W * 0.5, y: H * 0.5 };
const rand = (a, b) => a + Math.random() * (b - a);
function makeBee() { const a = rand(0, Math.PI * 2); return { x: rand(0, W), y: rand(0, H), vx: Math.cos(a) * 1.6, vy: Math.sin(a) * 1.6 }; }
function reset() { bees = Array.from({length: Number(countInput.value)}, makeBee); countLabel.value = countInput.value; }
function limit(x, y, max) { const m = Math.hypot(x, y); return m > max ? [x * max / m, y * max / m] : [x, y]; }
function update() {
  const next = bees.map(b => {
    let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,n=0;
    for (const other of bees) {
      if (other === b) continue;
      const dx=other.x-b.x,dy=other.y-b.y,d2=dx*dx+dy*dy;
      if (d2>0 && d2<75*75) {
        n++; ax+=other.vx; ay+=other.vy; cx+=other.x; cy+=other.y;
        if(d2<24*24){ sx-=dx/d2; sy-=dy/d2; }
      }
    }
    let fx=sx*55, fy=sy*55;
    if(n){fx+=(ax/n-b.vx)*0.025+(cx/n-b.x)*0.003;fy+=(ay/n-b.vy)*0.025+(cy/n-b.y)*0.003;}
    fx+=(target.x-b.x)*0.0007+rand(-0.13,0.13);
    fy+=(target.y-b.y)*0.0007+rand(-0.13,0.13);
    let [vx,vy]=limit(b.vx+fx,b.vy+fy,2.5);
    const x=(b.x+vx+W)%W,y=(b.y+vy+H)%H;
    return {x,y,vx,vy};
  });
  bees=next;
}
function draw() {
  ctx.fillStyle='#161b25';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(241,195,85,.35)';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(target.x,target.y,22,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#ffdb77';ctx.beginPath();ctx.arc(target.x,target.y,4,0,Math.PI*2);ctx.fill();
  for(const b of bees){
    const angle=Math.atan2(b.vy,b.vx);
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(angle);
    ctx.fillStyle='rgba(210,230,245,.5)';ctx.beginPath();ctx.ellipse(-1,-4,5,2.5,-.4,0,Math.PI*2);ctx.ellipse(-1,4,5,2.5,.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f3b93c';ctx.beginPath();ctx.ellipse(0,0,6,3.4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#322817';ctx.fillRect(-2,-3.2,1.8,6.4);ctx.fillRect(2,-3.2,1.8,6.4);ctx.restore();
  }
}
function frame(){if(!paused) update();draw();requestAnimationFrame(frame);}
canvas.addEventListener('pointerdown', e=>{const rect=canvas.getBoundingClientRect();target={x:(e.clientX-rect.left)*W/rect.width,y:(e.clientY-rect.top)*H/rect.height};});
countInput.addEventListener('input',reset);
pauseButton.addEventListener('click',()=>{paused=!paused;pauseButton.textContent=paused?'Resume':'Pause';});
resetButton.addEventListener('click',()=>{target={x:W/2,y:H/2};reset();});
reset();requestAnimationFrame(frame);
