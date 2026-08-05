/* ═══════════════════════════ PROJECT ECHO · data.js ═══════════════════════════
   Shared constants, helpers, global state (G), event bus, and the full
   item/enemy/quest/achievement/skill catalog. */

const TILE = 32, MW = 176, MH = 176;

/* ---- tiny helpers ---- */
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;
const dist=(ax,ay,bx,by)=>Math.hypot(bx-ax,by-ay);
const rand=(a,b)=>a+Math.random()*(b-a), randi=(a,b)=>Math.floor(rand(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)], chance=p=>Math.random()<p;

/* ---- event bus (quest hooks, achievements) ---- */
const Bus={m:{},on(e,f){(this.m[e]=this.m[e]||[]).push(f)},emit(e,d){(this.m[e]||[]).forEach(f=>f(d))}};

/* ---- global state ---- */
const G={
  state:'boot', panel:null, time:8, day:1, reality:0,
  cam:{x:0,y:0}, shake:0, weather:{rain:0}, fps:0,
  keys:new Set(), mouse:{x:0,y:0,down:false,rdown:false},
  enemies:[], npcs:[], parts:[], dnums:[], projs:[], pickups:[],
  flags:{}, ach:new Set(), skills:{},
  stats:{kills:0,crafted:0,gathered:0,shifts:0,itemsGot:0,biomes:new Set(),wpFound:new Set()},
  dialog:null, boardDaily:null, lastSave:0,
};
const defaultSettings={master:.8,music:.6,sfx:.8,shake:true,fps:false,quality:true};
G.settings={...defaultSettings};

/* ═══════════════════════════ ITEMS ═══════════════════════════ */
const RAR=['Common','Uncommon','Rare','Epic','Legendary','Mythic','Unique'];
const RARC=['#b9b9b9','#5ec963','#5096ff','#b48ce8','#e0b060','#ff5d96','#ffffff'];
const ITEMS={};
const IT=id=>ITEMS[id];
function item(id,n,t,rar,val,o={}){ITEMS[id]=Object.assign({id,n,t,rar,val},o);}

/* materials / consumables / food */
item('fiber','Fiber Strand','mat',0,3,{ico:'〰',desc:'Tough plant fiber.'});
item('moonleaf','Moonleaf','mat',1,9,{ico:'❦',desc:'Glows faintly. Alchemists adore it.'});
item('embercap','Embercap','mat',1,8,{ico:'🍄',desc:'A warming fungus.'});
item('iron','Iron Ore','mat',0,6,{ico:'⛏',desc:'Raw ore.'});
item('bone','Bone','mat',0,3,{ico:'🦴',desc:'Brittle but useful.'});
item('echodust','Echo Dust','mat',2,25,{ico:'✦',desc:'Residue of fractured reality.'});
item('scale','Bog Scale','mat',1,7,{ico:'⬖',desc:'Shed by bog horrors.'});
item('hpot','Minor Tonic','potion',0,18,{ico:'🧪',heal:45,desc:'Restores 45 HP.'});
item('hpot2','Greater Tonic','potion',2,60,{ico:'⚗',heal:110,desc:'Restores 110 HP.'});
item('spot','Strider Draught','potion',1,26,{ico:'🫙',stam:70,desc:'Restores 70 stamina.'});
item('fpot','Focus Vial','potion',1,26,{ico:'🔮',focus:50,desc:'Restores 50 focus.'});
item('antidote','Purge Draught','potion',1,22,{ico:'💊',cure:true,desc:'Cures poison and chill.'});
item('elixir','Echo Elixir','potion',3,140,{ico:'✨',heal:200,cure:true,desc:'Grand restorative.'});
item('apple','Red Apple','food',0,4,{ico:'🍎',heal:10,desc:'Crisp.'});
item('bread','Hearth Bread','food',0,7,{ico:'🍞',heal:18,desc:'Warm and dense.'});
item('jerky','Smoked Jerky','food',0,9,{ico:'🥓',heal:24,desc:'Keeps forever.'});
item('stew','Wanderer Stew','food',1,22,{ico:'🍲',heal:40,regen:12,desc:'Heals 40 and grants regeneration.'});
/* quest items */
item('shard_desert','Shard of Sun','quest',6,0,{ico:'☀',desc:'A shard of the fractured lens. Warm to the touch.'});
item('shard_snow','Shard of Silence','quest',6,0,{ico:'❄',desc:'A shard of the fractured lens. Absorbs sound.'});
item('shard_swamp','Shard of Depth','quest',6,0,{ico:'🌑',desc:'A shard of the fractured lens. Drips endlessly.'});
item('echo_blossom','Echo Blossom','mat',4,60,{ico:'❁',desc:'Blooms only in the other reality.'});
item('ledger','Bram\u2019s Ledger','quest',3,0,{ico:'📖',desc:'Lost somewhere the stone fingers point.'});

