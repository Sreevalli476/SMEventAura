import { useEffect, useState } from 'react';
export function navigate(path){ window.history.pushState({},'',path); window.dispatchEvent(new PopStateEvent('popstate')); }
export function usePath(){const [path,setPath]=useState(window.location.pathname);useEffect(()=>{const f=()=>setPath(window.location.pathname);window.addEventListener('popstate',f);return()=>window.removeEventListener('popstate',f)},[]);return path;}
export function Link({to,className='',children,...props}){return <a href={to} className={className} onClick={e=>{if(to.startsWith('/')){e.preventDefault();navigate(to)}}} {...props}>{children}</a>}
