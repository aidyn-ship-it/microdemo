(function(){
    const CFG = {
      NUM_COUNT: 84,
      WORD_COUNT: 28,
      FADE_SMUDGE_MS: 1400,
      NUM_REVEAL_STAGGER: 25,
      NUM_SHOW_MS: 3000,
      NUM_FADE_MS: 1200,
      WORD_REVEAL_STAGGER: 80,
      WORD_SHOW_MS: 3000,
      WORD_FADE_MS: 1200,
      LOGO_URL: './assets/x_flat.jpeg',
      X3D_URL: './assets/x_3d.jpeg'
    };

    const POSITIVE = [
        'relaxed','engaged','happy','focused','calm','curious','energised','settled','open','present',
        'relieved','attentive','absorbed','balanced','hopeful','content','interested','playful','confident','optimistic','determined','grounded','composed'
      ];
      const NEGATIVE = ['stressed','anxious','frustrated','bored','tired'];
      const FEELINGS = POSITIVE.concat(NEGATIVE);

    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const drawCanvas = document.getElementById('draw')
    const drawCtx = drawCanvas.getContext('2d');
    const intro = document.getElementById('intro');
    const numsEl = document.getElementById('nums');

    let drawing=false, last=null, sequenceRunning=false;

    function resize(){
      const dpr=Math.max(1,window.devicePixelRatio||1);
      [canvas, drawCanvas].forEach(c => {
        const rect= c.getBoundingClientRect();
        c.width=Math.floor(rect.width*dpr);
        c.height=Math.floor(rect.height*dpr);
        const canva = c.getContext('2d');
        canva.setTransform(dpr,0,0,dpr,0,0);
      });
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    function start(x,y){ if(!sequenceRunning) intro.classList.add('hide'); drawing=true; last={x,y}; }
    function move(x,y){ if(!drawing)return; draw(last.x,last.y,x,y); last={x,y}; }
    function end(){ if(!drawing)return; drawing=false; last=null;
      setTimeout(() => {
        drawCanvas.style.opacity = "0";
        setTimeout(() => {
          drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          drawCanvas.style.opacity = "1";
        }, 1500);
      }, 2000);
      if(!sequenceRunning) runSequence();
    }

    function draw(x1,y1,x2,y2){
      const w=18,g=18;
      drawCtx.lineCap='round'; drawCtx.lineJoin='round';
      drawCtx.strokeStyle='rgba(57,255,136,1)'; drawCtx.lineWidth=w; drawCtx.shadowBlur=g; drawCtx.shadowColor='rgba(57,255,136,0.9)';
      drawCtx.beginPath(); drawCtx.moveTo(x1,y1); drawCtx.lineTo(x2,y2); drawCtx.stroke();
      drawCtx.save(); drawCtx.shadowBlur=0; drawCtx.strokeStyle='rgba(255,255,255,0.9)'; drawCtx.lineWidth=Math.max(2,w*0.35);
      drawCtx.beginPath(); drawCtx.moveTo(x1,y1); drawCtx.lineTo(x2,y2); drawCtx.stroke(); drawCtx.restore();
    }

    function randomIntDigits(min=10,max=16){
      const len=Math.floor(Math.random()*(max-min+1))+min;
      let s=''; for(let i=0;i<len;i++) s+=Math.floor(Math.random()*10);
      if(s[0]==='0') s='1'+s.slice(1);
      return s;
    }

    function clearNums(){ numsEl.innerHTML=''; }

    function revealNumbers(){
      clearNums();
      const r=canvas.getBoundingClientRect(); const w=r.width, h=r.height;
      for(let i=0;i<CFG.NUM_COUNT;i++){
        const span=document.createElement('span'); span.className='num'; span.textContent=randomIntDigits(10,16);
        span.style.left=(20+Math.random()*(w-40))+'px'; span.style.top=(30+Math.random()*(h-60))+'px';
        numsEl.appendChild(span);
        setTimeout(()=> span.classList.add('show'), CFG.NUM_REVEAL_STAGGER*i);
      }
    }

    function fadeNumbers(cb){
      const items=numsEl.querySelectorAll('.num');
      items.forEach((el,i)=> setTimeout(()=> el.classList.add('fade'), i*5));
      setTimeout(()=>{ clearNums(); cb&&cb(); }, CFG.NUM_FADE_MS + items.length*5 + 60);
    }

    function revealWords(cb){
      clearNums();
      const r=canvas.getBoundingClientRect(); const w=r.width, h=r.height;
      const n=Math.min(CFG.WORD_COUNT, FEELINGS.length);
      for(let i=0;i<n;i++){
        const f=FEELINGS[i%FEELINGS.length]; const cls = POSITIVE.includes(f)?'pos':'neg';
        const span=document.createElement('span'); span.className='word '+cls; span.textContent=f;
        span.style.left=(40+Math.random()*(w-80))+'px'; span.style.top=(40+Math.random()*(h-80))+'px';
        numsEl.appendChild(span);
        setTimeout(()=> span.classList.add('show'), CFG.WORD_REVEAL_STAGGER*i);
      }
      setTimeout(()=> fadeWords(cb), CFG.WORD_SHOW_MS + CFG.WORD_REVEAL_STAGGER*n);
    }

    function fadeWords(cb){
      const items=numsEl.querySelectorAll('.word');
      items.forEach((el,i)=> setTimeout(()=> el.classList.add('fade'), i*20));
      setTimeout(()=>{ clearNums(); cb&&cb(); }, CFG.WORD_FADE_MS + items.length*20 + 200);
    }

    function addBrandAssets(){
      // Remove existing
      numsEl.querySelectorAll('.brand-asset').forEach(n=> n.remove());
      if (CFG.LOGO_URL){
        const logo = new Image(); logo.src = CFG.LOGO_URL; logo.className='brand-asset';
        logo.style.left='12%'; logo.style.top='12%'; logo.style.width='96px'; logo.style.height='auto';
        numsEl.appendChild(logo); requestAnimationFrame(()=> logo.classList.add('show'));
      }
      if (CFG.X3D_URL){
        const x = new Image(); x.src = CFG.X3D_URL; x.className='brand-asset';
        x.style.right='8%'; x.style.bottom='10%'; x.style.width='160px'; x.style.height='auto';
        x.style.position='absolute'; x.style.left='auto'; x.style.top='auto';
        numsEl.appendChild(x); requestAnimationFrame(()=> x.classList.add('show'));
      }
    }

    function showTagline(){
      clearNums();
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
      const title=document.createElement('div'); title.className='tagline'; title.textContent='Nx10'; title.style.left='50%'; title.style.top='45%';
      const sub=document.createElement('div'); sub.className='tagline-sub'; sub.textContent='We teach machines how humans feel.'; sub.style.left='50%'; sub.style.top='56%';
      numsEl.appendChild(title); numsEl.appendChild(sub);
      setTimeout(()=>{ title.classList.add('show'); sub.classList.add('show'); }, 150);
      addBrandAssets();
    }

    function runSequence(){
      sequenceRunning=true;
      let steps=Math.floor(CFG.FADE_SMUDGE_MS/30);
      const fade=()=>{ steps--; ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height); if(steps>0) requestAnimationFrame(fade); else afterSmudge(); };
      requestAnimationFrame(fade);
      function afterSmudge(){
        revealNumbers();
        setTimeout(()=>{
          fadeNumbers(()=>{
            revealWords(()=>{
              showTagline();
            });
          });
        }, CFG.NUM_REVEAL_STAGGER*CFG.NUM_COUNT + CFG.NUM_SHOW_MS);
      }
    }

    function toLocal(e){ const r=canvas.getBoundingClientRect(); const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY; return {x:cx-r.left,y:cy-r.top}; }

    if(window.PointerEvent){
      canvas.addEventListener('pointerdown',e=>{e.preventDefault(); const p=toLocal(e); start(p.x,p.y);});
      canvas.addEventListener('pointermove',e=>{const p=toLocal(e); move(p.x,p.y);});
      window.addEventListener('pointerup',()=> end());
    } else {
      canvas.addEventListener('mousedown',e=>{const p=toLocal(e); start(p.x,p.y);});
      window.addEventListener('mousemove',e=>{const p=toLocal(e); move(p.x,p.y);});
      window.addEventListener('mouseup',()=> end());
      canvas.addEventListener('touchstart',e=>{const p=toLocal(e); start(p.x,p.y);},{passive:false});
      window.addEventListener('touchmove',e=>{const p=toLocal(e); move(p.x,p.y);},{passive:false});
      window.addEventListener('touchend',()=> end());
    }
    window.addEventListener('load', resize);
    window.addEventListener('resize',resize); resize();
  })();
