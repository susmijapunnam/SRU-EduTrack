const SUBJ=["Algorithms","Statistics","Deep Learning","Machine Learning","Python"],SH=["Algo","Stats","DL","ML","Python"],DEPTS=["CSE","CSE (AI/ML)","ECE","EEE"];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let D=null,view="dash",q="",selStu="",first=true,attSub=SUBJ[0],attDate=new Date().toISOString().slice(0,10);

/* ---------- Data ---------- */
function seed(){
 const names=[["Aarav Sharma","CSE",1],["Diya Reddy","CSE",1],["Rohan Mehta","CSE (AI/ML)",2],["Sneha Patel","CSE (AI/ML)",2],["Kabir Singh","ECE",1],["Ananya Rao","ECE",3],["Vikram Nair","EEE",2],["Meera Iyer","EEE",3],["Ishaan Verma","CSE",2],["Kavya Menon","CSE",2],["Arjun Kapoor","CSE",3],["Priya Nambiar","CSE",3],["Rahul Joshi","CSE (AI/ML)",1],["Tanvi Deshmukh","CSE (AI/ML)",1],["Siddharth Rao","CSE (AI/ML)",3],["Nisha Gupta","CSE (AI/ML)",3],["Harsh Vardhan","ECE",1],["Pooja Krishnan","ECE",2],["Manish Yadav","ECE",2],["Lakshmi Prasad","ECE",3],["Aditya Bhat","ECE",3],["Shreya Kulkarni","EEE",1],["Naveen Kumar","EEE",1],["Divya Chandran","EEE",2],["Karthik Subramanian","EEE",3],["Fatima Sheikh","CSE",1],["Varun Malhotra","CSE (AI/ML)",2],["Bhavana Reddy","ECE",1]];
 const scores={"1-0-0":86,"1-0-1":86,"1-2-1":100,"1-3-0":91,"1-3-1":91,"1-4-0":80,"2-1-1":100,"2-2-0":100,"2-2-1":81,"8-1-1":100,"8-2-0":100,"8-2-1":67};
 const d={students:[],marks:[],att:{},next:29};
 names.forEach((n,i)=>{const id=i+1;d.students.push({id,name:n[0],dept:n[1],batch:n[2],roll:"L"+(10+id),email:"2503a51l"+(10+id)+"@sru.edu.in",phone:"98765"+(10000+id*137)});
  SUBJ.forEach((s,j)=>["Mid-term","Final"].forEach((e,k)=>{
   const score=scores[`${id}-${j}-${k}`]??Math.max(22,Math.min(98,Math.round(45+((id*17+j*13+k*7)%50)-(id%7===0?28:0))));
   d.marks.push({id:id*100+j*2+k,sid:id,subject:s,exam:e,score,max:100})
  }))});
 const today=new Date();
 for(let k=1;k<=14;k++){const dt=new Date(today-k*864e5);if(dt.getDay()%6===0)continue;const dk=dt.toISOString().slice(0,10);SUBJ.forEach((sb,j)=>{const key=dk+"|"+sb;d.att[key]={};d.students.forEach(s=>d.att[key][s.id]=((s.id*7+k*3+j*5)%9===0||((s.id%7===0||s.id%11===0)&&(k+j)%2))?"A":"P")})}
 return d}
function load(){try{D=JSON.parse(localStorage.getItem("edutrack4")||"null")}catch(e){D=null}if(!D)D=seed()}
function save(){try{localStorage.setItem("edutrack4",JSON.stringify(D))}catch(e){}}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),1800)}

/* ---------- Helpers ---------- */
const pct=(a,b)=>b?Math.round(a/b*100):0;
const tier=p=>p===null?"n":p>=85?4:p>=70?3:p>=55?2:p>=40?1:0;
const grade=p=>["F","D","C","B","A"][tier(p)];
const fmt=v=>v===null?"–":v+"%";
const mavg=m=>m.length?Math.round(m.reduce((a,x)=>a+x.score/x.max*100,0)/m.length):null;
const avg=sid=>mavg(D.marks.filter(x=>x.sid==sid));
const subAvg=(sid,sub)=>mavg(D.marks.filter(x=>x.sid==sid&&x.subject===sub));
function attPct(sid){let p=0,t=0;Object.values(D.att).forEach(d=>{if(d[sid]){t++;if(d[sid]==="P")p++}});return t?pct(p,t):null}
const ak=()=>attDate+'|'+attSub;
const dl=s=>s.dept+' \u00b7 Batch '+s.batch;
const initials=n=>n.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
const av=(s,c="")=>`<div class="av a${s.id%5} ${c}">${esc(initials(s.name))}</div>`;
const stamp=p=>p===null?"":`<span class="stamp s${tier(p)}">${grade(p)}</span>`;

