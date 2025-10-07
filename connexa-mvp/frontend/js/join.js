(function () {
  const form = document.getElementById("joinForm");
  const msg = document.getElementById("message");

  function setMessage(text, isError) {
    msg.textContent = text;
    msg.className = isError ? "error" : "success";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage("Entrando no grupo...", false);
    const grupoId = document.getElementById("grupoId").value;
    if (!grupoId) return setMessage("Informe o ID do grupo", true);

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = "Bearer " + token;

      const res = await fetch(
        "/api/groups/" + encodeURIComponent(grupoId) + "/join",
        {
          method: "POST",
          headers,
        }
      );

      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(body.message || "Entrou no grupo com sucesso", false);
      } else {
        const err = await res.json().catch(() => ({ error: "Erro" }));
        setMessage("Erro: " + (err.error || "status " + res.status), true);
      }
    } catch (err) {
      setMessage("Falha na requisição: " + err.message, true);
    }
  });
})();
