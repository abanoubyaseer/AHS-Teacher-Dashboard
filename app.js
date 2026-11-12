function togglePass(){
    let p=document.getElementById('pass');
    let b=document.getElementById('monkeyBtn');
    if(p.type==='password'){p.type='text';b.innerText='🙉';}
    else{p.type='password';b.innerText='🙈';}
  }
  function login(){
    let u=document.getElementById('userName').value.trim();
    let p=document.getElementById('pass').value.trim();
    if((u==='روماني فهيم'||u==='Romany Faheam'||u.toLowerCase()==='romany faheam') && p==='teacher567'){
      window.location.href='dashboard.html';
    } else {
      document.getElementById('errorMsg').style.display='block';
    }
  }
  function go(page){ window.location.href=page; }