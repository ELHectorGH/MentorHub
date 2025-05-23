function getGravatarUrl(email) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=32&d=identicon`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Detecta si hay usuario logueado
  firebase.auth().onAuthStateChanged((user) => {
    const navContainer = document.querySelector('.container-fluid');
    const oldButton = document.querySelector('.btn-secondary');

    if (user && navContainer && oldButton) {
      const email = user.email;
      const gravatarUrl = getGravatarUrl(email);
      const dropdownHTML = `
        <div class="dropdown">
          <a class="btn btn-secondary dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
            <img src="${gravatarUrl}" class="rounded-circle me-2" width="32" height="32" />
            ${email.split('@')[0]}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="mailto:support@mentorhub.store">Contactar Soporte</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logout()">Cerrar sesión</a></li>
          </ul>
        </div>`;
      oldButton.outerHTML = dropdownHTML;
    }
  });

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => bootstrap.Modal.getInstance(document.getElementById('authModal')).hide())
        .catch(err => alert("Error al iniciar sesión: " + err.message));
    });
  }

  // Register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => bootstrap.Modal.getInstance(document.getElementById('authModal')).hide())
        .catch(err => alert("Error al registrar: " + err.message));
    });
  }
});

// Logout global
function logout() {
  firebase.auth().signOut().then(() => location.reload());
}
