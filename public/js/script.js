( () => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });

})();

// Booking modal helper
(function(){
    document.addEventListener('DOMContentLoaded', function(){
        const bookingModal = document.getElementById('bookingModal');
        if(!bookingModal) return;

        bookingModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const listingId = button.getAttribute('data-listingid');
            const price = Number(button.getAttribute('data-price') || 0);

            const modalListingId = document.getElementById('modalListingId');
            const modalPrice = document.getElementById('modalPrice');
            const modalStart = document.getElementById('modalStartDate');
            const modalEnd = document.getElementById('modalEndDate');
            const modalNights = document.getElementById('modalNights');
            const modalTotal = document.getElementById('modalTotal');
            const modalTotalPriceInput = document.getElementById('modalTotalPriceInput');

            modalListingId.value = listingId;
            modalPrice.textContent = '₹' + price.toLocaleString('en-IN');

            function updateModalTotals(){
                const sd = modalStart.value ? new Date(modalStart.value) : null;
                const ed = modalEnd.value ? new Date(modalEnd.value) : null;
                let nights = 0;
                if(sd && ed){
                    const diff = (ed - sd) / (1000 * 60 * 60 * 24);
                    nights = Math.max(0, Math.ceil(diff));
                }
                if(nights <= 0) nights = 1;
                const total = nights * price;
                modalNights.textContent = nights;
                modalTotal.textContent = '₹' + total.toLocaleString('en-IN');
                modalTotalPriceInput.value = total;
            }

            modalStart.addEventListener('change', updateModalTotals);
            modalEnd.addEventListener('change', updateModalTotals);

            const modalForm = document.getElementById('modalBookingForm');
            modalForm.addEventListener('submit', function(e){
                const sd = modalStart.value;
                const ed = modalEnd.value;
                if(!sd || !ed){
                    e.preventDefault();
                    alert('Please select start and end dates');
                    return;
                }
                if(new Date(ed) <= new Date(sd)){
                    if(!confirm('End date is same or before start date. Proceed with 1 night?')){
                        e.preventDefault();
                        return;
                    }
                }
            });
        });
    });
})();