/* ---------- Router ---------- */
function render(){
 document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===view));
 $("#main").innerHTML=`<div class="promo" role="link" tabindex="0" aria-label="Track results" onclick="go('trk')" onkeydown="if(event.key==='Enter')go('trk')"><div class="pm-t"><span>SCORE</span><b>TRACK RESULTS TODAY</b></div></div>`+({dash,stu,grd,att,trk,ana,rep:repo})[view]();first=false}
function go(v){view=v;render();window.scrollTo(0,0)}
function gs(e){e.preventDefault();q=$("#gq").value;go("stu");return false}

/* ---------- Dashboard ---------- */
function dash(){
 const S=D.students,mean=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0;
 const atts=S.map(s=>attPct(s.id)).filter(v=>v!==null);
 const risk=S.filter(s=>(avg(s.id)!==null&&avg(s.id)<50)||(attPct(s.id)!==null&&attPct(s.id)<75));
 const subj=SUBJ.map(s=>[s,mavg(D.marks.filter(x=>x.subject===s))]);
 let i=0;
 const sv=subj.filter(x=>x[1]!==null).sort((a,b)=>b[1]-a[1]),lowAtt=S.filter(s=>attPct(s.id)!==null&&attPct(s.id)<75).length,lowSc=S.filter(s=>avg(s.id)!==null&&avg(s.id)<50).length;
 const map=S.length?`<div></div>${SH.map(h=>`<div class="mh">${h}</div>`).join("")}<div class="mh">Overall</div>`+S.map(s=>{const o=avg(s.id);
  return `<div class="mn">${av(s)}${esc(s.name.split(" ")[0])}</div>`+SUBJ.map(sb=>{const v=subAvg(s.id,sb);return `<div class="cell t${tier(v)}" style="animation-delay:${(i++)*18}ms">${v===null?"–":v}</div>`}).join("")+`<div class="cell t${tier(o)}" style="animation-delay:${(i++)*18}ms">${o===null?"–":o}</div>`}).join(""):'<div class="empty">Add students to see the score map.</div>';
 return `<div class="head"><div><h1>Dashboard</h1><div class="sub">${new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div><button class="btn hi" onclick="go('att')">Take today’s attendance</button></div>
 <div class="strip"><div><div class="num">${S.length}</div><span>Students enrolled</span></div><div><div class="num">76%</div><span>Average score</span></div><div><div class="num">84%</div><span>Average attendance</span></div><div class="rk" role="button" tabindex="0" title="Show who needs attention" onclick="showRisk()" onkeydown="if(event.key==='Enter')showRisk()"><div class="num" style="color:${risk.length?"var(--red)":"var(--ok)"}">${risk.length}</div><span>Need attention</span></div></div>
 <div class="panel ${first?"go":""}"><h2>Score map</h2><div class="legend">Low <i class="t0"></i><i class="t1"></i><i class="t2"></i><i class="t3"></i><i class="t4"></i> High · average % per subject</div><div class="tw" style="overflow-x:auto"><div class="map" style="min-width:520px">${map}</div></div></div>
 <div class="two"><div class="panel" style="grid-column:1/-1"><h2>Subject averages</h2><div style="height:8px"></div>${subj.map(([s,v])=>`<div class="sb sbx"><span>${esc(s)}<small>${v===null?'No marks':'Grade '+grade(v)+(sv.length&&s===sv[0][0]?' · Strongest':sv.length>1&&s===sv[sv.length-1][0]?' · Needs work':'')}</small></span><u><b style="width:${v||0}%"></b></u><b>${fmt(v)}</b></div>`).join("")}</div>
 <div class="panel" style="grid-column:1/-1"><h2>Needs attention</h2><div class="sub" style="font-size:13px;margin-bottom:10px">${risk.length} flagged · ${lowSc} with score under 50% · ${lowAtt} with attendance under 75%. Tap a card for the full result.</div>${risk.length?`<div class="notes">${risk.map(s=>{const a=avg(s.id),t=attPct(s.id),w=SUBJ.map(sb=>[sb,subAvg(s.id,sb)]).filter(x=>x[1]!==null).sort((x,y)=>x[1]-y[1])[0],why=[a!==null&&a<50?'Low score':'',t!==null&&t<75?'Attendance shortage':'',w?'Weakest: '+w[0]+' '+w[1]+'%':''].filter(Boolean).join(' · ');return `<div class="note" role="button" tabindex="0" onclick="view='trk';tview(${s.id})"><div class="nh">${av(s)}<div><b>${esc(s.name)}</b><small>${esc(s.roll)} · ${esc(s.dept)}</small></div></div><div class="chipr"><span class="rc ${a!==null&&a<50?'bad':''}">Score ${fmt(a)}</span><span class="rc ${t!==null&&t<75?'bad':''}">Attendance ${fmt(t)}</span></div><small class="why">${esc(why)}</small></div>`}).join("")}</div>`:'<div class="empty">Everyone is on track.</div>'}</div></div>`}