/* generated melee / bow / armor tiers → a wide equipment catalog */
const SWORDS=[['sw0','Rusty Sword',4,0],['sw1','Iron Sword',7,0],['sw2','Steel Sword',11,1],
  ['sw3','Veridian Blade',16,2],['sw4','Echoforged Blade',23,3],['sw5','Mythic Edge',32,4]];
const BOWS=[['bw0','Shortbow',5,0],['bw1','Hunter Bow',8,1],['bw2','Veridian Bow',12,2],
  ['bw3','Echo Bow',17,3],['bw4','Mythic Recurve',24,4]];
const ARMORS=[['ar0','Cloth Garb',1,0],['ar1','Leather Armor',3,0],['ar2','Iron Plate',6,1],
  ['ar3','Veridian Mail',9,2],['ar4','Echoforged Plate',13,3],['ar5','Mythic Aegis',18,4]];
SWORDS.forEach(([id,n,atk,r])=>item(id,n,'weapon',r,atk*8,{ico:'🗡',atk,desc:`A ${RAR[r].toLowerCase()} blade.`}));
BOWS.forEach(([id,n,atk,r])=>item(id,n,'bow',r,atk*8,{ico:'🏹',atk,desc:'Ranged weapon.'}));
ARMORS.forEach(([id,n,def,r])=>item(id,n,'armor',r,def*10,{ico:'🛡',def,desc:'Worn for protection.'}));
/* suffix-forged variants multiply the catalog */
const SUFFIX=[['Ember',1.12,1],['Frost',1.12,1],['Viper',1.2,2],['Hollow',1.3,3],['Rift',1.4,3],['Sovereign',1.55,4]];
function forgeVariant(base,pre){
  const b=ITEMS[base],[nm,mul,rb]=pre,id=base+'_'+nm.toLowerCase();
  const t=b.t,stat=t==='armor'?'def':'atk';
  item(id,`${b.n} of ${nm}`,t,Math.min(5,b.rar+rb),Math.round(b.val*1.8),
    {ico:b.ico,[stat]:Math.round(b[stat]*mul),desc:`Forged with a ${nm.toLowerCase()} echo.`});
}
SWORDS.concat(BOWS,ARMORS).forEach(([id])=>{if(Math.random()!==undefined)SUFFIX.forEach(s=>forgeVariant(id,s));});
/* charms */
item('ring_haste','Ring of Haste','charm',2,120,{ico:'💍',spd:.1,desc:'+10% movement speed.'});
item('ring_fortune','Ring of Fortune','charm',3,220,{ico:'💍',luck:.15,desc:'Better loot from foes.'});
item('amulet_focus','Amulet of Focus','charm',2,140,{ico:'📿',focusMax:30,desc:'+30 max focus.'});
item('heart_hollow','Heart of the Hollow','charm',5,900,{ico:'❤',atkPct:.2,echoRegen:2,desc:'Mythic. +20% damage, strong echo regeneration.'});

/* ═══════════════════════════ CRAFTING ═══════════════════════════ */
const RECIPES=[
  {out:'hpot',n:1,need:{moonleaf:2,fiber:1}},
  {out:'hpot2',n:1,need:{moonleaf:3,embercap:1}},
  {out:'spot',n:1,need:{fiber:2,apple:1}},
  {out:'fpot',n:1,need:{moonleaf:1,echodust:1}},
  {out:'antidote',n:1,need:{embercap:1,moonleaf:1}},
  {out:'elixir',n:1,need:{moonleaf:3,echodust:3,embercap:2}},
  {out:'stew',n:1,need:{bread:1,jerky:1}},
  {out:'sw2',n:1,need:{iron:4,fiber:2}},
  {out:'ar2',n:1,need:{iron:5,hide:0,fiber:3}},
  {out:'sw4',n:1,need:{iron:8,echodust:6}},
  {out:'ar4',n:1,need:{iron:10,echodust:6}},
];

