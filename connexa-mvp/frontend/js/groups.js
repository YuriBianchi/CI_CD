(function () {
  const form = document.getElementById("groupForm");
  const msg = document.getElementById("message");

  function setMessage(text, isError) {
    msg.textContent = text;
    msg.className = isError ? "error" : "success";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage("Enviando...", false);
    const assunto = document.getElementById("assunto").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!assunto) {
      setMessage("O campo assunto é obrigatório", true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      const res = await fetch("/api/groups", {
        method: "POST",
        headers,
        body: JSON.stringify({ assunto, descricao }),
      });

      if (res.status === 201) {
        const body = await res.json();
        setMessage("Grupo criado com sucesso (id: " + body.id + ")", false);
        form.reset();
      } else {
        const err = await res.json().catch(() => ({ error: "Erro" }));
        setMessage("Erro: " + (err.error || "status " + res.status), true);
      }
    } catch (err) {
      setMessage("Falha na requisição: " + err.message, true);
    }
  });
})();