function showRisk(){
 const L=D.students.filter(s=>(avg(s.id)!==null&&avg(s.id)<50)||(attPct(s.id)!==null&&attPct(s.id)<75));
 openModal(`<h3>Need attention</h3><div class="sub" style="margin-bottom:8px">${L.length?L.length+' student'+(L.length>1?'s':'')+' flagged':'No students need attention'}</div>${L.map(s=>{const a=avg(s.id),t=attPct(s.id),why=[a!==null&&a<50?'Score below 50%':'',t!==null&&t<75?'Attendance below 75%':''].filter(Boolean).join(' \u00b7 ');return `<div class="arow">${av(s)}<div class="grow"><b>${esc(s.name)}</b><small style="display:block;color:var(--mute)">${esc(s.roll)} \u00b7 ${esc(dl(s))}</small><small style="display:block;color:var(--red);font-weight:700">${esc(why)}</small><small style="display:block;color:var(--mute)">Score ${fmt(a)} \u00b7 Attendance ${fmt(t)}</small></div><button class="btn g" onclick="closeModal();view='trk';tview(${s.id})">View</button></div>`}).join('')||'<div class="empty">Everyone is on track.</div>'}<div class="acts"><button class="btn" onclick="closeModal()">Close</button></div>`)}

/* ---------- Students Directory ---------- */
function stu(){
 const list=D.students.filter(s=>(s.name+s.roll+s.dept+' batch '+s.batch).toLowerCase().includes(q.toLowerCase()));
 return `<div class="head"><div><h1>Students Directory</h1><div class="sub">${D.students.length} enrolled</div></div><div class="tools"><input id="q" placeholder="Search name, roll, dept or batch" value="${esc(q)}" oninput="q=this.value;render();const e=$('#q');e.focus();e.setSelectionRange(q.length,q.length)"><button class="btn hi" onclick="stuForm()">Add student</button></div></div>
 <div class="panel">${list.map(s=>{const a=avg(s.id);return `<div class="row">${av(s)}<div><a onclick="report(${s.id})">${esc(s.name)}</a><small>${esc(s.roll)} · ${esc(s.email)}</small></div><div class="hm" style="font-size:13px;font-weight:700">${esc(s.dept)}<small>Batch ${esc(s.batch)}</small></div><div>${stamp(a)}</div><div class="mini hm"><u><b style="width:${a||0}%"></b></u>${fmt(a)}</div><div class="hm">${dots(s.id)}</div><div><button class="btn g" onclick="stuForm(${s.id})">Edit</button><button class="btn d" onclick="delStu(${s.id})">Delete</button></div></div>`}).join("")||'<div class="empty">No students match. Add a student to get started.</div>'}</div>`}

function stuForm(id){
 const s=D.students.find(x=>x.id===id)||{name:"",dept:"CSE",batch:1,roll:"L"+(10+D.next),email:"",phone:""};
 openModal(`<h3>${id?"Edit student":"Add student"}</h3>
 <label>Full name</label><input id="f_name" value="${esc(s.name)}">
 <label>Department</label><select id="f_dept">${DEPTS.map(d=>`<option ${d===s.dept?"selected":""}>${d}</option>`).join("")}</select>
 <label>Batch number</label><input id="f_batch" type="number" min="1" value="${esc(s.batch)}">
 <label>Roll number</label><input id="f_roll" value="${esc(s.roll)}" placeholder="e.g. L11">
 <label>Email</label><input id="f_email" type="email" value="${esc(s.email)}" placeholder="Auto: 2503a51l11@sru.edu.in">
 <label>Phone</label><input id="f_phone" value="${esc(s.phone)}">
 <div class="acts"><button class="btn g" onclick="closeModal()">Cancel</button><button class="btn hi" onclick="saveStu(${id||0})">Save student</button></div>`)}
function saveStu(id){
 const v=k=>$("#f_"+k).value.trim();if(!v("name")||!v("roll")){alert("Enter a name and a roll number to save.");return}
 const roll=v("roll").toUpperCase();const o={name:v("name"),dept:v("dept"),batch:+v("batch")||1,roll,email:v("email")||"2503a51"+roll.toLowerCase()+"@sru.edu.in",phone:v("phone")};
 if(id)Object.assign(D.students.find(x=>x.id===id),o);else D.students.push({id:D.next++,...o});
 save();closeModal();render();toast("Student saved")}
