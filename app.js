const WSP='59800000000';
let productos=[],texto='',cat='todas';
const $=s=>document.querySelector(s);
const lista=$('#lista'),buscar=$('#buscar'),categoria=$('#categoria'),panel=$('#panel'),contador=$('#contador'),items=$('#items'),total=$('#total');
function n(v){return parseFloat(String(v||'0').replace(/[^0-9.,-]/g,'').replace(',','.'))||0}
function plata(v){return '$ '+Number(v||0).toLocaleString('es-UY')}
function cart(){try{return JSON.parse(sessionStorage.getItem('carrito_catalogo')||'[]')}catch{return[]}}
function save(c){sessionStorage.setItem('carrito_catalogo',JSON.stringify(c));renderCart()}
function add(id){const p=productos.find(x=>String(x.id)===String(id));if(!p)return;const c=cart();const f=c.find(x=>String(x.id)===String(id));if(f)f.cantidad++;else c.push({id:p.id,nombre:p.nombre,precio:p.precio,imagen:p.imagen,cantidad:1});save(c);openCart()}
function qty(id,d){const c=cart().map(x=>String(x.id)===String(id)?{...x,cantidad:x.cantidad+d}:x).filter(x=>x.cantidad>0);save(c)}
function openCart(){panel.classList.add('open')}function closeCart(){panel.classList.remove('open')}
function renderCart(){const c=cart();contador.textContent=c.reduce((s,x)=>s+x.cantidad,0);total.textContent=plata(c.reduce((s,x)=>s+n(x.precio)*x.cantidad,0));items.innerHTML=c.length?c.map(x=>`<div class="item"><img src="${x.imagen||'img/productos/sin-foto.svg'}"><div><b>${x.nombre}</b><div>${x.precio}</div><div class="qty"><button onclick="qty('${x.id}',-1)">-</button><span>${x.cantidad}</span><button onclick="qty('${x.id}',1)">+</button></div></div><button onclick="qty('${x.id}',-999)">×</button></div>`).join(''):'<p>El carrito está vacío.</p>'}
function msg(){const c=cart();if(!c.length)return 'Hola, quiero consultar por productos del catálogo.';const lines=c.map(x=>`- ${x.nombre} x${x.cantidad} (${x.precio})`).join('\n');return 'Hola, quiero consultar por estos productos:%0A%0A'+encodeURIComponent(lines)+'%0A%0ATotal aproximado: '+encodeURIComponent(total.textContent)}
function wsp(){window.open(`https://wa.me/${WSP}?text=${msg()}`,'_blank')}
function cats(){const cs=[...new Set(productos.map(x=>x.categoria).filter(Boolean))].sort();categoria.innerHTML='<option value="todas">Todas las categorías</option>'+cs.map(c=>`<option>${c}</option>`).join('')}
function filtrar(){return productos.filter(x=>(x.disponible!==false)&&(`${x.nombre||''} ${x.descripcion||''} ${x.categoria||''}`.toLowerCase().includes(texto.toLowerCase()))&&(cat==='todas'||x.categoria===cat))}
function render(){const arr=filtrar();lista.innerHTML=arr.map(p=>`<article class="card"><img src="${p.imagen||'img/productos/sin-foto.svg'}"><div class="card-body"><span class="cat">${p.categoria||'Sin categoría'}</span><h3>${p.nombre}</h3><p>${p.descripcion||''}</p><span class="precio">${p.precio||'$ 0'}</span><button class="primary" onclick="add('${p.id}')">Agregar al carrito</button></div></article>`).join('')||'<p>No hay productos para mostrar.</p>'}
async function init(){try{const r=await fetch('productos.json?v='+Date.now());const d=await r.json();productos=Array.isArray(d.productos)?d.productos:[]}catch{productos=[]}cats();render();renderCart()}
buscar.oninput=e=>{texto=e.target.value;render()};categoria.onchange=e=>{cat=e.target.value;render()};$('#btnCarrito').onclick=openCart;$('#cerrar').onclick=closeCart;$('#vaciar').onclick=()=>save([]);$('#whatsapp').onclick=wsp;panel.onclick=e=>{if(e.target===panel)closeCart()};init();