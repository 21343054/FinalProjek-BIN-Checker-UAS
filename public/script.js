function checkBIN() {
  const binInput = document.getElementById("binInput").value;

  fetch(`/check/${binInput}`, {
    method: "GET",
    headers: {
      apikey: "DxAyIIikyfZGaYgzcxjlG3GDNoyThrPu",
    },
  })
    .then((response) => response.json()) // Assuming response is JSON
    .then((result) => {
      const resultBody = document.getElementById("resultBody");
      resultBody.innerHTML = ""; // Clear previous results

      for (const key in result) {
        if (Object.hasOwnProperty.call(result, key)) {
          const value = result[key];
          const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
          resultBody.innerHTML += row;
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
      const resultBody = document.getElementById("resultBody");
      resultBody.innerHTML =
        '<tr><td colspan="2">An error occurred. Please try again.</td></tr>';
    });
}