function delStu(id){if(!confirm("Delete this student and all their marks and attendance?"))return;
 D.students=D.students.filter(s=>s.id!==id);D.marks=D.marks.filter(m=>m.sid!==id);Object.values(D.att).forEach(d=>delete d[id]);save();render();toast("Student deleted")}

function report(id){
 const s=D.students.find(x=>x.id===id),a=avg(id);
 openModal(`<div style="display:flex;gap:14px;align-items:center">${av(s)}<div><h3 style="margin:0">${esc(s.name)}</h3><div class="sub">${esc(s.roll)} · ${esc(dl(s))}</div></div><div style="margin-left:auto">${stamp(a)}</div></div>
 <div style="margin:16px 0 4px;font-weight:700">Overall ${fmt(a)} · Attendance ${fmt(attPct(id))}</div>
 ${SUBJ.map(sb=>{const v=subAvg(id,sb);return `<div class="sb"><span>${esc(sb)}</span><u><b style="width:${v||0}%"></b></u><b>${fmt(v)}</b></div>`}).join("")}
 <div class="sub" style="font-size:13px">${esc(s.email)} · ${esc(s.phone)}</div>
 <div class="acts"><button class="btn" onclick="closeModal()">Close</button></div>`)}

/* ---------- Academics ---------- */
function grd(){
 if(!D.students.find(s=>s.id==selStu))selStu=D.students[0]?.id||"";
 const s=D.students.find(x=>x.id==selStu),marks=D.marks.filter(m=>m.sid==selStu);
 return `<div class="head"><div><h1>Academics</h1><div class="sub">Pick a student, then record marks.</div></div><button class="btn hi" onclick="markForm()" ${s?"":"disabled"}>Add marks</button></div>
 <div class="chips">${D.students.map(x=>`<button class="chip ${x.id==selStu?"on":""}" onclick="selStu=${x.id};render()">${av(x)}${esc(x.name.split(" ")[0])}</button>`).join("")}</div>
 ${s?`<div class="tiles">${SUBJ.map(sb=>{const v=subAvg(s.id,sb);return `<div class="tile t${tier(v)}"><div><span>${esc(sb)}</span><b>${fmt(v)}</b></div><b>${v===null?"":grade(v)}</b></div>`}).join("")}</div>
 <div class="panel">${marks.map(m=>{const p=Math.round(m.score/m.max*100);return `<div class="arow">${stamp(p)}<div class="grow"><b>${esc(m.subject)}</b><small style="display:block;color:var(--mute)">${esc(m.exam)}</small></div><div><b>${m.score}</b> / ${m.max} <span style="color:var(--mute)">(${p}%)</span></div><button class="btn d" onclick="delMark(${m.id})">Remove</button></div>`}).join("")||'<div class="empty">No marks yet. Add the first one.</div>'}</div>`:'<div class="panel empty">Add a student first.</div>'}`}
function markForm(){
 openModal(`<h3>Add marks</h3><label>Subject</label><select id="m_sub">${SUBJ.map(s=>`<option>${s}</option>`).join("")}</select>
 <label>Exam</label><select id="m_ex"><option>Quiz</option><option>Mid-term</option><option>Final</option><option>Assignment</option></select>
 <label>Score</label><input id="m_sc" type="number" min="0">
 <label>Out of</label><input id="m_mx" type="number" value="100" min="1">
 <div class="acts"><button class="btn g" onclick="closeModal()">Cancel</button><button class="btn hi" onclick="saveMark()">Save marks</button></div>`)}
function saveMark(){
 const sc=+$("#m_sc").value,mx=+$("#m_mx").value;if($("#m_sc").value===""||mx<=0||sc<0||sc>mx){alert("Enter a score between 0 and the maximum.");return}
 D.marks.push({id:Date.now(),sid:+selStu,subject:$("#m_sub").value,exam:$("#m_ex").value,score:sc,max:mx});save();closeModal();render();toast("Marks saved")}
function delMark(id){D.marks=D.marks.filter(m=>m.id!==id);save();render();toast("Marks removed")}

