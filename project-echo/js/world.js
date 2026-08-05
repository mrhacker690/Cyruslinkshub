/* ═══ world.js — seeded procedural world: biomes, river, village, ruins,
   cave, puzzle props, chests, waypoints, rendering & minimap ═══ */
const BIO={DEEP:0,WATER:1,SAND:2,PLAINS:3,FOREST:4,SNOW:5,DESERT:6,SWAMP:7,ROCK:8,
  RUIN:10,CAVE:12};
/* palettes: [day r,g,b] / [echo r,g,b] */
const BPAL={
 0:[[18,36,58],[26,20,60]],1:[[32,74,104],[40,44,120]],2:[[196,178,126],[150,140,170]],
 3:[[86,132,62],[70,96,110]],4:[[52,96,48],[52,70,96]],5:[[216,224,232],[170,180,224]],
 6:[[212,178,110],[168,132,150]],7:[[70,88,58],[64,60,96]],8:[[104,102,100],[88,80,104]],
 10:[[120,116,108],[96,88,120]],12:[[58,54,64],[70,50,90]],
};
const BNAME={0:'Lake',1:'River',2:'Shore',3:'Plains',4:'Forest',5:'Snowfield',6:'Desert',7:'Swamp',8:'Mountains',10:'Hollow Court',12:'Echo Cave'};
const DECOR={TREE:1,ROCK:2,FLOWER:3,HERB:4,ORE:5,SHROOM:6,CRYSTAL:7,BLOSSOM:8,PILLAR:9,OBELISK:10,TORCH:11};
const GATHER={ [DECOR.FLOWER]:['fiber',1],[DECOR.HERB]:['moonleaf',1],[DECOR.ORE]:['iron',1],
  [DECOR.SHROOM]:['embercap',1],[DECOR.CRYSTAL]:['echodust',1],[DECOR.BLOSSOM]:['echo_blossom',1] };

