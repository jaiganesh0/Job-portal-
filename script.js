// Online job portal - vanilla JS. Saved and applied jobs persist in localStorage.
const JOBS = [
 {id:1,t:'Frontend Developer',co:'Nimbus Tech',loc:'Chennai',ty:'Full-time',sal:'Rs. 6-9 LPA',sk:['HTML','CSS','JavaScript']},
 {id:2,t:'Cloud Support Engineer',co:'Skyline Systems',loc:'Bengaluru',ty:'Full-time',sal:'Rs. 5-8 LPA',sk:['Linux','Networking','AWS']},
 {id:3,t:'Java Developer Intern',co:'CodeCraft Labs',loc:'Remote',ty:'Internship',sal:'Rs. 15k per month',sk:['Java','SQL','Git']},
 {id:4,t:'DevOps Engineer',co:'Orbit Cloud',loc:'Hyderabad',ty:'Full-time',sal:'Rs. 8-12 LPA',sk:['Docker','CI/CD','Linux']},
 {id:5,t:'Web Developer (Part-time)',co:'BrightEvents',loc:'Tirunelveli',ty:'Part-time',sal:'Rs. 20k per month',sk:['HTML','JavaScript','Design']},
 {id:6,t:'Network Administrator',co:'Gridline Networks',loc:'Chennai',ty:'Full-time',sal:'Rs. 4-6 LPA',sk:['Routing','Firewalls','Windows Server']}];
const load = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
let saved = load('jc-saved'), applied = load('jc-applied'), current = null, savedOnly = false;
const store = () => { try { localStorage.setItem('jc-saved', JSON.stringify(saved)); localStorage.setItem('jc-applied', JSON.stringify(applied)); } catch {} };
const $ = id => document.getElementById(id), esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const opts = (id, label, vals) => $(id).innerHTML = [`All ${label}`, ...vals].map(v => `<option>${v}</option>`).join('');
opts('loc', 'locations', [...new Set(JOBS.map(j => j.loc))].sort()); opts('type', 'types', [...new Set(JOBS.map(j => j.ty))]);

function render() {
  const q = $('q').value.toLowerCase(), loc = $('loc').value, ty = $('type').value;
  const list = JOBS.filter(j => (loc.startsWith('All') || j.loc === loc) && (ty.startsWith('All') || j.ty === ty) && (!savedOnly || saved.includes(j.id))
    && [j.t, j.co, ...j.sk].join(' ').toLowerCase().includes(q));
  $('count').textContent = `${list.length} job${list.length === 1 ? '' : 's'} found`;
  $('jobs').innerHTML = list.map(j => `<article class="job"><h2>${esc(j.t)}</h2><p class="meta">${j.co} · ${j.loc} · ${j.ty}</p>
    <ul class="skills">${j.sk.map(s => `<li>${s}</li>`).join('')}</ul><div class="row"><span class="sal">${j.sal}</span>
    <button class="ghost save" data-id="${j.id}" aria-pressed="${saved.includes(j.id)}">${saved.includes(j.id) ? 'Saved' : 'Save'}</button>
    <button class="primary apply" data-id="${j.id}" ${applied.includes(j.id) ? 'disabled' : ''}>${applied.includes(j.id) ? 'Applied' : 'Apply now'}</button></div></article>`).join('')
    || '<p>No jobs match your filters. Try clearing the search.</p>';
}
['q', 'loc', 'type'].forEach(id => $(id).addEventListener('input', render));
$('savedOnly').onclick = e => { savedOnly = !savedOnly; e.target.setAttribute('aria-pressed', savedOnly); render(); };
$('jobs').onclick = e => {
  const b = e.target.closest('button'); if (!b) return; const id = +b.dataset.id;
  if (b.classList.contains('save')) { saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; store(); render(); }
  if (b.classList.contains('apply')) { current = JOBS.find(j => j.id === id); $('dt').textContent = `Apply: ${current.t}`; $('dlg').showModal(); }
};
$('cancel').onclick = () => $('dlg').close();
$('apply').onsubmit = () => { applied.push(current.id); store(); $('apply').reset(); render(); };
render();