/* ---------- Attendance (per subject, per day) ---------- */
function att(){
 const day=D.att[ak()]||{},vals=D.students.map(s=>day[s.id]);
 const p=vals.filter(v=>v==="P").length,a=vals.filter(v=>v==="A").length;
 return `<div class="head"><div><h1>Attendance</h1><div class="sub">${esc(attSub)} \u00b7 ${p} present · ${a} absent · ${D.students.length-p-a} not marked</div></div><div class="tools"><input type="date" value="${attDate}" onchange="attDate=this.value;render()"><select onchange="attSub=this.value;render()">${SUBJ.map(s=>`<option ${s===attSub?"selected":""}>${s}</option>`).join("")}</select><button class="btn hi" onclick="markAll()">Mark all present</button></div></div>
 <div class="panel">${D.students.map(s=>{const v=day[s.id];return `<div class="arow">${av(s)}<div class="grow"><b>${esc(s.name)}</b><small style="display:block;color:var(--mute)">Overall ${fmt(attPct(s.id))}</small></div><div class="seg"><button class="${v==="P"?"p":""}" onclick="setAtt(${s.id},'P')">Present</button><button class="${v==="A"?"a":""}" onclick="setAtt(${s.id},'A')">Absent</button></div></div>`}).join("")||'<div class="empty">Add students to take attendance.</div>'}</div>`}
function setAtt(id,v){(D.att[ak()]=D.att[ak()]||{})[id]=v;save();render()}
function markAll(){D.att[ak()]=D.att[ak()]||{};D.students.forEach(s=>D.att[ak()][s.id]="P");save();render();toast("Everyone marked present")}

/* ---------- Analytics ---------- */
let R={type:'perf',cls:'all'};
const classes=()=>[...new Set(D.students.map(s=>s.dept).filter(Boolean))].sort();
const mean=x=>x.length?Math.round(x.reduce((p,q)=>p+q,0)/x.length):null;
const attC=id=>{let p=0,a=0;Object.values(D.att).forEach(d=>{if(d[id]==='P')p++;else if(d[id]==='A')a++});return[p,a]};

function ana(){
 const S=D.students,L=['F','D','C','B','A'];
 const dist=[4,3,2,1,0].map(t=>[t,S.filter(s=>tier(avg(s.id))===t).length]),mx=Math.max(1,...dist.map(d=>d[1]));
 const cl=classes().map(c=>{const m=S.filter(s=>s.dept===c);return[c,mean(m.map(s=>avg(s.id)).filter(v=>v!==null)),mean(m.map(s=>attPct(s.id)).filter(v=>v!==null)),m.length]});
 const bd={};Object.keys(D.att).forEach(k=>{(bd[k.split('|')[0]]=bd[k.split('|')[0]]||[]).push(...Object.values(D.att[k]))});const days=Object.keys(bd).sort().slice(-14).map(d=>[d.slice(5),pct(bd[d].filter(x=>x==='P').length,bd[d].length)]);
 const subj=SUBJ.map(s=>[s,mavg(D.marks.filter(x=>x.subject===s))]).filter(x=>x[1]!==null).sort((a,b)=>b[1]-a[1]);
 const rk=S.filter(s=>avg(s.id)!==null).sort((a,b)=>avg(b.id)-avg(a.id));
 const low=S.filter(s=>attPct(s.id)!==null&&attPct(s.id)<75).length;
 const dots=S.filter(s=>avg(s.id)!==null&&attPct(s.id)!==null).map(s=>`<circle cx='${34+attPct(s.id)*2.7}' cy='${204-avg(s.id)*1.95}' r='7' style='fill:var(--blue);fill-opacity:.75'><title>${esc(s.name)}: ${avg(s.id)}% score, ${attPct(s.id)}% attendance</title></circle>`).join('');
 const bestC=[...cl].filter(c=>c[1]!==null).sort((a,b)=>b[1]-a[1])[0];
 return `<div class='head'><div><h1>Analytics</h1><div class='sub'>Patterns across scores, attendance and departments.</div></div></div>
 <div class='two'>
 <div class='panel'><h2>Grade distribution</h2><div class='sub' style='font-size:13px;margin-bottom:10px'>Students by overall grade</div><div class='cols'>${dist.map(([t,n])=>`<div class='col'><b>${n}</b><div class='t${t}' style='height:${n/mx*100}px'></div><span>${L[t]}</span></div>`).join('')}</div></div>
 <div class='panel'><h2>Attendance trend</h2><div class='sub' style='font-size:13px;margin-bottom:10px'>% present, last ${days.length} school days</div><div class='cols sm'>${days.map(([d,v],i)=>`<div class='col' title='${d}: ${v}%'><div style='height:${v*.9}px'></div><span>${i%2?'':d}</span></div>`).join('')||'<div class="empty">No attendance recorded yet.</div>'}</div></div>
 <div class='panel'><h2>Department comparison</h2>${cl.map(c=>`<div class='sb' style='grid-template-columns:96px 1fr 40px'><span style='font-size:12px;line-height:1.2'>${esc(c[0])}<br>score</span><u><b style='width:${c[1]||0}%'></b></u><b>${fmt(c[1])}</b></div><div class='sb' style='grid-template-columns:96px 1fr 40px'><span style='font-size:12px;line-height:1.2'>${esc(c[0])}<br>attendance</span><u><b style='width:${c[2]||0}%;background:var(--ok)'></b></u><b>${fmt(c[2])}</b></div>`).join('')||'<div class="empty">No classes yet.</div>'}</div>
 <div class='panel'><h2>Score vs attendance</h2><div class='sub' style='font-size:13px'>Each dot is one student</div><svg viewBox='0 0 320 230' style='width:100%;height:auto'><g style='stroke:var(--line)'><line x1='34' y1='9' x2='34' y2='204'/><line x1='34' y1='204' x2='304' y2='204'/><line x1='34' y1='106' x2='304' y2='106' stroke-dasharray='3'/><line x1='169' y1='9' x2='169' y2='204' stroke-dasharray='3'/></g>${dots}<g style='fill:var(--mute);font-size:10px'><text x='34' y='220'>0%</text><text x='120' y='220'>Attendance</text><text x='290' y='220'>100%</text><text x='4' y='12'>100</text><text x='10' y='208'>0</text><text x='4' y='108'>Score</text></g></svg></div>
 </div>
 <div class='panel'><h2>Insights</h2><ul class='ins'>${subj.length?`<li>Strongest subject is <b>${esc(subj[0][0])}</b> at ${subj[0][1]}%; weakest is <b>${esc(subj[subj.length-1][0])}</b> at ${subj[subj.length-1][1]}%.</li>`:''}${rk.length?`<li>Top performer is <b>${esc(rk[0].name)}</b> with ${avg(rk[0].id)}%.</li>`:''}${bestC?`<li>Department <b>${esc(bestC[0])}</b> leads with a ${bestC[1]}% average score.</li>`:''}<li>${low?`<b>${low}</b> student${low>1?'s have':' has'} attendance below 75%.`:'All students are at or above 75% attendance.'}</li></ul></div>`}

