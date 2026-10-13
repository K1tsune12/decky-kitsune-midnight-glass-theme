(()=>{const out=[];const T=/rgb\(\s*(61,\s*68,\s*80|103,\s*112,\s*123|70,\s*77,\s*88)\s*\)/;
const walk=(rules)=>{for(const r of rules){if(r.cssRules&&!r.style){walk(r.cssRules);continue}if(!r.style||!r.selectorText)continue;const v=r.style.getPropertyValue("color");if(v&&T.test(v))out.push({sel:r.selectorText,val:v.trim()})}};
for(const s of document.styleSheets){if(s.ownerNode&&s.ownerNode.id)continue;try{walk(s.cssRules)}catch{}}return JSON.stringify(out)})()
