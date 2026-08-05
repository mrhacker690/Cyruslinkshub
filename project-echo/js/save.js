/* ═══ save.js — localStorage persistence ═══ */
const SaveSys={
  KEY:'projectEcho_save', SET:'projectEcho_settings',
  save(manual){
    try{
      const d={v:1,time:G.time,day:G.day,reality:G.reality,flags:G.flags,ach:[...G.ach],
        skills:G.skills,stats:{...G.stats,biomes:[...G.stats.biomes],wpFound:[...G.stats.wpFound]},
        board:G.boardDaily, weather:G.weather.rain,
        player:{x:Player.x,y:Player.y,hp:Player.hp,st:Player.st,fc:Player.fc,ec:Player.ec,
          lvl:Player.lvl,xp:Player.xp,sp:Player.sp,gold:Player.gold,rep:Player.rep,
          equip:Player.equip,lastWP:Player.lastWP,seize:Player.seize},
        items:Inv.items,
        quests:Object.fromEntries(Object.entries(Quests.st).map(([k,v])=>[k,{s:v.s,p:v.p}])),
        chests:World.chests.filter(c=>c.opened).map(c=>c.id),
        wp:World.waypoints.filter(w=>w.unlocked).map(w=>w.id),
        gather:[...World.gathered], levers:World.levers.filter(l=>l.on).map(l=>l.id),
        plates:World.plates.filter(p=>p.on).length, torches:World.torches.filter(t=>t.lit).length,
      };
      localStorage.setItem(this.KEY,JSON.stringify(d)); G.lastSave=Date.now();
      if(manual)UI.toast('Progress saved.','good');
    }catch(e){console.warn('save failed',e);}
  },
  has(){ return !!localStorage.getItem(this.KEY); },
  load(){
    try{
      const d=JSON.parse(localStorage.getItem(this.KEY)); if(!d)return false;
      G.time=d.time;G.day=d.day;G.reality=d.reality||0;G.flags=d.flags||{};
      G.ach=new Set(d.ach||[]); G.skills=d.skills||{}; G.boardDaily=d.board;
      G.weather.rain=d.weather||0; AudioSys.setRain(G.weather.rain>0);
      Object.assign(G.stats,d.stats||{}); G.stats.biomes=new Set((d.stats&&d.stats.biomes)||[]);
      G.stats.wpFound=new Set((d.stats&&d.stats.wpFound)||[]);
      const p=d.player; Object.assign(Player,{x:p.x,y:p.y,hp:p.hp,st:p.st,fc:p.fc,ec:p.ec,
        lvl:p.lvl,xp:p.xp,sp:p.sp,gold:p.gold,rep:p.rep,lastWP:p.lastWP,seize:p.seize});
      Player.equip=p.equip||{}; Player.recalc();
      Inv.items=d.items||[];
      Quests.st={}; for(const[k,v]of Object.entries(d.quests||{}))Quests.st[k]={s:v.s,p:v.p};
      World.chests.forEach(c=>{if(d.chests.includes(c.id))c.opened=true;});
      World.waypoints.forEach(w=>{if(d.wp.includes(w.id))w.unlocked=true;});
      World.gathered=new Set(d.gather||[]);
      World.levers.forEach(l=>{if((d.levers||[]).includes(l.id)){l.on=true;World.applyLever(l);}});
      World.plates.forEach((pl,i)=>{if(i<(d.plates||0))pl.on=true;});
      World.torches.forEach((t,i)=>{if(i<(d.torches||0))t.lit=true;});
      World.refreshGate(); World.refreshTorchFlag();
      return true;
    }catch(e){console.warn('load failed',e);return false;}
  },
  saveSettings(){ try{localStorage.setItem(this.SET,JSON.stringify(G.settings));}catch(e){} },
  loadSettings(){ try{const s=JSON.parse(localStorage.getItem(this.SET));if(s)G.settings={...defaultSettings,...s};}catch(e){} },
  wipe(){ localStorage.removeItem(this.KEY); UI.toast('Save erased.','bad'); },
};
