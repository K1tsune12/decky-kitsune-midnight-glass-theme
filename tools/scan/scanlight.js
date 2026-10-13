(()=>{const out={focus:[],panels:[]};const parse=v=>{const m=v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);return m&&{r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}};
const FOCUS=/gpfocus|:focus|:hover|:active|Active|Selected|selected|Focused|Highlight/;
const CONTROL=/Button|Toggle|Slider|Input|Dropdown|Checkbox|Radio|Progress|Scrollbar|scrollbar|Notch|Track|Knob/i;
const walk=(rules)=>{for(const r of rules){if(r.cssRules&&!r.style){walk(r.cssRules);continue}if(!r.style||!r.selectorText)continue;
 for(const p of ["background-color","background"]){const v=r.style.getPropertyValue(p);if(!v)continue;const c=parse(v);if(!c)continue;const max=Math.max(c.r,c.g,c.b),min=Math.min(c.r,c.g,c.b);if(max-min>40)continue;
  if(c.a>=0.5&&max>=200&&FOCUS.test(r.selectorText)&&!/disabled/i.test(r.selectorText))out.focus.push({sel:r.selectorText,val:v.trim()});
  else if(c.a<0.5&&c.a>=0.08&&max>=90&&!FOCUS.test(r.selectorText)&&!CONTROL.test(r.selectorText))out.panels.push({sel:r.selectorText,val:v.trim()});}}};
for(const s of document.styleSheets){if(s.ownerNode&&s.ownerNode.id)continue;try{walk(s.cssRules)}catch{}}return JSON.stringify(out)})()