/* ---------- Reports ---------- */
function repData(){
 const S=D.students.filter(s=>R.cls==='all'||s.dept===R.cls);
 const rk=[...D.students].sort((a,b)=>(avg(b.id)??-1)-(avg(a.id)??-1)).map(s=>s.id);
 const b=s=>[s.roll,s.name,s.dept,s.batch],g=v=>v===null?'–':grade(v);
 if(R.type==='perf')return{t:'Academic performance report',h:['Roll','Name','Dept','Batch',...SH,'Overall','Grade','Rank'],r:S.map(s=>[...b(s),...SUBJ.map(x=>fmt(subAvg(s.id,x))),fmt(avg(s.id)),g(avg(s.id)),rk.indexOf(s.id)+1])};
 if(R.type==='att')return{t:'Attendance summary report',h:['Roll','Name','Dept','Batch','Present','Absent','Attendance','Status'],r:S.map(s=>{const[p,a]=attC(s.id),t=attPct(s.id);return[...b(s),p,a,fmt(t),t===null?'–':t>=90?'Excellent':t>=75?'Satisfactory':'Low']})};
 if(R.type==='day'){const s=D.students.find(x=>x.id==R.sid)||D.students[0];if(!s)return{t:'Day-wise attendance',h:['Date'],r:[]};const dates=[...new Set(Object.keys(D.att).filter(k=>D.att[k][s.id]).map(k=>k.split('|')[0]))].sort().reverse();const rows=dates.map(d=>{const c=SUBJ.map(sb=>D.att[d+'|'+sb]?.[s.id]||'–');const pp=c.filter(x=>x==='P').length,tt=c.filter(x=>x!=='–').length;return[d,...c,fmt(tt?pct(pp,tt):null)]});rows.push(['Subject %',...SUBJ.map(sb=>fmt(subAtt(s.id,sb))),'']);return{t:'Day-wise attendance · '+s.name+' ('+s.roll+')',h:['Date',...SH,'Day %'],r:rows}}
 return{t:'Student progress summary',h:['Roll','Name','Dept','Batch','Average','Grade','Attendance','Remarks'],r:S.map(s=>{const a=avg(s.id),t=attPct(s.id);let m=a===null?'No marks yet':a>=85?'Excellent':a>=70?'Good':a>=50?'Satisfactory':'Needs support';if(t!==null&&t<75)m+=', low attendance';return[...b(s),fmt(a),g(a),fmt(t),m]})};
}
function repo(){
 const d=repData();
 return `<div class='head'><div><h1>Reports</h1><div class='sub'>Choose a report and a department, then copy or print it.</div></div><div class='tools'><select onchange='R.type=this.value;render()'>${[['perf','Academic performance'],['att','Attendance summary'],['sum','Student progress'],['day','Day-wise attendance (one student)']].map(o=>`<option value='${o[0]}' ${R.type===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select><select onchange='R.cls=this.value;render()'><option value='all'>All departments</option>${classes().map(c=>`<option ${R.cls===c?'selected':''}>${esc(c)}</option>`).join('')}</select>${R.type==='day'?`<select onchange='R.sid=this.value;render()'>${D.students.map(s=>`<option value='${s.id}' ${s.id==(R.sid||D.students[0]?.id)?'selected':''}>${esc(s.name)} (${esc(s.roll)})</option>`).join('')}</select>`:''}<button class='btn g' onclick='copyCSV()'>Copy CSV</button><button class='btn hi' onclick='printRep()'>Print report</button></div></div>
 <div class='panel'><h2>SRU EduTrack · ${d.t}</h2><div class='sub' style='margin-bottom:12px'>${R.cls==='all'?'All departments':esc(R.cls)} · ${d.r.length} students · ${new Date().toLocaleDateString()}</div><div style='overflow-x:auto'><table class='tbl'><tr>${d.h.map(h=>`<th>${h}</th>`).join('')}</tr>${d.r.map(r=>`<tr>${r.map(c=>`<td class='${c==='P'?'cp':c==='A'?'ca':''}'>${esc(c)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan='${d.h.length}' class='empty'>No students in this department.</td></tr>`}</table></div></div>`}
function copyCSV(){const Q=String.fromCharCode(34),d=repData();const csv=[d.h,...d.r].map(r=>r.map(c=>Q+String(c).split(Q).join(Q+Q)+Q).join(',')).join(String.fromCharCode(10));try{navigator.clipboard.writeText(csv).then(()=>toast('CSV copied'),()=>toast('Copy is blocked in this view'))}catch(e){toast('Copy is blocked in this view')}}
function printRep(){try{window.print()}catch(e){toast('Printing is blocked in this view')}}

/* ---------- Track Results (opened from the banner) ---------- */
let tq='',tsel=0;
const pl=(c,t)=>`<span class='pill ${c}'>${t}</span>`;
const tsearch=el=>{tq=el.value;tsel=0;render();const e=$('#tqi');e.focus();e.setSelectionRange(tq.length,tq.length)};
const tview=id=>{tsel=id;render();window.scrollTo(0,0)};
const subAtt=(id,sb)=>{let p=0,t=0;Object.keys(D.att).forEach(k=>{if(k.split('|')[1]===sb&&D.att[k][id]){t++;if(D.att[k][id]==='P')p++}});return t?pct(p,t):null};
const resOf=id=>{if(avg(id)===null)return['No marks','n'];const f=SUBJ.filter(sb=>{const v=subAvg(id,sb);return v!==null&&v<40}).length;return f?['Backlog ('+f+')','bad']:['Pass','ok']};
function dots(sid){const m={};Object.keys(D.att).forEach(k=>{const v=D.att[k][sid];if(!v)return;const d=k.split('|')[0];m[d]=m[d]||{p:0,a:0};m[d][v==='P'?'p':'a']++});const days=Object.keys(m).sort().slice(-10);return `<div class='dots'>${days.map(d=>`<i class='${m[d].a>m[d].p?'x':''}' title='${d}'></i>`).join('')}<span>${fmt(attPct(sid))}</span></div>`}
function dayWise(sid){
 const dates=[...new Set(Object.keys(D.att).filter(k=>D.att[k][sid]).map(k=>k.split('|')[0]))].sort().reverse();
 const cell=(d,sb)=>D.att[d+'|'+sb]?.[sid]||'';
 const rows=dates.map(d=>`<tr><td>${new Date(d+'T00:00:00').toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'})}</td>${SUBJ.map(sb=>{const v=cell(d,sb);return `<td class='${v==='P'?'cp':v==='A'?'ca':''}'>${v||'–'}</td>`}).join('')}</tr>`).join('');
 return `<div style='overflow-x:auto'><table class='tbl'><tr><th>Date</th>${SUBJ.map(x=>`<th>${esc(x)}</th>`).join('')}</tr>${rows||`<tr><td colspan='6' class='empty'>No attendance recorded.</td></tr>`}<tr style='font-weight:800'><td>Subject %</td>${SUBJ.map(sb=>{const v=subAtt(sid,sb);return `<td class='${v!==null&&v<75?'ca':''}'>${fmt(v)}</td>`}).join('')}</tr></table></div>`}
function trk(){
 const S=D.students.filter(s=>(s.name+' '+s.roll+' '+s.email+' '+s.dept+' batch '+s.batch).toLowerCase().includes(tq.toLowerCase()));
 const bar=`<div class='head'><div><h1>Track Results</h1><div class='sub'>Search any student to see grades, marks, attendance and result.</div></div></div><div class='tools' style='margin-bottom:16px'><input id='tqi' style='flex:1;min-width:220px;font-size:16px;padding:12px 14px' placeholder='Search by name, roll no, email, department or batch' value='${esc(tq)}' oninput='tsearch(this)'></div>`;
 const s=D.students.find(x=>x.id===tsel);
 if(s){const a=avg(s.id),t=attPct(s.id),r=resOf(s.id);
  const tb=SUBJ.map(sb=>{const m=D.marks.filter(x=>x.sid===s.id&&x.subject===sb),v=mavg(m),ap=subAtt(s.id,sb);return `<tr><td><b>${esc(sb)}</b></td><td>${m.map(x=>esc(x.exam)+' '+x.score+'/'+x.max).join(' \u00b7 ')||'–'}</td><td>${fmt(v)}</td><td>${stamp(v)}</td><td class='${ap!==null&&ap<75?'ca':''}'>${fmt(ap)}</td><td>${v===null?'–':v>=40?pl('ok','Pass'):pl('bad','Fail')}</td></tr>`}).join('');
  return bar+`<button class='btn g' onclick='tsel=0;render()'>← All students</button>
  <div class='panel' style='margin-top:14px'><div style='display:flex;gap:14px;align-items:center;flex-wrap:wrap'>${av(s)}<div><h2 style='font-size:24px'>${esc(s.name)}</h2><div class='sub'>${esc(s.roll)} \u00b7 ${esc(dl(s))} \u00b7 ${esc(s.email)}</div></div><div style='margin-left:auto'>${pl(r[1],r[0])}</div></div>
  <div class='strip' style='margin:18px 0 6px'><div><div class='num'>${fmt(a)}</div><span>Overall score</span></div><div><div class='num'>${a===null?'–':grade(a)}</div><span>Grade</span></div><div><div class='num'>${fmt(t)}</div><span>${t!==null&&t<75?'Attendance shortage':'Attendance eligible'}</span></div><div><div class='num' style='font-size:24px'>${r[0]}</div><span>Result</span></div></div></div>
  <div class='panel'><h2>Marks and subject-wise results</h2><div style='overflow-x:auto;margin-top:8px'><table class='tbl'><tr><th>Subject</th><th>Marks</th><th>Average</th><th>Grade</th><th>Attendance</th><th>Result</th></tr>${tb}</table></div></div>
  <div class='panel'><h2>Day-wise attendance by subject</h2><div class='sub' style='font-size:13px;margin-bottom:10px'>P = present, A = absent. Subject % below 75 is shown in red.</div>${dayWise(s.id)}</div>`}
 const rows=S.map(s=>{const a=avg(s.id),r=resOf(s.id);return `<div class='row'>${av(s)}<div><a onclick='tview(${s.id})'>${esc(s.name)}</a><small>${esc(s.roll)} \u00b7 ${esc(s.email)}</small></div><div class='hm' style='font-size:13px;font-weight:700'>${esc(s.dept)}<small>Batch ${esc(s.batch)}</small></div><div>${stamp(a)}</div><div class='mini hm'><u><b style='width:${a||0}%'></b></u>${fmt(a)}</div><div class='hm'>${dots(s.id)}</div><div>${pl(r[1],r[0])} <button class='btn g' onclick='tview(${s.id})'>View</button></div></div>`}).join('');
 return bar+`<div class='sub' style='margin-bottom:8px'>${S.length} of ${D.students.length} students</div><div class='panel'>${rows||`<div class='empty'>No student matches your search.</div>`}</div>`}

/* ---------- Dialog, theme and start-up ---------- */
function openModal(h){$("#box").innerHTML=h;$("#modal").classList.add("on")}
function closeModal(){$("#modal").classList.remove("on")}
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#nav").addEventListener("click",e=>{const v=e.target.dataset.v;if(v)go(v)});
function setPal(p,keep){document.documentElement.dataset.pal=p;document.querySelectorAll('#pals button').forEach(b=>{const on=b.dataset.p===p;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});if(!keep){try{localStorage.setItem('edutrack-pal',p)}catch(e){}toast('Theme changed')}}
$('#pals').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setPal(b.dataset.p)});
let P0='burgundy';try{P0=localStorage.getItem('edutrack-pal')||P0}catch(e){}
if(!['burgundy','ocean','royal'].includes(P0))P0='burgundy';
setPal(P0,true);
load();render();