/* ═══════════════════════════ ENEMIES ═══════════════════════════ */
/* behav: chase | lunge | ranged | brute */
const ETYPES={
  wisp:{name:'Corrupted Wisp',hp:18,spd:66,dmg:6,xp:9,gold:[1,5],r:9,col:'#b48ce8',behav:'chase',fly:true,drops:[['echodust',.35],['fpot',.08]]},
  wolf:{name:'Dire Wolf',hp:30,spd:112,dmg:9,xp:14,gold:[0,3],r:11,col:'#8a8f98',behav:'lunge',drops:[['jerky',.25],['bone',.4]]},
  boar:{name:'Ridgeback Boar',hp:42,spd:88,dmg:11,xp:16,gold:[1,4],r:13,col:'#a06a44',behav:'lunge',drops:[['jerky',.4]]},
  bandit:{name:'Ashfall Bandit',hp:55,spd:82,dmg:13,xp:24,gold:[8,20],r:12,col:'#c0574f',behav:'chase',drops:[['hpot',.18],['sw1',.06],['ar1',.06]]},
  skel:{name:'Hollow Sentinel',hp:48,spd:70,dmg:12,xp:22,gold:[3,10],r:11,col:'#d8d3c0',behav:'chase',drops:[['bone',.5],['ar2',.04]]},
  scorp:{name:'Dune Scorpion',hp:38,spd:96,dmg:10,xp:20,gold:[2,8],r:11,col:'#d8a24c',behav:'chase',poison:true,drops:[['antidote',.2]]},
  shade:{name:'Frost Shade',hp:44,spd:90,dmg:12,xp:26,gold:[2,9],r:11,col:'#9fd8e8',behav:'lunge',chill:true,drops:[['fpot',.15]]},
  bog:{name:'Bog Horror',hp:110,spd:44,dmg:17,xp:40,gold:[4,12],r:17,col:'#5a7a3c',behav:'brute',poison:true,drops:[['scale',.6],['elixir',.06]]},
  construct:{name:'Warden Construct',hp:90,spd:56,dmg:14,xp:44,gold:[6,16],r:15,col:'#7a92a8',behav:'ranged',drops:[['echodust',.4],['bw2',.05]]},
  hollowking:{name:'THE HOLLOW KING',hp:950,spd:74,dmg:22,xp:600,gold:[200,300],r:22,col:'#e85da8',behav:'boss',drops:[['heart_hollow',0]]},
};

/* ═══════════════════════════ SKILLS ═══════════════════════════ */
const SKILLS=[
  {id:'c1',br:'Combat',n:'Might',max:3,d:'+10% damage / rank'},
  {id:'c2',br:'Combat',n:'Vigor',max:3,d:'+15 max HP / rank'},
  {id:'c3',br:'Combat',n:'Precision',max:3,d:'+5% crit chance / rank'},
  {id:'e1',br:'Echo',n:'Resonance',max:3,d:'+20 max echo / rank'},
  {id:'e2',br:'Echo',n:'Attunement',max:3,d:'+50% echo regen / rank'},
  {id:'e3',br:'Echo',n:'Riftwalker',max:3,d:'−10% shift cost / rank'},
  {id:'w1',br:'Wanderer',n:'Swift',max:3,d:'+6% move speed / rank'},
  {id:'w2',br:'Wanderer',n:'Forager',max:3,d:'+33% chance of double gathering'},
  {id:'w3',br:'Wanderer',n:'Barter',max:3,d:'−8% shop prices / rank'},
];

