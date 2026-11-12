let myPass = localStorage.getItem('teacherPass') || 'teacher567';
function togglePass(){ let p=document.getElementById('pass'); let b=document.getElementById('monkeyBtn'); if(p.type==='password'){p.type='text';b.innerText='🙉';} else {p.type='password';b.innerText='🙈';} }
function login(){ let u=document.getElementById('userName').value.trim(); let p=document.getElementById('pass').value.trim(); if((u==='روماني فهيم'||u==='Romany Faheam'||u.toLowerCase()==='romany faheam') && p===myPass){ window.location.href='dashboard.html'; } else { document.getElementById('errorMsg').style.display='block'; } }
function go(page){ window.location.href=page; }
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }
function setFont(s){ document.body.className=document.body.className.replace(/font-\w+/g,''); document.body.classList.add('font-'+s); }
function setTheme(t){ if(t==='dark') document.body.classList.add('dark'); else document.body.classList.remove('dark'); localStorage.setItem('theme',t); }
if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark');
function openSettings(){ document.getElementById('settingsModal').classList.add('open'); }
function closeSettings(){ document.getElementById('settingsModal').classList.remove('open'); }
function changePass(){ let np=document.getElementById('newPass').value.trim(); if(np){ localStorage.setItem('teacherPass',np); myPass=np; alert('تم تغيير الباسورد ✅'); closeSettings(); } }
function changeImg(e){ let f=e.target.files[0]; if(!f) return; let url=URL.createObjectURL(f); let t=document.getElementById('topImg'); let s=document.getElementById('sideImg'); if(t) t.src=url; if(s) s.src=url; }
function logout(){ window.location.href='index.html'; }
let students = JSON.parse(localStorage.getItem('students')||'[]');
let totalEl=document.getElementById('totalStudents'); if(totalEl) totalEl.innerText=students.length||0;
let calDate=new Date();
function updateClock(){ let now=new Date(); let d=document.getElementById('todayDate'); if(d) d.innerText=now.toLocaleDateString('ar-EG'); let t=document.getElementById('todayTime'); if(t) t.innerText=now.toLocaleTimeString('ar-EG'); let day=document.getElementById('todayDay'); if(day) day.innerText=now.toLocaleDateString('ar-EG',{weekday:'long'}); }
setInterval(updateClock,1000); updateClock();
function toggleCalendar(){ document.getElementById('calendarBox').classList.toggle('open'); renderCal(); }
function changeMonth(n){ calDate.setMonth(calDate.getMonth()+n); renderCal(); }
function renderCal(){ let title=document.getElementById('calTitle'); if(!title) return; title.innerText=calDate.toLocaleDateString('ar-EG',{month:'long',year:'numeric'}); let grid=document.getElementById('calGrid'); grid.innerHTML=''; let y=calDate.getFullYear(), m=calDate.getMonth(); let days=new Date(y,m+1,0).getDate(); for(let i=1;i<=days;i++){ let div=document.createElement('div'); div.innerText=i; let today=new Date(); if(i===today.getDate()&&m===today.getMonth()&&y===today.getFullYear()) div.className='today'; div.onclick=()=>{ window.location.href='notes.html'; }; grid.appendChild(div); } }

