(() => {
'use strict';
const root=document.querySelector('#productDetail');
const dataNode=document.querySelector('#productData');
if(!root||!dataNode)return;
const products=JSON.parse(dataNode.textContent);
const params=new URLSearchParams(location.search);
const requested=params.get('product');
const item=requested?products.find(p=>p.id===requested):products[0];
if(!item){document.title='Product not found | Galaxy Living Studio';root.innerHTML='<div class="detail-copy"><h1>Product not found</h1><p>We could not find that product. <a class="text-link" href="products.html">Browse all collections</a></p></div>';return;}
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const U=id=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=85`;
const bedroom=['1616594039964-ae9021a400a0','1616486338812-3dadae4b4ace','1618220179428-22790b461013','1505693416388-ac5ce068fe85'].map(U);
const windowsSet=['1618221195710-dd6b41faaea6','1600607687939-ce8a6c25118c','1616486338812-3dadae4b4ace'].map(U);
const extra=(item.category==='curtains'||item.category==='windows')?windowsSet:bedroom;
const gallery=[item.image,...extra.filter(u=>u!==item.image)].slice(0,5);
document.title=item.title+' | Galaxy Living Studio';
document.querySelector('meta[name="description"]')?.setAttribute('content',item.description);
const details=item.category==='curtains'?['Choose fabric opacity and heading style','Measure window width and finished drop','Ask about lining, stitching and installation']:item.category==='windows'?['Measure the window recess or frame','Consider light control and privacy','Confirm operating and fitting options']:item.category==='mattress'?['Compare feel, support and construction','Confirm dimensions and available sizes','Ask about trial, warranty and care terms']:['Confirm set contents and dimensions','Compare fabric feel, weave and finish','Check washing and care instructions'];
root.innerHTML=`<div class="detail-gallery"><div class="detail-main-image"><img id="detailMainImage" src="${esc(gallery[0])}" alt="${esc(item.alt)}"></div><div class="detail-thumbnails" role="group" aria-label="Choose product image">${gallery.map((src,i)=>`<button type="button" class="detail-thumb ${i===0?'is-active':''}" data-image="${esc(src)}" data-alt="${esc(i===0?item.alt:item.title+' styled in a home setting')}" aria-label="Show product view ${i+1}" aria-pressed="${i===0}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div><p class="detail-image-note">Lifestyle photographs are illustrative views; confirm the exact product and finish with the studio.</p></div><div class="detail-copy"><p class="eyebrow"><span></span> ${esc(item.category.toUpperCase())} COLLECTION</p><h1>${esc(item.title)}</h1><p class="detail-description">${esc(item.description)}</p><p>Use this page to explore the style and prepare questions. Exact materials, sizes, colours, care instructions, price and availability are confirmed by the studio when you enquire.</p><h2>What to ask about</h2><ul class="product-details">${details.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="detail-actions"><a class="button button-gold" href="products.html#enquire" id="detailEnquire">Enquire about this product <i class="fa-solid fa-arrow-right"></i></a><a class="text-link" href="products.html?category=${encodeURIComponent(item.category)}">Explore this category</a></div><p class="detail-confirm-note"><i class="fa-solid fa-circle-info"></i> Exact specifications vary by product and are confirmed by the studio when you enquire.</p></div>`;
root.querySelectorAll('.detail-thumb').forEach(btn=>btn.addEventListener('click',()=>{root.querySelectorAll('.detail-thumb').forEach(b=>{b.classList.toggle('is-active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});const main=root.querySelector('#detailMainImage');main.src=btn.dataset.image;main.alt=btn.dataset.alt;}));
root.querySelector('#detailEnquire')?.addEventListener('click',()=>{try{sessionStorage.setItem('gls-product-interest',item.interest);sessionStorage.setItem('gls-product-title',item.title);}catch{}});
})();
