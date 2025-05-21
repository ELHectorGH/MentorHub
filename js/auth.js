// Obtener Gravatar a partir del correo
function getGravatarUrl(email) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=32&d=identicon`;
}

// Monitorear el estado del usuario
firebase.auth().onAuthStateChanged((user) => {
  const navContainer = document.querySelector('.container-fluid');
  const oldButton = document.querySelector('.btn-secondary');

  if (user) {
    const email = user.email;
    const gravatarUrl = getGravatarUrl(email);
    const dropdownHTML = `
      <div class="dropdown">
        <a class="btn btn-secondary dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
          <img src="${gravatarUrl}" class="rounded-circle me-2" width="32" height="32" />
          ${email.split('@')[0]}
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="mailto:soporte@mentorhub.com">Contactar Soporte</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Cerrar sesión</a></li>
        </ul>
      </div>`;
    oldButton.outerHTML = dropdownHTML;
  } else {
    oldButton.addEventListener('click', showAuthPrompt);
  }
});

// Función de logout
function logout() {
  firebase.auth().signOut().then(() => {
    location.reload();
  });
}

// Modal básico (puedes hacer uno con Bootstrap luego)
function showAuthPrompt() {
  const email = prompt("Correo:");
  const password = prompt("Contraseña:");

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        if (confirm("¿Deseas registrarte con este correo?")) {
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(err => alert(err.message));
        }
      } else {
        alert(error.message);
      }
    });
}