// Keep - صفحة كاملة
let currentNoteId=null, currentColor='#FFF9C4', currentPinned=false;
let mediaRecorder, audioChunks=[];
function openNoteEditor(id=null){
  currentNoteId=id; document.getElementById('noteEditor').classList.add('open');
  if(id){
    let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]'); let n=notes.find(x=>x.id===id); if(!n) return;
    document.getElementById('noteTitle').value=n.title||''; document.getElementById('noteText').value=n.text||'';
    document.getElementById('noteTime').value=n.time||''; document.getElementById('noteExpire').value=n.expire||'';
    currentColor=n.color||'#FFF9C4'; currentPinned=n.pinned||false;
    document.getElementById('noteEditor').style.background=currentColor;
  } else {
    document.getElementById('noteTitle').value=''; document.getElementById('noteText').value=''; document.getElementById('noteTime').value=''; document.getElementById('noteExpire').value='';
    currentColor='#FFF9C4'; currentPinned=false; document.getElementById('noteEditor').style.background='';
    let img=document.getElementById('noteImgPreview'); if(img) img.style.display='none';
  }
}
function closeNoteEditor(){ document.getElementById('noteEditor').classList.remove('open'); document.getElementById('noteEditor').style.background=''; }
function setNoteColor(c){ currentColor=c; document.getElementById('noteEditor').style.background=c; }
function togglePin(){ currentPinned=!currentPinned; alert(currentPinned?'تم تثبيت الملاحظة 📌':'تم إلغاء التثبيت'); }
function addChecklist(){ let box=document.getElementById('checklistBox'); let div=document.createElement('div'); div.innerHTML='<input type="checkbox" style="width:20px"> <input placeholder="مهمة..." style="width:80%">'; box.appendChild(div); }
function previewNoteImg(e){ let f=e.target.files[0]; if(!f) return; let r=new FileReader(); r.onload=()=>{ let img=document.getElementById('noteImgPreview'); img.src=r.result; img.style.display='block'; }; r.readAsDataURL(f); }
function previewNoteVideo(e){ let f=e.target.files[0]; if(!f) return; let url=URL.createObjectURL(f); let v=document.getElementById('noteVideoPreview'); v.src=url; v.style.display='block'; }
async function startVoice(){ try{ let s=await navigator.mediaDevices.getUserMedia({audio:true}); mediaRecorder=new MediaRecorder(s); audioChunks=[]; mediaRecorder.ondataavailable=e=>audioChunks.push(e.data); mediaRecorder.start(); document.getElementById('voiceStatus').innerText='🎤 بيتم التسجيل...'; document.getElementById('stopVoice').style.display='inline-block'; }catch(e){ alert('المتصفح مش سامح بالتسجيل'); } }
function stopVoice(){ if(mediaRecorder) mediaRecorder.stop(); document.getElementById('voiceStatus').innerText='تم حفظ التسجيل ✅'; document.getElementById('stopVoice').style.display='none'; }
function saveKeepNoteFull(){
  let title=document.getElementById('noteTitle').value.trim();
  let text=document.getElementById('noteText').value.trim();
  let time=document.getElementById('noteTime').value;
  let expire=document.getElementById('noteExpire').value;
  let imgEl=document.getElementById('noteImgPreview'); let img=imgEl && imgEl.style.display!=='none' ? imgEl.src : '';
  if(!title && !text){ alert('اكتب حاجة الأول'); return; }
  let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]');
  if(currentNoteId){
    let n=notes.find(x=>x.id===currentNoteId); if(n){ n.title=title; n.text=text; n.time=time; n.expire=expire; n.color=currentColor; n.pinned=currentPinned; if(img) n.img=img; }
  } else {
    let note={id:Date.now(), title, text, time, expire, color:currentColor, pinned:currentPinned, img, created:new Date().toLocaleString('ar-EG'), expireAt: expire ? Date.now()+parseInt(expire)*60000 : null};
    notes.push(note);
    if(time){
      let diff=new Date(time).getTime()-Date.now();
      if(diff>0) setTimeout(()=>{ alert('🔔 منبه: '+title+' - '+text); }, diff);
    }
  }
  localStorage.setItem('keepNotes',JSON.stringify(notes));
  closeNoteEditor(); renderKeepNotes();
}
function deleteCurrentNote(){
  if(!currentNoteId){ closeNoteEditor(); return; }
  if(!confirm('تحذف الملاحظة دي؟')) return;
  let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]').filter(n=>n.id!==currentNoteId);
  localStorage.setItem('keepNotes',JSON.stringify(notes)); closeNoteEditor(); renderKeepNotes();
}
function renderKeepNotes(){
  let grid=document.getElementById('notesGrid'); if(!grid) return;
  let search=document.getElementById('searchNotes')?.value?.trim()||'';
  let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]');
  // حذف اللي انتهت صلاحيتها لوحدها
  let now=Date.now(); notes=notes.filter(n=>!n.expireAt || n.expireAt>now);
  localStorage.setItem('keepNotes',JSON.stringify(notes));
  if(search) notes=notes.filter(n=>(n.title+n.text).includes(search));
  notes.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  let empty=document.getElementById('emptyNotes'); if(empty) empty.style.display=notes.length?'none':'block';
  grid.innerHTML=notes.map(n=>`<div class="keep-card ${n.pinned?'pinned':''}" style="background:${n.color}" onclick="openNoteEditor(${n.id})">${n.pinned?'<p>📌 مثبتة</p>':''}<b>${n.title||'بدون عنوان'}</b><p>${(n.text||'').substring(0,120)}</p>${n.img?`<img src="${n.img}" style="width:100%;border-radius:16px">`:''}${n.time?`<p style="font-size:12px;color:#EA4335">⏰ ${new Date(n.time).toLocaleString('ar-EG')}</p>`:''}<small>${n.created}</small></div>`).join('');
}
renderKeepNotes();