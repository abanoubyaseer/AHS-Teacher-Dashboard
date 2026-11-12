let myPass = localStorage.getItem('teacherPass') || 'teacher567';
function togglePass(){ let p=document.getElementById('pass'); let b=document.getElementById('monkeyBtn'); if(p.type==='password'){p.type='text';b.innerText='🙉';} else {p.type='password';b.innerText='🙈';} }
function login(){ let u=document.getElementById('userName').value.trim(); let p=document.getElementById('pass').value.trim(); if((u==='روماني فهيم'||u==='Romany Faheam'||u.toLowerCase()==='romany faheam') && p===myPass){ window.location.href='dashboard.html'; } else { document.getElementById('errorMsg').style.display='block'; } }
function go(page){ window.location.href=page; }
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }
function setFont(s){ document.body.className=document.body.className.replace(/font-\w+/g,''); document.body.classList.add('font-'+s); }
function setTheme(t){ if(t==='dark') document.body.classList.add('dark'); else document.body.classList.remove('dark'); }
function openSettings(){ document.getElementById('settingsModal').classList.add('open'); }
function closeSettings(){ document.getElementById('settingsModal').classList.remove('open'); }
function changePass(){ let np=document.getElementById('newPass').value.trim(); if(np){ localStorage.setItem('teacherPass',np); myPass=np; alert('تم تغيير الباسورد ✅'); closeSettings(); } }
function changeImg(e){ let f=e.target.files[0]; if(!f) return; let url=URL.createObjectURL(f); let t=document.getElementById('topImg'); let s=document.getElementById('sideImg'); if(t) t.src=url; if(s) s.src=url; }
function logout(){ window.location.href='index.html'; }

// عدد الطلاب - هييجي من Supabase بعدين، دلوقتي رقم مبدئي
let students = JSON.parse(localStorage.getItem('students')||'[]');
let totalEl = document.getElementById('totalStudents'); if(totalEl) totalEl.innerText = students.length || 0;

// التقويم
let calDate = new Date();
function updateClock(){
  let now = new Date();
  let d = document.getElementById('todayDate'); if(d) d.innerText = now.toLocaleDateString('ar-EG');
  let t = document.getElementById('todayTime'); if(t) t.innerText = now.toLocaleTimeString('ar-EG');
  let day = document.getElementById('todayDay'); if(day) day.innerText = now.toLocaleDateString('ar-EG',{weekday:'long'});
}
setInterval(updateClock,1000); updateClock();
function toggleCalendar(){ document.getElementById('calendarBox').classList.toggle('open'); renderCal(); }
function changeMonth(n){ calDate.setMonth(calDate.getMonth()+n); renderCal(); }
function renderCal(){
  let title=document.getElementById('calTitle'); if(!title) return;
  title.innerText = calDate.toLocaleDateString('ar-EG',{month:'long',year:'numeric'});
  let grid=document.getElementById('calGrid'); grid.innerHTML='';
  let y=calDate.getFullYear(), m=calDate.getMonth();
  let days=new Date(y,m+1,0).getDate();
  for(let i=1;i<=days;i++){
    let div=document.createElement('div'); div.innerText=i;
    let today=new Date(); if(i===today.getDate()&&m===today.getMonth()&&y===today.getFullYear()) div.className='today';
    div.onclick=()=>{ window.location.href='notes.html'; };
    grid.appendChild(div);
  }
}

// Keep - ملاحظات
let mediaRecorder, audioChunks=[];
function openNewNote(){ document.getElementById('noteModal').classList.add('open'); }
function closeNewNote(){ document.getElementById('noteModal').classList.remove('open'); }
function previewNoteImg(e){ let f=e.target.files[0]; if(!f) return; let r=new FileReader(); r.onload=()=>{ let img=document.getElementById('noteImgPreview'); img.src=r.result; img.style.display='block'; }; r.readAsDataURL(f); }
async function startVoice(){
  try{
    let stream=await navigator.mediaDevices.getUserMedia({audio:true});
    mediaRecorder=new MediaRecorder(stream); audioChunks=[];
    mediaRecorder.ondataavailable=e=>audioChunks.push(e.data);
    mediaRecorder.start();
    document.getElementById('voiceStatus').innerText='🎤 بيتم التسجيل...';
    document.getElementById('stopVoice').style.display='block';
  }catch(e){ alert('المتصفح مش سامح بالتسجيل، جرب من Chrome'); }
}
function stopVoice(){ if(mediaRecorder) mediaRecorder.stop(); document.getElementById('voiceStatus').innerText='تم حفظ التسجيل ✅'; document.getElementById('stopVoice').style.display='none'; }
function saveKeepNote(){
  let title=document.getElementById('noteTitle').value.trim();
  let text=document.getElementById('noteText').value.trim();
  let time=document.getElementById('noteTime').value;
  let img=document.getElementById('noteImgPreview').src;
  if(!title && !text){ alert('اكتب حاجة الأول'); return; }
  let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]');
  let note={id:Date.now(), title, text, time, img: img && img.startsWith('data') ? img : '', created:new Date().toLocaleString('ar-EG')};
  notes.push(note); localStorage.setItem('keepNotes',JSON.stringify(notes));
  if(time){
    let diff=new Date(time).getTime()-Date.now();
    if(diff>0){
      setTimeout(()=>{ alert('🔔 منبه: '+title+' - '+text); new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg').play().catch(()=>{}); }, diff);
    }
    if(Notification.permission!=='granted') Notification.requestPermission();
  }
  alert('تم حفظ الملاحظة ✅'); closeNewNote(); renderKeepNotes();
}
function renderKeepNotes(){
  let grid=document.getElementById('notesGrid'); if(!grid) return;
  let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]');
  if(notes.length===0){ grid.innerHTML='<p>لسه مفيش ملاحظات، دوس + واعمل أول ملاحظة</p>'; return; }
  grid.innerHTML=notes.map(n=>`
    <div class="keep-card">
      <b>${n.title||'بدون عنوان'}</b>
      <p>${n.text||''}</p>
      ${n.img?`<img src="${n.img}" style="width:100%;border-radius:10px">`:''}
      ${n.time?`<p style="font-size:12px;color:#EA4335">⏰ منبه: ${new Date(n.time).toLocaleString('ar-EG')}</p>`:''}
      <small>${n.created}</small><br>
      <button onclick="deleteKeepNote(${n.id})" style="background:none;border:none;cursor:pointer">🗑️ حذف</button>
    </div>`).join('');
}
function deleteKeepNote(id){ let notes=JSON.parse(localStorage.getItem('keepNotes')||'[]').filter(n=>n.id!==id); localStorage.setItem('keepNotes',JSON.stringify(notes)); renderKeepNotes(); }
renderKeepNotes();