// UI de autenticacao: widget no header + modal login/cadastro + troca de senha
// forcada. Carregado APOS api-client.js, escuta UvaViaApi.onAuthChange.

(function () {
    if (!window.UvaViaApi) {
        console.error('[auth-ui] UvaViaApi nao encontrado. Carregue api-client.js antes.');
        return;
    }

    // -------- estilos
    const css = `
/* Lock global: enquanto nao houver sessao valida, esconde tudo exceto o modal. */
body.auth-locked > *:not(.auth-overlay) { display: none !important; }
body.auth-locked { overflow: hidden; background: var(--vinho); }
body.auth-locked .auth-overlay { background: linear-gradient(135deg, var(--vinho) 0%, #2a0612 100%); }
body.auth-locked .auth-modal-foot { background: rgba(245,236,217,.6); }
.auth-modal--locked .auth-close { display: none !important; }

.nav-user {
    display: flex; align-items: center; gap: .5rem;
    margin-left: auto; position: relative;
    flex-shrink: 0;
}
.nav-user .btn-entrar {
    background: rgba(255,255,255,.15); color: var(--branco);
    border: 1.5px solid rgba(255,255,255,.4);
    padding: .5rem 1.1rem; border-radius: 999px; font: inherit; font-weight: 600;
    font-size: .88rem; cursor: pointer;
    transition: all var(--t-fast); display: inline-flex; align-items: center; gap: .45rem;
}
.nav-user .btn-entrar:hover { background: rgba(255,255,255,.25); border-color: var(--branco); }
.nav-user .user-chip {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--branco); color: var(--vinho);
    border: 1.5px solid rgba(255,255,255,.55);
    cursor: pointer; display: grid; place-items: center;
    font: inherit; font-weight: 700; font-size: 1rem;
    transition: all var(--t-fast); padding: 0;
}
.nav-user .user-chip:hover { transform: scale(1.05); border-color: var(--branco); box-shadow: 0 0 0 3px rgba(255,255,255,.18); }
.nav-user .user-chip.is-open { box-shadow: 0 0 0 3px rgba(255,255,255,.3); }

.user-menu {
    position: absolute; top: calc(100% + .65rem); right: 0;
    background: var(--branco); border: 1px solid var(--borda);
    border-radius: 14px; box-shadow: var(--shadow-md);
    min-width: 260px; z-index: 60;
    display: none; overflow: hidden;
    animation: user-menu-pop var(--t-fast);
}
.user-menu.is-open { display: block; }
@keyframes user-menu-pop { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }
.user-menu-head {
    padding: .9rem 1rem; background: linear-gradient(135deg, rgba(74,13,31,.04), rgba(107,122,58,.04));
    border-bottom: 1px solid var(--borda);
}
.user-menu-name { font-weight: 700; font-size: 1rem; color: var(--vinho); display: block; }
.user-menu-role {
    display: inline-block; margin-top: .35rem; padding: .15rem .55rem;
    background: var(--oliva); color: var(--branco); border-radius: 999px;
    font-size: .68rem; text-transform: uppercase; letter-spacing: .06em; font-weight: 600;
}
.user-menu-role.role-supremo { background: var(--vinho); }
.user-menu-role.role-vinicola { background: var(--oliva); }
.user-menu-role.role-usuario { background: var(--bege-escuro); color: var(--texto); }
.user-menu-email { font-size: .82rem; color: rgba(44,26,31,.65); display: block; margin-top: .35rem; word-break: break-all; }
.user-menu-actions { padding: .35rem; }
.user-menu button.menu-item {
    width: 100%; text-align: left; padding: .65rem .85rem; border: 0;
    background: transparent; cursor: pointer; border-radius: 10px;
    font: inherit; color: var(--texto); display: flex; align-items: center; gap: .6rem;
    font-size: .92rem;
}
.user-menu button.menu-item:hover { background: rgba(74,13,31,.06); }
.user-menu button.menu-item i { width: 16px; color: var(--vinho-claro); }
.user-menu button.menu-item.danger { color: var(--status-cheio); }
.user-menu button.menu-item.danger i { color: var(--status-cheio); }

.auth-overlay {
    position: fixed; inset: 0; background: rgba(44,26,31,.55);
    display: none; align-items: center; justify-content: center;
    z-index: 100; padding: 1rem;
}
.auth-overlay.is-open { display: flex; }
.auth-modal {
    background: var(--branco); border-radius: 20px; box-shadow: var(--shadow-lg);
    width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto;
    animation: auth-pop var(--t-base);
}
@keyframes auth-pop { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
.auth-modal-head { padding: 1.5rem 1.5rem .5rem; }
.auth-modal-head h2 { font-family: var(--font-serif); font-size: 1.7rem; color: var(--vinho); }
.auth-modal-head p { color: rgba(44,26,31,.7); font-size: .95rem; margin-top: .2rem; }
.auth-tabs { display: flex; gap: .25rem; padding: 0 1.5rem; margin: 1rem 0 .5rem; }
.auth-tabs button {
    flex: 1; padding: .65rem 0; border: 0; background: transparent;
    font: inherit; font-weight: 600; cursor: pointer; color: rgba(44,26,31,.5);
    border-bottom: 2px solid transparent; transition: all var(--t-fast);
}
.auth-tabs button.is-active { color: var(--vinho); border-bottom-color: var(--vinho); }
.auth-form { padding: 1rem 1.5rem 1.5rem; display: none; }
.auth-form.is-active { display: block; }
.auth-form label { display: block; font-size: .85rem; font-weight: 600; color: var(--texto); margin-top: .8rem; }
.auth-form input {
    width: 100%; padding: .7rem .9rem; margin-top: .3rem;
    border: 1px solid var(--borda); border-radius: 10px; font: inherit;
    background: var(--branco); color: var(--texto);
}
.auth-form input:focus { outline: 2px solid var(--vinho-glow); border-color: var(--vinho); }
.auth-form .auth-error { color: var(--status-cheio); font-size: .85rem; margin-top: .7rem; min-height: 1.1em; }
.auth-form .auth-actions { display: flex; gap: .6rem; margin-top: 1.2rem; align-items: center; }
.auth-form .auth-actions .btn { flex: 1; justify-content: center; }
.auth-form .auth-link {
    display: inline-block; margin-top: .9rem; font-size: .85rem;
    color: var(--vinho); text-decoration: none; cursor: pointer;
    background: none; border: 0; padding: 0; font-family: inherit;
}
.auth-form .auth-link:hover { text-decoration: underline; }
.auth-notice {
    background: rgba(201,142,62,.15); color: #6b4d1a;
    padding: .7rem .9rem; border-radius: 10px; font-size: .82rem;
    margin-top: .8rem; border-left: 3px solid #c98e3e;
}
.auth-token-display {
    background: var(--bege); border: 1px dashed var(--vinho-claro);
    padding: .7rem; border-radius: 10px; margin-top: .8rem;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    font-size: .8rem; word-break: break-all; color: var(--texto);
    position: relative;
}
.auth-token-display button {
    position: absolute; top: .4rem; right: .4rem;
    background: var(--vinho); color: var(--branco); border: 0;
    padding: .2rem .55rem; border-radius: 6px; font-size: .7rem;
    cursor: pointer; font-weight: 600;
}
.auth-modal-foot {
    border-top: 1px solid var(--borda); padding: .9rem 1.5rem;
    font-size: .82rem; color: rgba(44,26,31,.6); background: rgba(245,236,217,.4);
    border-radius: 0 0 20px 20px;
}
.auth-close {
    position: absolute; top: 1rem; right: 1rem; background: rgba(74,13,31,.08);
    border: 0; width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
    font-size: 1.3rem; color: var(--vinho);
}
.auth-modal { position: relative; }
@media (max-width: 600px) {
    .user-menu { right: -.5rem; min-width: 240px; }
}
`;
    const style = document.createElement('style');
    style.id = 'uvaevia-auth-styles';
    style.textContent = css;
    document.head.appendChild(style);

    // -------- widget de usuario no header
    const navInner = document.querySelector('.nav-inner');
    const navMenu = document.getElementById('nav-menu');
    const navUser = document.createElement('div');
    navUser.className = 'nav-user';
    navInner.appendChild(navUser);

    // -------- modal
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.innerHTML = `
        <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button class="auth-close" type="button" aria-label="Fechar">&times;</button>
            <div class="auth-modal-head">
                <h2 id="auth-title">Bem-vindo</h2>
                <p>Entre ou crie sua conta para reservar experiências e salvar roteiros.</p>
            </div>
            <div class="auth-tabs" role="tablist">
                <button type="button" class="is-active" data-tab="login" role="tab">Entrar</button>
                <button type="button" data-tab="register" role="tab">Criar conta</button>
            </div>
            <form class="auth-form is-active" data-form="login" novalidate>
                <label for="auth-login-email">Email</label>
                <input id="auth-login-email" type="email" autocomplete="email" required>
                <label for="auth-login-senha">Senha</label>
                <input id="auth-login-senha" type="password" autocomplete="current-password" required>
                <p class="auth-error" data-error aria-live="polite"></p>
                <div class="auth-actions">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                </div>
                <button type="button" class="auth-link" data-go="forgot">Esqueci minha senha</button>
            </form>
            <form class="auth-form" data-form="forgot" novalidate>
                <p style="color: rgba(44,26,31,.7); font-size:.9rem; margin-bottom:.3rem;">
                    Digite o email da sua conta. Vamos gerar um token de recuperação válido por 1 hora.
                </p>
                <label for="auth-fp-email">Email</label>
                <input id="auth-fp-email" type="email" autocomplete="email" required>
                <p class="auth-error" data-error aria-live="polite"></p>
                <div class="auth-actions">
                    <button type="submit" class="btn btn-primary">Gerar token</button>
                </div>
                <button type="button" class="auth-link" data-go="login">&larr; Voltar ao login</button>
            </form>
            <form class="auth-form" data-form="reset" novalidate>
                <p style="color: rgba(44,26,31,.7); font-size:.9rem; margin-bottom:.3rem;">
                    Cole o token recebido e defina uma nova senha (mínimo 8 caracteres).
                </p>
                <label for="auth-rp-token">Token</label>
                <input id="auth-rp-token" type="text" autocomplete="one-time-code" required spellcheck="false">
                <label for="auth-rp-senha">Nova senha</label>
                <input id="auth-rp-senha" type="password" autocomplete="new-password" minlength="8" required>
                <p class="auth-error" data-error aria-live="polite"></p>
                <div class="auth-actions">
                    <button type="submit" class="btn btn-primary">Redefinir senha</button>
                </div>
                <button type="button" class="auth-link" data-go="login">&larr; Voltar ao login</button>
            </form>
            <form class="auth-form" data-form="register" novalidate>
                <label for="auth-reg-nome">Nome completo</label>
                <input id="auth-reg-nome" type="text" autocomplete="name" required>
                <label for="auth-reg-email">Email</label>
                <input id="auth-reg-email" type="email" autocomplete="email" required>
                <label for="auth-reg-telefone">Telefone (opcional)</label>
                <input id="auth-reg-telefone" type="tel" autocomplete="tel">
                <label for="auth-reg-senha">Senha (mínimo 8 caracteres)</label>
                <input id="auth-reg-senha" type="password" autocomplete="new-password" minlength="8" required>
                <p class="auth-error" data-error aria-live="polite"></p>
                <div class="auth-actions">
                    <button type="submit" class="btn btn-primary">Criar conta</button>
                </div>
            </form>
            <form class="auth-form" data-form="change-password" novalidate>
                <p data-first-session style="background: rgba(201,142,62,.15); color: #6b4d1a; padding:.7rem; border-radius:10px; font-size:.85rem;">
                    Esta é sua primeira sessão. Defina uma nova senha para continuar.
                </p>
                <label for="auth-cp-atual">Senha atual</label>
                <input id="auth-cp-atual" type="password" autocomplete="current-password" required>
                <label for="auth-cp-nova">Nova senha (mínimo 8 caracteres)</label>
                <input id="auth-cp-nova" type="password" autocomplete="new-password" minlength="8" required>
                <p class="auth-error" data-error aria-live="polite"></p>
                <div class="auth-actions">
                    <button type="submit" class="btn btn-primary">Atualizar senha</button>
                </div>
            </form>
            <div class="auth-modal-foot">
                Suas reservas e roteiros ficam vinculados à conta — você pode acessá-los de qualquer dispositivo.
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const modal = overlay.querySelector('.auth-modal');
    const tabBtns = overlay.querySelectorAll('.auth-tabs button');
    const forms = overlay.querySelectorAll('.auth-form');

    // Locked: modal nao fecha (sem X, ESC ou clique fora). Usado quando o
    // sistema inteiro esta gated atras do login ou exige troca de senha.
    let locked = true;
    document.body.classList.add('auth-locked');

    function setLocked(value) {
        locked = !!value;
        modal.classList.toggle('auth-modal--locked', locked);
        document.body.classList.toggle('auth-locked', locked);
    }

    function openModal(tab = 'login') {
        overlay.classList.add('is-open');
        switchTab(tab);
        setTimeout(() => modal.querySelector('.auth-form.is-active input:not([type=hidden])')?.focus(), 50);
    }
    function closeModal(force = false) {
        if (locked && !force) return;
        overlay.classList.remove('is-open');
        forms.forEach(f => f.reset());
        forms.forEach(f => f.querySelector('[data-error]').textContent = '');
    }
    function switchTab(tab) {
        tabBtns.forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
        forms.forEach(f => f.classList.toggle('is-active', f.dataset.form === tab));
        const title = modal.querySelector('#auth-title');
        const head = modal.querySelector('.auth-modal-head p');
        const tabsBar = modal.querySelector('.auth-tabs');

        const titulos = {
            login:             ['Bem-vindo de volta',  'Entre para acessar suas reservas e roteiros.'],
            register:          ['Crie sua conta',       'Em segundos você tem acesso a tudo.'],
            'change-password': ['Atualize sua senha',   'Por segurança, defina uma nova senha antes de continuar.'],
            forgot:            ['Recuperar senha',      'Não se preocupa — vamos gerar um token de recuperação.'],
            reset:             ['Redefinir senha',      'Use o token gerado para criar uma nova senha.'],
        };
        const [t, p] = titulos[tab] || titulos.login;
        title.textContent = t;
        head.textContent = p;
        // Tabs Entrar/Criar conta so aparecem nas duas primeiras telas.
        tabsBar.style.display = (tab === 'login' || tab === 'register') ? '' : 'none';
    }

    // Links internos entre forms (Esqueci minha senha / Voltar ao login).
    overlay.addEventListener('click', (e) => {
        const link = e.target.closest('[data-go]');
        if (!link) return;
        e.preventDefault();
        switchTab(link.dataset.go);
        setTimeout(() => modal.querySelector('.auth-form.is-active input:not([type=hidden])')?.focus(), 50);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    overlay.querySelector('.auth-close').addEventListener('click', () => closeModal());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
    tabBtns.forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

    // -------- helpers de formulario
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function emailValido(email) {
        return !!email && EMAIL_RE.test(email);
    }

    // Desabilita o submit e troca o rotulo enquanto fn() roda.
    async function withLoading(form, label, fn) {
        const btn = form.querySelector('button[type="submit"]');
        const original = btn ? btn.textContent : '';
        if (btn) {
            btn.disabled = true;
            btn.textContent = label;
        }
        try {
            await fn();
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = original;
            }
        }
    }

    // Aviso "primeira sessao" do form de troca de senha: aparece apenas
    // quando a troca e forcada (must_change_password), nao na voluntaria.
    function setFirstSessionNotice(forcada) {
        const aviso = overlay.querySelector('[data-form="change-password"] [data-first-session]');
        if (aviso) aviso.hidden = !forcada;
    }

    // -------- submit handlers
    overlay.querySelector('[data-form="login"]').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const err = form.querySelector('[data-error]');
        err.textContent = '';
        const email = document.getElementById('auth-login-email').value.trim();
        const senha = document.getElementById('auth-login-senha').value;
        if (!emailValido(email)) { err.textContent = 'Informe um email válido.'; return; }
        if (!senha) { err.textContent = 'Informe sua senha.'; return; }
        await withLoading(form, 'Entrando…', async () => {
            try {
                const user = await UvaViaApi.login(email, senha);
                if (user?.must_change_password) {
                    setFirstSessionNotice(true);
                    switchTab('change-password');
                    // permanece travado ate trocar senha
                } else {
                    setLocked(false);
                    closeModal(true);
                    window.showToast?.(`Bem-vindo, ${user.nome_completo.split(' ')[0]}!`);
                }
            } catch (ex) {
                err.textContent = ex.message || 'Erro ao entrar';
            }
        });
    });

    overlay.querySelector('[data-form="register"]').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const err = form.querySelector('[data-error]');
        err.textContent = '';
        const nome = document.getElementById('auth-reg-nome').value.trim();
        const email = document.getElementById('auth-reg-email').value.trim();
        const telefone = document.getElementById('auth-reg-telefone').value.trim();
        const senha = document.getElementById('auth-reg-senha').value;
        if (nome.length < 3) { err.textContent = 'O nome precisa de pelo menos 3 caracteres.'; return; }
        if (!emailValido(email)) { err.textContent = 'Informe um email válido.'; return; }
        if (senha.length < 8) { err.textContent = 'A senha precisa de pelo menos 8 caracteres.'; return; }
        await withLoading(form, 'Criando…', async () => {
            try {
                const user = await UvaViaApi.register({
                    nome_completo: nome,
                    email,
                    telefone,
                    senha,
                });
                setLocked(false);
                closeModal(true);
                window.showToast?.(`Conta criada. Bem-vindo, ${user.nome_completo.split(' ')[0]}!`);
            } catch (ex) {
                err.textContent = ex.message || 'Erro ao cadastrar';
            }
        });
    });

    overlay.querySelector('[data-form="forgot"]').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const err = form.querySelector('[data-error]');
        err.textContent = '';
        // Remove notices anteriores antes de processar de novo.
        form.querySelectorAll('.auth-notice').forEach(el => el.remove());
        const email = document.getElementById('auth-fp-email').value.trim();
        if (!emailValido(email)) { err.textContent = 'Informe um email válido.'; return; }
        await withLoading(form, 'Gerando…', async () => {
            try {
                const r = await UvaViaApi.forgotPassword(email);
                if (!r.token) {
                    // Mensagem neutra (nao e erro): notice ambar dentro do form.
                    const aviso = document.createElement('p');
                    aviso.className = 'auth-notice';
                    aviso.textContent = 'Se o email existir, geramos um token. Cheque com o administrador.';
                    form.insertBefore(aviso, err);
                    return;
                }
                // Pre-popula o form de reset com o token + mostra aviso de dev.
                switchTab('reset');
                const resetForm = overlay.querySelector('[data-form="reset"]');
                const tokenField = resetForm.querySelector('#auth-rp-token');
                tokenField.value = r.token;

                // Notice + token display antes do campo (uma vez por sessao).
                resetForm.querySelectorAll('.auth-notice, .auth-token-display').forEach(el => el.remove());
                const notice = document.createElement('div');
                notice.className = 'auth-notice';
                notice.innerHTML = `<strong>Modo desenvolvimento:</strong> em produção, este token iria por email. Aqui mostramos direto. Válido por ${r.ttl_minutos || 60} minutos.`;
                const display = document.createElement('div');
                display.className = 'auth-token-display';
                display.innerHTML = `<span data-token>${r.token}</span><button type="button" data-copy>Copiar</button>`;
                display.querySelector('[data-copy]').addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(r.token);
                        display.querySelector('[data-copy]').textContent = 'Copiado!';
                        setTimeout(() => display.querySelector('[data-copy]').textContent = 'Copiar', 1500);
                    } catch {}
                });
                tokenField.parentNode.insertBefore(notice, tokenField.previousElementSibling);
                tokenField.parentNode.insertBefore(display, tokenField.previousElementSibling);
                setTimeout(() => resetForm.querySelector('#auth-rp-senha').focus(), 50);
            } catch (ex) {
                err.textContent = ex.message || 'Erro ao gerar token';
            }
        });
    });

    overlay.querySelector('[data-form="reset"]').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const err = form.querySelector('[data-error]');
        err.textContent = '';
        const token = document.getElementById('auth-rp-token').value.trim();
        const senha = document.getElementById('auth-rp-senha').value;
        if (!token) { err.textContent = 'Informe o token de recuperação.'; return; }
        if (senha.length < 8) { err.textContent = 'A senha precisa de pelo menos 8 caracteres.'; return; }
        await withLoading(form, 'Redefinindo…', async () => {
            try {
                await UvaViaApi.resetPassword(token, senha);
                // Limpa notice/display do dev mode antes de voltar pro login.
                form.querySelectorAll('.auth-notice, .auth-token-display').forEach(el => el.remove());
                switchTab('login');
                window.showToast?.('Senha redefinida. Entre com a nova senha.');
            } catch (ex) {
                err.textContent = ex.message || 'Erro ao redefinir senha';
            }
        });
    });

    overlay.querySelector('[data-form="change-password"]').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const err = form.querySelector('[data-error]');
        err.textContent = '';
        const atual = document.getElementById('auth-cp-atual').value;
        const nova = document.getElementById('auth-cp-nova').value;
        if (!atual) { err.textContent = 'Informe a senha atual.'; return; }
        if (nova.length < 8) { err.textContent = 'A senha precisa de pelo menos 8 caracteres.'; return; }
        await withLoading(form, 'Atualizando…', async () => {
            try {
                await UvaViaApi.changePassword(atual, nova);
                await UvaViaApi.refreshSession();
                setLocked(false);
                closeModal(true);
                window.showToast?.('Senha atualizada.');
            } catch (ex) {
                err.textContent = ex.message || 'Erro ao trocar senha';
            }
        });
    });

    // -------- render do widget
    function roleLabel(role) {
        return { adm_supremo: 'Admin supremo', adm_vinicola: 'Admin vinícola', usuario: 'Membro' }[role] || role;
    }
    function roleClass(role) {
        return { adm_supremo: 'role-supremo', adm_vinicola: 'role-vinicola', usuario: 'role-usuario' }[role] || '';
    }
    function renderWidget(user) {
        navUser.innerHTML = '';
        if (!user) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-entrar';
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Entrar';
            btn.addEventListener('click', () => openModal('login'));
            navUser.appendChild(btn);
            return;
        }

        const initial = (user.nome_completo || user.email || '?').trim()[0].toUpperCase();
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'user-chip';
        chip.setAttribute('aria-label', `Conta de ${user.nome_completo}`);
        chip.title = user.nome_completo;
        chip.textContent = initial;

        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.innerHTML = `
            <div class="user-menu-head">
                <span class="user-menu-name">${user.nome_completo}</span>
                <span class="user-menu-role ${roleClass(user.role)}">${roleLabel(user.role)}</span>
                <span class="user-menu-email">${user.email}</span>
            </div>
            <div class="user-menu-actions">
                <button type="button" class="menu-item" data-action="change-pw">
                    <i class="fa-solid fa-key" aria-hidden="true"></i> Trocar senha
                </button>
                <button type="button" class="menu-item danger" data-action="logout">
                    <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Sair
                </button>
            </div>
        `;
        navUser.append(chip, menu);

        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = menu.classList.toggle('is-open');
            chip.classList.toggle('is-open', open);
        });
        document.addEventListener('click', () => {
            menu.classList.remove('is-open');
            chip.classList.remove('is-open');
        });
        menu.addEventListener('click', (e) => e.stopPropagation());
        menu.querySelector('[data-action="logout"]').addEventListener('click', async () => {
            menu.classList.remove('is-open');
            try {
                await UvaViaApi.logout();
                window.showToast?.('Sessão encerrada.');
            } catch (ex) {
                window.showToast?.(ex.message || 'Erro ao encerrar a sessão.', 'error');
            }
        });
        menu.querySelector('[data-action="change-pw"]').addEventListener('click', () => {
            menu.classList.remove('is-open');
            chip.classList.remove('is-open');
            // Troca voluntaria: sem o aviso de primeira sessao.
            setFirstSessionNotice(false);
            openModal('change-password');
        });
    }

    // -------- visibilidade por papel
    // Tres niveis: visitante/usuario nao ve gestao; adm_vinicola ve gestao sem
    // as abas globais (vinicolas/usuarios); adm_supremo ve tudo.
    function applyRoleVisibility(user) {
        const role = user?.role || null;
        const isAdmin = role === 'adm_supremo' || role === 'adm_vinicola';
        const isSupremo = role === 'adm_supremo';

        // Links de gestao: nav, footer e o link [data-gestao-link] do #nav-menu.
        document.querySelectorAll('a[href="#gestao"], #nav-menu [data-gestao-link]')
            .forEach(a => { a.hidden = !isAdmin; });
        const gestaoSection = document.getElementById('gestao');
        if (gestaoSection) gestaoSection.hidden = !isAdmin;

        // Subtabs restritas ao admin supremo (elementos de "usuarios" podem
        // ainda nao existir no DOM). Os paineis nao sao reexibidos aqui: o
        // hidden deles tambem e controlado pelo clique nas subtabs (gestao.js).
        ['vinicolas', 'usuarios'].forEach(nome => {
            const btn = document.querySelector(`.manage-subtab[data-subtab="${nome}"]`);
            const painel = document.querySelector(`[data-subtab-panel="${nome}"]`);
            if (btn) btn.hidden = !isSupremo;
            if (painel && !isSupremo) painel.hidden = true;
        });

        if (!isAdmin) return;

        // Se a subtab ativa ficou oculta, volta para "horarios".
        const ativa = document.querySelector('.manage-subtab.is-active');
        if (ativa?.hidden) {
            document.querySelector('.manage-subtab[data-subtab="horarios"]')?.click();
        }

        window.applyVinicolaScope?.(user);
        if (isSupremo) window.renderUsuariosPanel?.();
    }

    // -------- liga eventos globais
    UvaViaApi.onAuthChange((user) => {
        renderWidget(user);
        applyRoleVisibility(user);

        if (!user) {
            // Sessao perdida ou logout: re-trava tudo.
            setLocked(true);
            openModal('login');
        } else if (user.must_change_password) {
            setLocked(true);
            setFirstSessionNotice(true);
            openModal('change-password');
        } else {
            setLocked(false);
            closeModal(true);
        }
    });

    document.addEventListener('uvaevia:require-login', (e) => {
        window.showToast?.(e.detail?.motivo || 'É necessário fazer login para continuar.', 'error');
        openModal('login');
    });

    // Estado inicial: travado ate o primeiro refreshSession resolver.
    renderWidget(null);
    applyRoleVisibility(null);
    openModal('login');

    window.UvaViaAuthUI = { open: openModal, close: () => closeModal(true), lock: () => setLocked(true), unlock: () => setLocked(false) };
})();
