// TASK-005: Lógica para consumir o endpoint de cadastro de usuários
(function () {
  const form = document.getElementById("cadastroForm");
  const message = document.getElementById("message");
  const senhaInput = document.getElementById("senha");
  const senhaRequisitos = document.getElementById("senhaRequisitos");

  function setMessage(text, isError) {
    message.textContent = text;
    message.className = isError ? "error" : "success";
  }

  function validarSenha(senha) {
    const requisitos = [
      senha.length >= 8,
      /[A-Z]/.test(senha),
      /[a-z]/.test(senha),
      /\d/.test(senha),
    ];

    senhaRequisitos.querySelectorAll("li").forEach((li, index) => {
      li.style.color = requisitos[index] ? "green" : "red";
    });

    return requisitos.every(Boolean);
  }

  senhaInput.addEventListener("input", () => {
    validarSenha(senhaInput.value);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage("Enviando...", false);

    const email = document.getElementById("email").value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      setMessage("Todos os campos são obrigatórios.", true);
      return;
    }

    if (!validarSenha(senha)) {
      setMessage("A senha não atende aos requisitos.", true);
      return;
    }

    try {
      const res = await fetch("/api/usuarios/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (res.status === 201) {
        setMessage("Usuário cadastrado com sucesso!", false);
        form.reset();
        senhaRequisitos.querySelectorAll("li").forEach((li) => (li.style.color = ""));
      } else {
        const err = await res.json();
        setMessage(err.error || "Erro ao cadastrar usuário.", true);
      }
    } catch (err) {
      setMessage("Falha na requisição: " + err.message, true);
    }
  });
})();