const World={
  biome:null,decor:null,varr:null,solidSet:new Set(),crackedSet:new Set(),gateSet:new Set(),
  houses:[],plates:[],levers:[],torches:[],chests:[],waypoints:[],floatIsles:[],
  anchors:{},mini:null,gathered:new Set(),
  /* seeded RNG + noise */
  h2(x,y){let n=(Math.imul(x,374761393)+Math.imul(y,668265263)+1337)|0;
    n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;return (n>>>0)/4294967295;},
  vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,s=t=>t*t*(3-2*t);
    const a=this.h2(xi,yi),b=this.h2(xi+1,yi),c=this.h2(xi,yi+1),d=this.h2(xi+1,yi+1),u=s(xf),v=s(yf);
    return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;},
  fbm(x,y){let f=0,a=.5,t=0,fr=1;for(let i=0;i<4;i++){f+=a*this.vnoise(x*fr,y*fr);t+=a;a*=.5;fr*=2;}return f/t;},

  gen(){
    this.biome=new Uint8Array(MW*MH);this.decor=new Uint8Array(MW*MH);this.varr=new Float32Array(MW*MH);
    const A=this.anchors={VIL:{x:60,y:96},RUIN:{x:128,y:36},OBEL:{x:124,y:140},SHRINE:{x:36,y:30},
      HEART:{x:34,y:138},CAVE:{x:96,y:18},SPAWN:{x:60,y:108}};
    for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
      const i=y*MW+x;
      const h=this.fbm(x*.045,y*.045), m=this.fbm(x*.06+99,y*.06+99), cold=(1-y/MH)*.7+this.fbm(x*.03+7,y*.03+7)*.3;
      this.varr[i]=this.h2(x*3+11,y*3+5);
      let b;
      if(h<.28)b=BIO.DEEP; else if(h<.32)b=BIO.WATER; else if(h<.345)b=BIO.SAND;
      else if(h>.74)b=BIO.ROCK;
      else if(cold>.66)b=BIO.SNOW;
      else if(cold<.32&&m<.5)b=BIO.DESERT;
      else if(m>.62&&h<.5)b=BIO.SWAMP;
      else if(m>.48)b=BIO.FOREST; else b=BIO.PLAINS;
      this.biome[i]=b;
      /* decor */
      const r=this.h2(x*7+3,y*7+1);
      if(b===BIO.FOREST&&r<.28)this.decor[i]=DECOR.TREE;
      else if(b===BIO.PLAINS&&r<.05)this.decor[i]=r<.02?DECOR.FLOWER:DECOR.HERB;
      else if(b===BIO.PLAINS&&r>.94)this.decor[i]=DECOR.ROCK;
      else if(b===BIO.SNOW&&r<.06)this.decor[i]=DECOR.ROCK;
      else if(b===BIO.DESERT&&r>.96)this.decor[i]=DECOR.ROCK;
      else if(b===BIO.SWAMP&&r<.08)this.decor[i]=r<.04?DECOR.SHROOM:DECOR.TREE;
      else if(b===BIO.ROCK&&r<.15)this.decor[i]=DECOR.ORE;
      else if(b===BIO.FOREST&&r>.93)this.decor[i]=DECOR.SHROOM;
    }
    /* biome anchor forcing */
    this.forceDisc(A.OBEL,13,BIO.DESERT); this.forceDisc(A.SHRINE,12,BIO.SNOW);
    this.forceDisc(A.HEART,12,BIO.SWAMP); this.forceDisc(A.VIL,11,BIO.PLAINS);
    this.forceDisc(A.SPAWN,5,BIO.PLAINS);
    this.forceDisc(A.RUIN,15,BIO.PLAINS);
    this.forceDisc(A.CAVE,7,BIO.ROCK);
    /* river + lake */
    for(let x=0;x<MW;x++){const yy=Math.round(118+Math.sin(x*.05)*7);
      for(let w=0;w<2;w++){const i=(yy+w)*MW+x;if(this.biome[i]!==undefined&&this.biome[i]>BIO.WATER)this.biome[i]=BIO.WATER;}}
    this.forceDisc({x:66,y:114},5,BIO.WATER);
    /* village */
    this.buildVillage(A.VIL);
    /* ruins: Hollow Court */
    this.buildRuins(A.RUIN);
    /* cave */
    this.buildCave(A.CAVE);
    /* scattered crystals/blossoms (echo-realm gatherables) */
    for(let k=0;k<90;k++){const x=randi(2,MW-3),y=randi(2,MH-3),i=y*MW+x;
      if([BIO.FOREST,BIO.SNOW,BIO.SWAMP,BIO.ROCK].includes(this.biome[i])&&!this.decor[i]&&!this.solidSet.has(x+','+y)){
        this.decor[i]=chance(.5)?DECOR.CRYSTAL:DECOR.BLOSSOM;}}
    /* obelisks at anchors */
    this.placeDecor(A.OBEL.x,A.OBEL.y,DECOR.OBELISK);
    this.placeDecor(A.SHRINE.x,A.SHRINE.y,DECOR.OBELISK);
    /* floating islands (pure wonder: drifting shadowed rocks) */
    this.floatIsles=[{x:A.OBEL.x*TILE+40,y:A.OBEL.y*TILE-160,r:46},{x:A.RUIN.x*TILE-300,y:A.RUIN.y*TILE+80,r:38},{x:A.SHRINE.x*TILE+120,y:A.SHRINE.y*TILE+90,r:30}];
    this.buildChests(A); this.buildWaypoints(A); this.buildMinimap();
  },
  forceDisc(c,r,b){for(let y=c.y-r;y<=c.y+r;y++)for(let x=c.x-r;x<=c.x+r;x++){
    if(x<0||y<0||x>=MW||y>=MH)continue; if((x-c.x)**2+(y-c.y)**2<=r*r){const i=y*MW+x;
      this.biome[i]=b; if(b!==BIO.FOREST&&this.decor[i]===DECOR.TREE)this.decor[i]=0;}}},
  placeDecor(x,y,d){this.decor[y*MW+x]=d;},
  addSolid(x,y){this.solidSet.add(x+','+y);},

  buildVillage(c){
    for(let y=c.y-9;y<=c.y+9;y++)for(let x=c.x-10;x<=c.x+10;x++){const i=y*MW+x;this.decor[i]=0;}
    const defs=[[-6,-4],[3,-5],[-7,3],[4,4]];
    this.houses=defs.map(([dx,dy],k)=>{const hx=c.x+dx,hy=c.y+dy,w=4,h=3;
      for(let y=hy;y<hy+h;y++)for(let x=hx;x<hx+w;x++){if(y===hy+h-1&&x===hx+Math.floor(w/2))continue;this.addSolid(x,y);}
      return {x:hx,y:hy,w,h,door:{x:hx+Math.floor(w/2),y:hy+h-1}};});
    /* notice board + forge + stalls are drawn decor */
    this.board={x:(c.x+1)*TILE,y:(c.y+2)*TILE};
    this.forge={x:(c.x-2)*TILE,y:(c.y+1)*TILE};
  },
  buildRuins(c){
    /* courtyard floor */
    for(let y=c.y-6;y<=c.y+12;y++)for(let x=c.x-10;x<=c.x+10;x++){const i=y*MW+x;this.biome[i]=BIO.RUIN;this.decor[i]=0;}
    /* pillars */
    [[-6,-2],[6,-2],[-6,8],[6,8]].forEach(([dx,dy])=>{this.placeDecor(c.x+dx,c.y+dy,DECOR.PILLAR);});
    /* outer walls + gate */
    for(let x=c.x-10;x<=c.x+10;x++){this.addSolid(x,c.y-6);if(Math.abs(x-c.x)>1)this.addSolid(x,c.y+12);}
    for(let y=c.y-6;y<=c.y+12;y++){this.addSolid(c.x-10,y);this.addSolid(c.x+10,y);}
    this.gateTiles=[[c.x,c.y+12],[c.x+1,c.y+12]];
    this.gateTiles.forEach(([x,y])=>{this.solidSet.delete(x+','+y);this.gateSet.add(x+','+y);});
    /* pressure plates */
    this.plates=[{x:(c.x-4)*TILE,y:(c.y+2)*TILE,on:false},{x:(c.x+4)*TILE,y:(c.y+4)*TILE,on:false},{x:(c.x)*TILE,y:(c.y+9)*TILE,on:false}];
    /* sanctum north of courtyard, sealed by rift (cracked) wall */
    for(let y=c.y-15;y<=c.y-7;y++)for(let x=c.x-6;x<=c.x+6;x++){const i=y*MW+x;this.biome[i]=BIO.RUIN;this.decor[i]=0;}
    for(let x=c.x-6;x<=c.x+6;x++){this.addSolid(x,c.y-15);
      if(Math.abs(x-c.x)>2)this.crackedSet.add(x+','+(c.y-7)); else this.addSolid(x,c.y-7);}
    for(let y=c.y-15;y<=c.y-7;y++){this.addSolid(c.x-6,y);this.addSolid(c.x+6,y);}
    this.pedestal={x:c.x*TILE,y:(c.y-11)*TILE};
    this.arena={x:c.x*TILE,y:(c.y-11)*TILE,r:150};
  },
  buildCave(c){
    for(let y=c.y-3;y<=c.y+3;y++)for(let x=c.x-4;x<=c.x+4;x++){const i=y*MW+x;this.biome[i]=BIO.CAVE;this.decor[i]=0;}
    for(let x=c.x-4;x<=c.x+4;x++){this.addSolid(x,c.y-3);if(Math.abs(x-c.x)>0)this.addSolid(x,c.y+3);}
    for(let y=c.y-3;y<=c.y+3;y++){this.addSolid(c.x-4,y);this.addSolid(c.x+4,y);}
    /* hidden alcove behind lever wall */
    this.addSolid(c.x+2,c.y); /* lever wall segment */
    this.leverWall={x:c.x+2,y:c.y};
    this.levers=[{id:'lv1',x:(c.x-2)*TILE,y:c.y*TILE,on:false}];
    this.crystals=[]; for(let k=0;k<7;k++)this.placeDecor(c.x-3+randi(0,6),c.y-2+randi(0,4),DECOR.CRYSTAL);
  },
  buildChests(A){
    const C=(id,tx,ty,items,gold)=>this.chests.push({id,x:tx*TILE,y:ty*TILE,items,gold,opened:false});
    C('c_shore',A.SPAWN.x+3,A.SPAWN.y+1,[['apple',2]],20);
    C('c_vil',A.VIL.x+8,A.VIL.y-2,[['hpot',1],['bread',1]],30);
    C('c_cross',92,78,[['spot',1],['fiber',2]],45);
    C('c_cave',A.CAVE.x+3,A.CAVE.y-1,[['sw2',1],['echodust',2]],80);
    C('c_ruins1',A.RUIN.x+7,A.RUIN.y+9,[['hpot2',1],['bone',2]],70);
    C('c_obel',A.OBEL.x+4,A.OBEL.y+3,[['sw3',1]],90);
    C('c_ledger',A.OBEL.x-1,A.OBEL.y-3,[['ledger',1]],40); // gated by S3
    C('c_shrine',A.SHRINE.x+4,A.SHRINE.y-2,[['shard_snow',1],['hpot2',1]],60); // behind cracked wall
    C('c_heart',A.HEART.x,A.HEART.y+3,[['shard_swamp',1]],60); // torch puzzle
    C('c_desert_shard',A.OBEL.x-6,A.OBEL.y+6,[['shard_desert',1],['antidote',1]],60);
    C('c_float',A.OBEL.x+5,A.OBEL.y-4,null,0); // under floating isle: dust
    this.chests.find(c=>c.id==='c_float').items=[['echodust',5]];
    /* snow cracked wall guarding shrine chest */
    const s=A.SHRINE; for(let x=s.x+2;x<=s.x+6;x++)this.crackedSet.add(x+','+(s.y-2));
  },
  buildWaypoints(A){
    this.waypoints=[
      {id:'wp_vil',x:A.VIL.x*TILE,y:(A.VIL.y+1)*TILE,name:'Emberfall Village',unlocked:true},
      {id:'wp_cross',x:92*TILE,y:78*TILE,name:'Crossroads',unlocked:false},
      {id:'wp_ruin',x:A.RUIN.x*TILE,y:(A.RUIN.y+14)*TILE,name:'Court Road',unlocked:false},
      {id:'wp_obel',x:(A.OBEL.x+2)*TILE,y:(A.OBEL.y+2)*TILE,name:'Sun Obelisk',unlocked:false},
      {id:'wp_shrine',x:(A.SHRINE.x+1)*TILE,y:(A.SHRINE.y+2)*TILE,name:'Silent Shrine',unlocked:false},
      {id:'wp_heart',x:(A.HEART.x+2)*TILE,y:A.HEART.y*TILE,name:'Swamp Heart',unlocked:false},
      {id:'wp_cave',x:A.CAVE.x*TILE,y:(A.CAVE.y+5)*TILE,name:'Echo Cave',unlocked:false},
    ];
  },

  /* ---- queries ---- */
  idx(tx,ty){return ty*MW+tx;},
  biomeAt(tx,ty){ if(tx<0||ty<0||tx>=MW||ty>=MH)return BIO.ROCK; return this.biome[this.idx(tx,ty)];},
  biomePx(x,y){return this.biomeAt(Math.floor(x/TILE),Math.floor(y/TILE));},
  solidTile(tx,ty){
    if(tx<0||ty<0||tx>=MW||ty>=MH)return true;
    const k=tx+','+ty, b=this.biomeAt(tx,ty);
    if(b===BIO.DEEP||b===BIO.WATER)return true;
    if(this.gateSet.has(k)&&!G.flags.gate)return true;
    if(this.crackedSet.has(k))return G.reality===0;
    if(this.leverWall&&tx===this.leverWall.x&&ty===this.leverWall.y&&!this.levers[0].on)return true;
    if(this.solidSet.has(k))return true;
    const d=this.decor[this.idx(tx,ty)];
    if(d===DECOR.TREE||d===DECOR.ROCK||d===DECOR.PILLAR||d===DECOR.OBELISK)return true;
    return false;
  },
  solidPx(x,y){return this.solidTile(Math.floor(x/TILE),Math.floor(y/TILE));},
  circleFree(x,y,r){ return !this.solidPx(x-r,y-r)&&!this.solidPx(x+r,y-r)&&!this.solidPx(x-r,y+r)&&!this.solidPx(x+r,y+r);},
  refreshGate(){ G.flags.gate=this.plates.every(p=>p.on); if(G.flags.gate){UI.toast('The Court gate grinds open…','good');AudioSys.tone(90,.8,'sawtooth',.3,30);Bus.emit('flag','gate');}},
  applyLever(l){ if(l.id==='lv1'&&l.on&&this.leverWall){ /* wall sinks */ UI.toast('Stone shifts deep in the cave.','good');}},
  refreshTorchFlag(){ if(this.torches.length&&this.torches.every(t=>t.lit)&&!G.flags.torch){G.flags.torch=true;UI.toast('The swamp torches blaze — something unlocks.','good');Bus.emit('flag','torch');}},

  /* ---- rendering ---- */
  render(ctx,w,h){
    const cx=G.cam.x,cy=G.cam.y, ts=TILE;
    const x0=Math.max(0,Math.floor((cx-w/2)/ts)), x1=Math.min(MW-1,Math.ceil((cx+w/2)/ts));
    const y0=Math.max(0,Math.floor((cy-h/2)/ts)), y1=Math.min(MH-1,Math.ceil((cy+h/2)/ts));
    const t=performance.now()/1000;
    for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
      const i=this.idx(tx,ty),b=this.biome[i],v=this.varr[i];
      let pal=BPAL[b]||BPAL[3], c=pal[G.reality];
      let r=c[0]*(0.9+v*.2),g=c[1]*(0.9+v*.2),bl=c[2]*(0.9+v*.2);
      if(b===BIO.WATER||b===BIO.DEEP){const wv=Math.sin(t*2+tx*.8+ty*.5)*8;r+=wv;g+=wv;bl+=wv*1.4;}
      ctx.fillStyle=`rgb(${r|0},${g|0},${bl|0})`;
      ctx.fillRect(tx*ts-cx+w/2,ty*ts-cy+h/2,ts+1,ts+1);
      /* shore foam */
      if(b===BIO.SAND&&ty>0&&(this.biomeAt(tx,ty-1)<=BIO.WATER)){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(tx*ts-cx+w/2,ty*ts-cy+h/2,ts,3);}
    }
    /* decor pass */
    for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
      const d=this.decor[this.idx(tx,ty)]; if(!d)continue;
      if(this.gathered.has(tx+','+ty))continue;
      if(d===DECOR.BLOSSOM&&G.reality===0)continue;
      const sx=tx*ts-cx+w/2, sy=ty*ts-cy+h/2;
      this.drawDecor(ctx,d,sx,sy,t,tx,ty);
    }
    /* puzzle props */
    this.plates.forEach(p=>this.drawPlate(ctx,p,cx,cy,w,h));
    this.levers.forEach(l=>this.drawLever(ctx,l,cx,cy,w,h));
    this.torchesBuild(); this.torches.forEach(tc=>this.drawTorch(ctx,tc,cx,cy,w,h,t));
    /* chests */
    this.chests.forEach(c=>this.drawChest(ctx,c,cx,cy,w,h,t));
    /* waypoint stones */
    this.waypoints.forEach(wp=>this.drawWaypoint(ctx,wp,cx,cy,w,h,t));
    /* houses */
    this.houses.forEach(hs=>this.drawHouse(ctx,hs,cx,cy,w,h));
    /* pedestal */
    if(this.pedestal)this.drawPedestal(ctx,cx,cy,w,h,t);
    /* board & forge */
    if(this.board)this.drawBoard(ctx,cx,cy,w,h);
    /* floating islands */
    this.floatIsles.forEach(f=>this.drawIsle(ctx,f,cx,cy,w,h,t));
  },
  onScreen(x,y,cx,cy,w,h,m=80){return x>cx-w/2-m&&x<cx+w/2+m&&y>cy-h/2-m&&y<cy+h/2+m;},
  drawDecor(ctx,d,sx,sy,t,tx,ty){
    const bob=Math.sin(t*2+tx*3+ty)*1.5;
    switch(d){
      case DECOR.TREE: ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(sx+16,sy+28,12,5,0,0,7);ctx.fill();
        ctx.fillStyle='#5a4630';ctx.fillRect(sx+13,sy+12,6,16);
        ctx.fillStyle=G.reality?'#3a5a7a':'#2e6b34';ctx.beginPath();ctx.arc(sx+16,sy+10+bob*.4,12,0,7);ctx.fill();
        ctx.fillStyle=G.reality?'#4a7aa0':'#3f8a46';ctx.beginPath();ctx.arc(sx+12,sy+6,8,0,7);ctx.fill();break;
      case DECOR.ROCK: ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(sx+16,sy+24,11,4,0,0,7);ctx.fill();
        ctx.fillStyle=G.reality?'#5a5470':'#7d7a74';ctx.beginPath();ctx.moveTo(sx+6,sy+24);ctx.lineTo(sx+14,sy+8);ctx.lineTo(sx+26,sy+24);ctx.fill();break;
      case DECOR.FLOWER: ctx.fillStyle='#e8d85d';ctx.fillRect(sx+14,sy+14,4,4);ctx.fillStyle='#5d9e46';ctx.fillRect(sx+15,sy+18,2,6);break;
      case DECOR.HERB: ctx.fillStyle=G.reality?'#8fe8ff':'#cfe8c0';ctx.beginPath();ctx.arc(sx+16,sy+16+bob,4,0,7);ctx.fill();
        ctx.fillStyle='rgba(180,255,240,.35)';ctx.beginPath();ctx.arc(sx+16,sy+16+bob,7,0,7);ctx.fill();break;
      case DECOR.ORE: ctx.fillStyle='#555';ctx.beginPath();ctx.moveTo(sx+6,sy+26);ctx.lineTo(sx+16,sy+10);ctx.lineTo(sx+27,sy+26);ctx.fill();
        ctx.fillStyle='#c9a86a';ctx.fillRect(sx+13,sy+16,3,3);ctx.fillRect(sx+19,sy+20,3,3);break;
      case DECOR.SHROOM: ctx.fillStyle='#c85a3c';ctx.beginPath();ctx.arc(sx+16,sy+16,6,Math.PI,0);ctx.fill();
        ctx.fillStyle='#e8dcc8';ctx.fillRect(sx+14,sy+16,4,8);break;
      case DECOR.CRYSTAL:{const gl=G.reality?.9:.45; ctx.fillStyle=`rgba(150,220,255,${gl})`;
        ctx.beginPath();ctx.moveTo(sx+12,sy+26);ctx.lineTo(sx+16,sy+6+bob);ctx.lineTo(sx+20,sy+26);ctx.fill();
        if(G.reality){ctx.fillStyle='rgba(150,220,255,.2)';ctx.beginPath();ctx.arc(sx+16,sy+16,12,0,7);ctx.fill();}break;}
      case DECOR.BLOSSOM: ctx.fillStyle=`rgba(255,140,220,${.7+Math.sin(t*3)*.3})`;
        for(let k=0;k<5;k++){const a=k/5*6.28+t;ctx.beginPath();ctx.arc(sx+16+Math.cos(a)*5,sy+16+Math.sin(a)*5,3,0,7);ctx.fill();}
        ctx.fillStyle='#fff';ctx.fillRect(sx+15,sy+15,2,2);break;
      case DECOR.PILLAR: ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(sx+6,sy+26,20,4);
        ctx.fillStyle=G.reality?'#7a7090':'#a8a296';ctx.fillRect(sx+10,sy-8,12,36);ctx.fillRect(sx+7,sy-12,18,5);break;
      case DECOR.OBELISK: ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx+16,sy+30,16,6,0,0,7);ctx.fill();
        ctx.fillStyle=G.reality?'#8a6ab0':'#6a6478';ctx.beginPath();ctx.moveTo(sx+8,sy+30);ctx.lineTo(sx+16,sy-34);ctx.lineTo(sx+24,sy+30);ctx.fill();
        ctx.fillStyle=`rgba(224,176,96,${.5+Math.sin(t*2)*.3})`;ctx.fillRect(sx+14,sy-10,4,20);break;
    }
  },
  drawPlate(ctx,p,cx,cy,w,h){ if(!this.onScreen(p.x,p.y,cx,cy,w,h))return;
    const sx=p.x-cx+w/2,sy=p.y-cy+h/2;
    ctx.fillStyle=p.on?'#6fe3d0':'#8a8478';ctx.beginPath();ctx.ellipse(sx,sy,14,9,0,0,7);ctx.fill();
    ctx.strokeStyle='#3a362e';ctx.stroke();},
  drawLever(ctx,l,cx,cy,w,h){ if(!this.onScreen(l.x,l.y,cx,cy,w,h))return;
    const sx=l.x-cx+w/2,sy=l.y-cy+h/2;
    ctx.fillStyle='#5a564c';ctx.fillRect(sx-5,sy+2,10,6);
    ctx.strokeStyle='#c9b48a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx,sy+4);
    ctx.lineTo(sx+(l.on?9:-9),sy-10);ctx.stroke();ctx.lineWidth=1;},
  torchesBuild(){ if(this._torchDone)return; this._torchDone=true; const H=this.anchors.HEART;
    this.torches=[[H.x-3,H.y-2],[H.x+3,H.y-2],[H.x,H.y+4]].map(([tx,ty],i)=>({id:i,x:tx*TILE,y:ty*TILE,lit:false}));},
  drawTorch(ctx,tc,cx,cy,w,h,t){ if(!this.onScreen(tc.x,tc.y,cx,cy,w,h))return;
    const sx=tc.x-cx+w/2,sy=tc.y-cy+h/2;
    ctx.fillStyle='#5a4630';ctx.fillRect(sx-2,sy-8,4,18);
    if(tc.lit){ctx.fillStyle=`rgba(255,${170+Math.sin(t*9)*40|0},60,.9)`;ctx.beginPath();ctx.arc(sx,sy-12,5+Math.sin(t*9),0,7);ctx.fill();}},
  drawChest(ctx,c,cx,cy,w,h,t){ if(c.opened||!this.onScreen(c.x,c.y,cx,cy,w,h))return;
    if(c.id==='c_ledger'&&!Quests.active('S3'))return;
    if(c.id==='c_heart'&&!G.flags.torch)return;
    const sx=c.x-cx+w/2,sy=c.y-cy+h/2;
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx,sy+10,13,4,0,0,7);ctx.fill();
    ctx.fillStyle='#7a5a34';ctx.fillRect(sx-11,sy-6,22,14);
    ctx.fillStyle='#e0b060';ctx.fillRect(sx-11,sy-2,22,3);ctx.fillRect(sx-2,sy-2,4,6);
    ctx.fillStyle=`rgba(224,176,96,${.25+Math.sin(t*3)*.15})`;ctx.beginPath();ctx.arc(sx,sy,16,0,7);ctx.fill();},
  drawWaypoint(ctx,wp,cx,cy,w,h,t){ if(!this.onScreen(wp.x,wp.y,cx,cy,w,h))return;
    const sx=wp.x-cx+w/2,sy=wp.y-cy+h/2, on=wp.unlocked;
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx,sy+12,10,4,0,0,7);ctx.fill();
    ctx.fillStyle=on?'#6fe3d0':'#6a665c';ctx.beginPath();
    ctx.moveTo(sx,sy-18+Math.sin(t*2)*2);ctx.lineTo(sx+7,sy+8);ctx.lineTo(sx-7,sy+8);ctx.fill();
    if(on){ctx.fillStyle=`rgba(111,227,208,${.2+Math.sin(t*3)*.1})`;ctx.beginPath();ctx.arc(sx,sy-4,14,0,7);ctx.fill();}},
  drawHouse(ctx,hs,cx,cy,w,h){ const px=hs.x*TILE-cx+w/2,py=hs.y*TILE-cy+h/2,W=hs.w*TILE,H=hs.h*TILE;
    if(px+
