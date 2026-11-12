let myPass = localStorage.getItem('teacherPass') || 'teacher567';
function togglePass(){
  let p=document.getElementById('pass'); let b=document.getElementById('monkeyBtn');
  if(p.type==='password'){p.type='text';b.innerText='🙉';} else {p.type='password';b.innerText='🙈';}
}
function login(){
  let u=document.getElementById('userName').value.trim();
  let p=document.getElementById('pass').value.trim();
  if((u==='روماني فهيم'||u==='Romany Faheam'||u.toLowerCase()==='romany faheam') && p===myPass){
    window.location.href='dashboard.html';
  } else { document.getElementById('errorMsg').style.display='block'; }
}
function go(page){ window.location.href=page; }
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }
function setFont(s){ document.body.className=document.body.className.replace(/font-\w+/g,''); document.body.classList.add('font-'+s); }
function setTheme(t){ if(t==='dark') document.body.classList.add('dark'); else document.body.classList.remove('dark'); }
function openSettings(){ document.getElementById('settingsModal').classList.add('open'); }
function closeSettings(){ document.getElementById('settingsModal').classList.remove('open'); }
function openNotes(){ document.getElementById('notesModal').classList.add('open'); showNotes(); }
function closeNotes(){ document.getElementById('notesModal').classList.remove('open'); }
function changePass(){ let np=document.getElementById('newPass').value.trim(); if(np){ localStorage.setItem('teacherPass',np); myPass=np; alert('تم تغيير الباسورد ✅'); closeSettings(); } }
function changeImg(e){ let f=e.target.files[0]; if(!f) return; let url=URL.createObjectURL(f); document.getElementById('sideImg').src=url; document.getElementById('topImg').src=url; }
function logout(){ window.location.href='index.html'; }
function saveNote(){ let v=document.getElementById('noteInput').value.trim(); if(!v) return; let list=JSON.parse(localStorage.getItem('notes')||'[]'); list.push(v); localStorage.setItem('notes',JSON.stringify(list)); document.getElementById('noteInput').value=''; showNotes(); }
function showNotes(){ let list=JSON.parse(localStorage.getItem('notes')||'[]'); let el=document.getElementById('notesList'); if(el) el.innerHTML=list.map(n=>'<p style="background:#FFF1E6;padding:10px;border-radius:10px">📌 '+n+'</p>').join(''); }
showNotes();