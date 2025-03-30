document.addEventListener('DOMContentLoaded', function () {
  const ageGate = document.getElementById('age-gate');
  const confirmBtn = document.getElementById('confirm-age');
  const denyBtn = document.getElementById('deny-age');

  // Mostra o popup apenas se nunca foi visto antes
  if (!localStorage.getItem('agePopupShown')) {
    if (ageGate) ageGate.style.display = 'flex';
  }

  // Configura botões (agora ambos fecham o popup)
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      localStorage.setItem('agePopupShown', 'true');
      if (ageGate) ageGate.style.display = 'none';
    });
  }

  if (denyBtn) {
    denyBtn.addEventListener('click', function () {
      localStorage.setItem('agePopupShown', 'true');
      if (ageGate) ageGate.style.display = 'none';
      // Não redireciona mais para o Google
    });
  }
});
