// Utils (formatadores, datas, distancia) + Toast
// Dividido de script.js — carregado como <script> classico, ordem importa.

// =================== Utils ===================
const fmtBRL = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtData = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
};
const fmtDataCurta = (iso) => {
    if (!iso) return '';
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
};
const getTodayISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const isPastDate = (iso) => {
    if (!iso) return false;
    return iso < getTodayISO();
};
function setFieldError(input, msg) {
    if (!input) return;
    input.classList.toggle('is-invalid', !!msg);
    const errEl = document.getElementById(input.id + '-error');
    if (errEl) errEl.textContent = msg || '';
}
function clearFieldError(input) { setFieldError(input, ''); }
const addDays = (isoDate, days) => {
    const d = new Date(isoDate + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};
const minutosParaHHMM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h${m.toString().padStart(2, '0')}`;
};
// Distancia aproximada (km) por haversine.
const distanciaKm = (a, b) => {
    if (!a || !b) return 0;
    const toRad = (g) => g * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
};
const tempoDeslocamentoMin = (vinA, vinB) => {
    if (!vinA || !vinB || vinA.id === vinB.id) return 0;
    const km = distanciaKm(vinA, vinB);
    const min = Math.max(5, Math.round((km / 45) * 60));
    return min;
};

// =================== Toast ===================
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg, type = 'success') {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast is-visible ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

