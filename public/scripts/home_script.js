//refreshamo brojace
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    window.location.reload();
  }
});
document.querySelectorAll('.dodaj_u_kosaricu').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        fetch(`/cart/add/${productId}`, 
            {method: 'POST'},
            {headers: {'Accept': 'application/json'}})
        .then(res => res.json()
        .then(data => {
            const brojac = document.getElementById('brojac-' + productId);
            //promjeni display ako je nevidljiv
            if (brojac.style.display === 'none') {
                brojac.style.display = 'flex';
            }
            //ažuriraj brojač za taj proizvod
            brojac.textContent = data.quantity;
            //ažuriraj globalni brojač
            const globalni = document.getElementById('globalniBrojac');
            const ukupno = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            globalni.textContent = ukupno;
        }))
        
    });
});
document.querySelectorAll('.dodaj_u_kosaricu').forEach(btn => {
    const productId = btn.getAttribute('data-id');
    const brojac = document.getElementById('brojac-' + productId);
    if (parseInt(brojac.textContent) === 0) {
        brojac.style.display = 'none';
    } else {
        brojac.style.display = 'flex';
    }
});
