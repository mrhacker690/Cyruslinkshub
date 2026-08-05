/* ═══ audio.js — fully procedural WebAudio: music, ambience, SFX ═══ */
const AudioSys={
  ctx:null, master:null, musGain:null, sfxGain:null, ambGain:null, combat:false,
  unlock(){ if(this.ctx) return; try{
    this.ctx=new (window.AudioContext||window.webkitAudioContext)();
    this.master=this.ctx.createGain(); this.master.connect(this.ctx.destination);
    this.musGain=this.ctx.createGain(); this.musGain.connect(this.master);
    this.sfxGain=this.ctx.createGain(); this.sfxGain.connect(this.master);
    this.ambGain=this.ctx.createGain(); this.ambGain.connect(this.master);
    this.startAmbience(); this.startMusic(); this.applyVolumes();
  }catch(e){} },
  applyVolumes(){ if(!this.ctx)return; const s=G.settings;
    this.master.gain.value=s.master; this.musGain.gain.value=s.music*.5;
    this.sfxGain.gain.value=s.sfx; this.ambGain.gain.value=s.sfx*.4; },
  tone(f,dur,type='sine',vol=.3,slide=0){ if(!this.ctx)return;
    const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+dur);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(g);g.connect(this.sfxGain);o.start(t);o.stop(t+dur+.02); },
  noise(dur=.1,vol=.2,freq=800){ if(!this.ctx)return;
    const t=this.ctx.currentTime,len=this.ctx.sampleRate*dur,buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const src=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();
    src.buffer=buf;f.type='lowpass';f.frequency.value=freq;g.gain.setValueAtTime(vol,t);
    g.gain.exponentialRampToValueAtTime(.001,t+dur);
    src.connect(f);f.connect(g);g.connect(this.sfxGain);src.start(); },
  /* SFX */
  click(){this.tone(880,.06,'square',.12)}, swing(){this.noise(.09,.25,1800)},
  hit(){this.tone(160,.12,'square',.3,-80);this.noise(.06,.3,900)},
  hurt(){this.tone(110,.25,'sawtooth',.35,-60)}, shoot(){this.tone(520,.1,'triangle',.2,-300)},
  cast(){this.tone(320,.25,'sine',.25,400)}, pickup(){this.tone(660,.08,'sine',.2);setTimeout(()=>this.tone(990,.1,'sine',.2),70)},
  levelup(){[440,554,659,880].forEach((f,i)=>setTimeout(()=>this.tone(f,.3,'triangle',.25),i*90))},
  shift(){this.tone(200,.6,'sine',.3,900);this.tone(1200,.6,'sine',.15,-900)},
  quest(){this.tone(523,.15,'triangle',.25);setTimeout(()=>this.tone(784,.3,'triangle',.25),140)},
  death(){this.tone(220,.9,'sawtooth',.3,-180)},
  /* ambient wind/rain bed */
  startAmbience(){ const sr=this.ctx.sampleRate,buf=this.ctx.createBuffer(1,sr*2,sr),d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const src=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();
    src.buffer=buf;src.loop=true;f.type='lowpass';f.frequency.value=280;g.gain.value=.12;
    src.connect(f);f.connect(g);g.connect(this.ambGain);src.start(); this.ambFilter=f; },
  setRain(on){ if(this.ambFilter)this.ambFilter.frequency.value=on?1400:280; },
  /* music: gentle generative arpeggio; darker when combat=true */
  startMusic(){ const chords=[[110,165,220,275],[98,147,196,247],[87,131,175,220],[110,165,220,330]];
    let step=0; this.musTimer=setInterval(()=>{ if(!this.ctx||G.state==='boot')return;
      const ch=chords[Math.floor(step/8)%4],f=ch[step%4]*(this.combat?2:1);
      this.toneMus(f,this.combat?.22:.5,this.combat?'sawtooth':'triangle',this.combat?.05:.045);
      if(step%8===0)this.toneMus(ch[0]/2,1.4,'sine',.06); step++; },this.combat?160:280); },
  toneMus(f,dur,type,vol){ const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(g);g.connect(this.musGain);o.start(t);o.stop(t+dur+.02); },
  setCombat(c){ if(c===this.combat)return; this.combat=c;
    if(this.musTimer){clearInterval(this.musTimer);this.startMusic();} },
};
