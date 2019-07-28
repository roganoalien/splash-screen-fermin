const UTILS = (function() {
    const alerts = document.querySelectorAll('.alert');

    const _showAlert = () => {
        for (let i = 0; i < alerts.length; i++) {
            setTimeout(function() {
                alerts[i].classList.add('active');
                setTimeout(function() {
                    alerts[i].classList.remove('active');
                }, 5000);
            }, i * 500);
        }
    };

    return {
        alert: function() {
            if (document.getElementById('show-me')) {
                _showAlert();
            }
        }
    };
})();
