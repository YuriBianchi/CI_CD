(function () {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");

  function setMessage(text, isError) {
    message.textContent = text;
    message.className = isError ? "error" : "success";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage("Entrando...", false);
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      setMessage("Email e senha são obrigatórios", true);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok && body.token) {
        // store token
        localStorage.setItem("token", body.token);
        setMessage("Login efetuado com sucesso", false);
        form.reset();
        // redireciona para página de criar grupo
        setTimeout(function () {
          window.location.href = "/api/groups/frontend/index.html";
        }, 800);
      } else {
        setMessage("Erro: " + (body.error || "status " + res.status), true);
      }
    } catch (err) {
      setMessage("Falha na requisição: " + err.message, true);
    }
  });
})();
