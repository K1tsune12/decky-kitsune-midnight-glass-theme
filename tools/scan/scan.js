(()=>{
const kf=[];const bg=[];
const parse=v=>{const m=v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(!m)return null;return {r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}};
const walk=(rules)=>{for(const r of rules){
 if(r.type===7){const frames=[];for(const f of r.cssRules){const v=f.style.getPropertyValue("background-color")||f.style.getPropertyValue("background");if(v)frames.push(f.keyText+": "+v)}if(frames.length)kf.push({name:r.name,frames});continue}
 if(r.cssRules&&!r.style){walk(r.cssRules);continue}
 if(!r.style||!r.selectorText)continue;
 for(const p of ["background-color","background"]){const v=r.style.getPropertyValue(p);if(!v)continue;const c=parse(v);if(!c)continue;
  const max=Math.max(c.r,c.g,c.b),min=Math.min(c.r,c.g,c.b);
  // dark/mid grays or Steam blue-grays, fairly opaque, not pure black
  if(c.a>=0.5&&max>=10&&max<=110&&max-min<=40)bg.push({sel:r.selectorText,prop:p,val:v.trim(),imp:r.style.getPropertyPriority(p)})}}};
for(const s of document.styleSheets){if(s.ownerNode&&s.ownerNode.id)continue;try{walk(s.cssRules)}catch{}}
return JSON.stringify({kf,bg})})()
