(()=>{const out=[];
// Steam's solid dark blue-grays used as "fade" shadows
const T=/rgba?\(\s*(14,\s*20,\s*27|19,\s*32,\s*44|23,\s*26,\s*33|35,\s*38,\s*46|30,\s*37,\s*46|22,\s*32,\s*45|11,\s*14,\s*18)(,\s*(0?\.[5-9]\d*|1))?\s*\)/;
const walk=(rules)=>{for(const r of rules){if(r.cssRules&&!r.style){walk(r.cssRules);continue}if(!r.style||!r.selectorText)continue;const v=r.style.getPropertyValue("box-shadow");if(v&&T.test(v))out.push({sel:r.selectorText,val:v.trim()})}};
for(const s of document.styleSheets){if(s.ownerNode&&s.ownerNode.id)continue;try{walk(s.cssRules)}catch{}}return JSON.stringify(out)})()
