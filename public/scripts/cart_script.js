document.querySelectorAll('.plus').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        fetch(`/cart/add/${productId}`, {
            method: 'POST', 
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const brojac = document.getElementById('brojac-' + productId);
            //ažuriraj brojač
            brojac.textContent = data.quantity;
            //ažuriraj globalni brojač
            const globalni = document.getElementById('globalniBrojac');
            const ukupno = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            globalni.textContent = ukupno;
        });
    });
});

document.querySelectorAll('.minus').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        fetch(`/cart/remove/${productId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const brojac = document.getElementById('brojac-' + productId);
            brojac.textContent = data.quantity;
            if (data.quantity === 0) {
                kosarica_lista.removeChild(brojac.parentElement.parentElement); // Ukloni cijeli element ako je količina 0
            }
            //ažuriraj globalni brojač
            const globalni = document.getElementById('globalniBrojac');
            const ukupno = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            globalni.textContent = ukupno;
        });
    });
});