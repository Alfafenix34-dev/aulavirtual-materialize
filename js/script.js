// ============================================================
//  AulaVirtual — Sistema de Gestión Escolar
//  scripts.js  |  GA5-220501095-AA1-EV04
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // ── Componentes Materialize ──────────────────────────────
  M.Sidenav.init(document.querySelectorAll('.sidenav'), { edge: 'left', draggable: true });
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  M.Modal.init(document.querySelectorAll('.modal'));
  M.FormSelect.init(document.querySelectorAll('select'));
  M.Collapsible.init(document.querySelectorAll('.collapsible'));
  M.Tabs.init(document.querySelectorAll('.tabs'));
  M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), { coverTrigger: false });
  M.Datepicker.init(document.querySelectorAll('.datepicker'), {
    format: 'dd/mm/yyyy',
    i18n: {
      months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      weekdays: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      weekdaysShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      weekdaysAbbrev: ['D','L','M','M','J','V','S'],
      cancel: 'Cancelar', done: 'Aceptar'
    }
  });

  // ── Contador animado de estadísticas ────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count);
        const sfx = el.dataset.suffix || '';
        const dur = 1800;
        let cur = 0, step = end / (dur / 16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= end) { cur = end; clearInterval(t); }
          el.textContent = Math.floor(cur).toLocaleString('es-CO') + sfx;
        }, 16);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  // ── Filtro de tarjetas (cursos/módulos) ──────────────────
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.filter;
      document.querySelectorAll('[data-cat]').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) card.style.animation = 'fadeInUp .4s ease';
      });
    });
  });

  // ── Selector de rol (login) ──────────────────────────────
  document.querySelectorAll('.role-selector-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.role-selector-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      const role = this.dataset.role;
      const roleInput = document.getElementById('selected-role');
      if (roleInput) roleInput.value = role;
      const hint = document.getElementById('role-hint');
      const hints = {
        estudiante: '📚 Accede a tus clases, tareas y calificaciones.',
        docente:    '🎓 Gestiona tus cursos, asistencia y evaluaciones.',
        admin:      '⚙️ Administra toda la institución.'
      };
      if (hint) hint.textContent = hints[role] || '';
    });
  });

  // ── Mostrar/ocultar contraseña ───────────────────────────
  document.querySelectorAll('.pw-toggle').forEach(icon => {
    icon.addEventListener('click', function () {
      const target = document.getElementById(this.dataset.target);
      if (!target) return;
      const show = target.type === 'password';
      target.type = show ? 'text' : 'password';
      this.textContent = show ? 'visibility_off' : 'visibility';
    });
  });

  // ── Indicador de fuerza de contraseña ───────────────────
  const pwInput = document.getElementById('password');
  const pwBar   = document.getElementById('pw-bar');
  const pwTxt   = document.getElementById('pw-txt');
  if (pwInput && pwBar) {
    pwInput.addEventListener('input', function () {
      const v = this.value;
      let s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/[0-9]/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      const colors = ['#EF5350','#FF9800','#FFC107','#66BB6A'];
      const labels = ['Muy débil','Débil','Regular','Segura'];
      const widths = ['25%','50%','75%','100%'];
      pwBar.style.width      = s > 0 ? widths[s-1] : '0';
      pwBar.style.background = s > 0 ? colors[s-1] : 'transparent';
      if (pwTxt) pwTxt.textContent = s > 0 ? labels[s-1] : '';
    });
  }

  // ── Validación formulario REGISTRO ──────────────────────
  const regForm = document.getElementById('form-registro');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const get = id => document.getElementById(id)?.value?.trim();
      const nombre     = get('nombre');
      const apellido   = get('apellido');
      const email      = get('email');
      const documento  = get('documento');
      const rol        = get('rol-select');
      const password   = get('password');
      const confirm    = get('confirm_password');
      const terminos   = document.getElementById('terminos')?.checked;
      let err = [];
      if (!nombre || nombre.length < 2)            err.push('Nombre inválido.');
      if (!apellido || apellido.length < 2)        err.push('Apellido inválido.');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.push('Correo inválido.');
      if (!documento || documento.length < 6)      err.push('N° de documento inválido.');
      if (!rol)                                    err.push('Selecciona un rol.');
      if (!password || password.length < 8)        err.push('Contraseña mínimo 8 caracteres.');
      if (password !== confirm)                    err.push('Las contraseñas no coinciden.');
      if (!terminos)                               err.push('Acepta los términos.');
      if (err.length) {
        M.toast({ html: '⚠️ ' + err[0], classes: 'red darken-1 rounded', displayLength: 3500 });
        return;
      }
      const btn = regForm.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.innerHTML = '<i class="material-icons left">hourglass_empty</i>Creando cuenta...';
      setTimeout(() => {
        M.toast({ html: '✅ Cuenta creada exitosamente. Redirigiendo al inicio de sesión…', classes: 'teal darken-1 rounded', displayLength: 3200 });
        setTimeout(() => { window.location.href = 'login.html'; }, 3400);
      }, 1500);
    });
  }

  // ── Validación formulario LOGIN ──────────────────────────
  const loginForm = document.getElementById('form-login');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      const pass  = document.getElementById('login-password')?.value;
      const role  = document.getElementById('selected-role')?.value || 'estudiante';
      if (!email || !pass) {
        M.toast({ html: '⚠️ Completa todos los campos.', classes: 'orange darken-2 rounded', displayLength: 3000 });
        return;
      }
      const btn = document.getElementById('btn-login');
      btn.disabled = true;
      btn.innerHTML = '<i class="material-icons left">hourglass_empty</i>Verificando…';
      setTimeout(() => {
        const destinos = { estudiante: 'index.html', docente: 'index.html', admin: 'index.html' };
        M.toast({ html: `✅ Bienvenido/a como <b>${role}</b>. Ingresando…`, classes: 'teal darken-1 rounded', displayLength: 3000 });
        setTimeout(() => { window.location.href = destinos[role] || 'index.html'; }, 3200);
      }, 1600);
    });
  }

  // ── Smooth scroll ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── Navbar sombra dinámica ───────────────────────────────
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav.av-nav');
    if (nav) nav.style.boxShadow = window.scrollY > 30
      ? '0 4px 24px rgba(13,27,110,.45)'
      : '0 2px 16px rgba(26,35,126,.35)';
  });

});
