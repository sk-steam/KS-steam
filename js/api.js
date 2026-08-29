const API_BASE=(localStorage.getItem('kssteam-api')||'').replace(/\/$/,'');
const api={
  async request(path,options={}){
    const headers={...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...(options.headers||{})};
    const token=localStorage.getItem('kssteam-token'); if(token) headers.Authorization=`Bearer ${token}`;
    const r=await fetch(`${API_BASE}${path}`,{...options,headers});
    let data=null; try{data=await r.json()}catch{}
    if(!r.ok) throw new Error(data?.message||`HTTP ${r.status}`); return data;
  },
  me(){return this.request('/api/me')},
  login(email,password){return this.request('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})})},
  register(email,password,displayName){return this.request('/api/auth/register',{method:'POST',body:JSON.stringify({email,password,displayName})})},
  release(id){return this.request(`/api/releases/${encodeURIComponent(id)}`)},
  review(id,rating,body){return this.request(`/api/releases/${encodeURIComponent(id)}/reviews`,{method:'POST',body:JSON.stringify({rating,body})})},
  sync(client={}){return this.request('/api/client/sync',{method:'POST',body:JSON.stringify(client)})}
};