/* ═══════════════════════════ ACHIEVEMENTS ═══════════════════════════ */
const ACHS={
  first_steps:{n:'First Steps',d:'Begin the journey.'},
  first_blood:{n:'First Blood',d:'Defeat your first foe.'},
  shifted:{n:'Between Breaths',d:'Shift reality for the first time.'},
  wolf_bane:{n:'Wolf\u2019s Bane',d:'Slay 10 dire wolves.'},
  hoarder:{n:'Hoarder',d:'Hold 25+ items at once.'},
  rich:{n:'Gilded',d:'Hold 1,000 gold.'},
  lv5:{n:'Resonant',d:'Reach level 5.'},
  lv10:{n:'Harmonist',d:'Reach level 10.'},
  alchemist:{n:'Alchemist',d:'Craft 5 consumables.'},
  shards:{n:'The Lens Reforged',d:'Recover all three shards.'},
  king:{n:'Regicide',d:'Defeat the Hollow King.'},
  explorer:{n:'Cartographer',d:'Visit every biome.'},
  wanderer:{n:'Wayfarer',d:'Discover all waypoints.'},
  hidden:{n:'What the Swamp Keeps',d:'Complete the hidden quest.'},
  mend:{n:'The Mending',d:'Restore the timeline.'},
  sovereign:{n:'Echo Sovereign',d:'Seize the Core.'},
};

/* ═══════════════════════════ QUESTS ═══════════════════════════
   Objective kinds: talk · kill · collect · reach · flag · shift */
const QUESTS={
  M1:{n:'Awakening',main:true,track:true,objs:[{k:'talk',t:'elder',n:1,d:'Find Elder Maren in Emberfall Village'}],
      rew:{xp:30,gold:20,items:['sw1'],rep:5},next:'M2'},
  M2:{n:'The Fractured Lens',main:true,track:true,objs:[
      {k:'collect',t:'shard_desert',n:1,d:'Recover the Shard of Sun (desert obelisk)'},
      {k:'collect',t:'shard_snow',n:1,d:'Recover the Shard of Silence (snow shrine — seek the cracked wall)'},
      {k:'collect',t:'shard_swamp',n:1,d:'Recover the Shard of Depth (swamp heart — light the torches)'}],
      rew:{xp:220,gold:150,rep:15},next:'M3'},
  M3:{n:'The Hollow Court',main:true,track:true,objs:[
      {k:'reach',t:'sanctum',n:1,d:'Enter the Sanctum of the Court (north ruins — shift through the rift wall)'},
      {k:'flag',t:'ritual',n:1,d:'Place the shards on the pedestal'},
      {k:'kill',t:'hollowking',n:1,d:'Destroy the Hollow King'}],
      rew:{xp:500,gold:400},next:'M4'},
  M4:{n:'Every Choice Echoes',main:true,track:true,objs:[{k:'flag',t:'ending',n:1,d:'Decide the fate of the Echo Core'}],rew:{xp:0}},
  S1:{n:'Thin the Fangs',giver:'lira',track:true,objs:[{k:'kill',t:'wolf',n:6,d:'Slay dire wolves (6)'}],rew:{xp:90,gold:60,rep:10}},
  S2:{n:'Bitter Herbs',giver:'elder',track:true,objs:[{k:'collect',t:'moonleaf',n:5,d:'Gather moonleaf (5)'}],rew:{xp:60,gold:40,items:['hpot'],rep:8}},
  S3:{n:'Ledger of Lost Coin',giver:'bram',track:true,objs:[
      {k:'flag',t:'ledger_found',n:1,d:'Find the ledger where the stone fingers point (desert obelisk)'}],
      rew:{xp:120,gold:100,items:['ring_fortune'],rep:10}},
  S4:{n:'Safe Passage',giver:'sable',track:true,objs:[{k:'flag',t:'escort_done',n:1,d:'Escort Sable to the Court road waypoint'}],rew:{xp:150,gold:120,rep:15}},
  H1:{n:'What the Swamp Keeps',hidden:true,track:true,objs:[
      {k:'shift',n:5,d:'Shift reality five times'},
      {k:'collect',t:'echo_blossom',n:3,d:'Pick echo blossoms (only bloom in the other reality)'}],
      rew:{xp:300,gold:200,items:['amulet_focus']}},
};

/* ending copy */
const ENDINGS={
  mend:{t:'THE MENDING',x:'You pour the Core\u2019s light back into the wound of the world. Rifts seal, colors return, and somewhere a bell rings in Emberfall for the first time in years. You are nameless now — and free. Every choice echoed. This one sang.'},
  seize:{t:'THE ECHO SOVEREIGN',x:'You close your fist around the Core and keep its song. Realities bend toward you like grass before a storm. The world is healed — because it obeys you. Every choice echoes. This one kneels.'},
};
