document.getElementById("productName").addEventListener("input", async function () {
  const query = this.value;
  if (query.length < 1) return;

  const res = await fetch(`/api/products?query=${query}`);
  const products = await res.json();

  const datalist = document.getElementById("productSuggestions");
  datalist.innerHTML = "";
  products.forEach(p => {
    const option = document.createElement("option");
    option.value = p.name;
    datalist.appendChild(option);
  });
});
