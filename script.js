const symbols = ["#cereja", "#melancia", "#uva", "#estrela"];
const slots = document.querySelectorAll(".slot svg");

document.getElementById("spin").addEventListener("click", () => {
  slots.forEach(svg => {
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    svg.setAttribute("href", randomSymbol);
  });
});
