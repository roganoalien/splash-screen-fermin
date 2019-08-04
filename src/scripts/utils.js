const UTILS = (function() {
    // Obtenemos el objecto
    const _$alerts = document.getElementById('alerts-holder'),
        search = document.getElementById('searchForm'),
        users = document.querySelectorAll('.user');
    // Creamos el objeto de Notyf
    let notyf = new Notyf({
        duration: 4000
    });

    const _notyf = () => {
        if (_$alerts) {
            if (_$alerts.classList.contains('multiple')) {
                // Cuando existen multiples alertas
                for (let i = 0; i < _$alerts.childNodes.length; i++) {
                    setTimeout(function() {
                        _makeAlert(_$alerts.childNodes[i].textContent, false);
                    }, 250);
                }
            } else {
                // Cuando solo existe una alerta
                let _success = false;
                if (_$alerts.classList.contains('success')) {
                    // Si es success
                    _success = true;
                }
                _makeAlert(_$alerts.childNodes[0].textContent, _success);
            }
        }
    };

    const _makeAlert = (text, success) => {
        if (!success) {
            notyf.error(text);
        } else {
            notyf.success(text);
        }
    };

    const _searchAdmin = () => {
        search.addEventListener('submit', function(e) {
            e.preventDefault();
            let displayAll = true;
            let value = document.getElementById('search').value;
            _hideAll();
            displayAll = _searchMatch(value);
            if (displayAll) {
                _showAll();
            }
        });
    };

    const _searchMatch = text => {
        users.forEach(user => {
            let temp = true;
            let _attribute = user.getAttribute('data-search');
            if (_attribute.includes(text)) {
                temp = false;
                user.classList.remove('hidden');
            }
            return temp;
        });
    };

    const _hideAll = () => {
        users.forEach(user => {
            user.classList.add('hidden');
        });
    };

    const _showAll = () => {
        users.forEach(user => {
            user.classList.remove('hidden');
        });
    };

    return {
        alert: function() {
            // Se llama la función de Notyf
            _notyf();
        },
        search: function() {
            _searchAdmin();
        }
    };
})();
