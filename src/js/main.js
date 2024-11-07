$(document).ready(function () {
    const apiBase = 'https://pokeapi.co/api/v2/pokemon';
    let limit = 21;
    let offset = 0;
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentPokemonIndex = 0;
    let pokemonList = [];
    let searchQuery = '';

    function updateTheme(theme) {
        if (theme === 'dark') {
            $('body').addClass('dark-mode').removeClass('light-mode');
            $('#toggleTheme').html('<i class="bi bi-circle-half" style="font-size: 1rem;"></i> Cambiar Tema');
        } else {
            $('body').addClass('light-mode').removeClass('dark-mode');
            $('#toggleTheme').html('<i class="bi bi-circle-half" style="font-size: 1rem;"></i> Cambiar Tema');
        }
        localStorage.setItem('theme', theme);
    }

    updateTheme(currentTheme);

    $('#toggleTheme').on('click', function () {
        currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        updateTheme(currentTheme);
    });

    function showLoadingMessage() {
        $('#pokemonContainer').html('<div class="loading">Cargando...</div>');
    }

    function hideLoadingMessage() {
        $('.loading').remove();
    }

    function loadPokemonList() {
        showLoadingMessage();
        $.get(`${apiBase}?limit=${limit}&offset=${offset}`, function (data) {
            $('#pokemonContainer').empty();
            pokemonList = data.results;
            data.results.forEach((pokemon, index) => {
                $.get(pokemon.url, function (pokeData) {
                    const imageUrl = pokeData.sprites.other['official-artwork'].front_default;
                    displayPokemonCard(pokeData, pokemon.name, index);
                });
            });
            hideLoadingMessage();

            $('#prevPage').show();
            $('#nextPage').show();
            $('#prevPokemon').hide();
            $('#nextPokemon').hide();
        });
    }

    function displayPokemonCard(pokemon, name, index) {
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

        const card = $(`
            <div class="card pokemon-card">
                <img src="${imageUrl}" class="card-img-top" alt="${name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${name.charAt(0).toUpperCase() + name.slice(1)}</h5>
                </div>
            </div>
        `).hide();

        $('#pokemonContainer').append(card);
        card.fadeIn(300);

        card.on('click', function () {
            currentPokemonIndex = index;
            showPokemonDetails(pokemon.id);
        });
    }

    function showPokemonDetails(pokemonId) {
        showLoadingMessage();
        $.get(`${apiBase}/${pokemonId}`, function (pokemon) {
            hideLoadingMessage();
            $('#pokemonContainer').empty();
            const types = pokemon.types.map(type => type.type.name).join(', ');
            const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

            const details = `
                <div class="card pokemon-detail-card">
                    <img src="${imageUrl}" class="card-img-top mx-auto d-block" alt="${pokemon.name}">
                    <div class="card-body text-center">
                        <h2 class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                        <p><strong>Tipos:</strong> ${types}</p>
                    </div>
                    <button class="btn btn-custom" id="backButton">Volver</button>
                </div>
            `;
            $('#pokemonContainer').html(details);
            hideLoadingMessage();

            $('#prevPage').hide();
            $('#nextPage').hide();
            $('#prevPokemon').hide();
            $('#nextPokemon').hide();

            $('#backButton').on('click', function () {
                loadPokemonList();
            });
        }).fail(function () {
            hideLoadingMessage();
            $('#pokemonContainer').html('<div class="error-message">Pokémon no encontrado. Intenta nuevamente.</div>');
        });
    }

    $('#nextPage').on('click', function () {
        offset += limit;
        loadPokemonList();
    });

    $('#prevPage').on('click', function () {
        if (offset > 0) {
            offset -= limit;
            loadPokemonList();
        }
    });

    $('#searchButton').on('click', function () {
        const searchQuery = $('#pokemonSearch').val().trim().toLowerCase();

        if (searchQuery) {
            showLoadingMessage();
            $.get(`${apiBase}/${searchQuery}`, function (pokemon) {
                $('#pokemonContainer').empty();
                const types = pokemon.types.map(type => type.type.name).join(', ');
                const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

                const details = `
                    <div class="card pokemon-detail-card">
                        <img src="${imageUrl}" class="card-img-top mx-auto d-block" alt="${pokemon.name}">
                        <div class="card-body text-center">
                            <h2 class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                            <p><strong>Tipos:</strong> ${types}</p>
                        </div>
                        <button class="btn btn-custom" id="backButton">Volver</button>
                    </div>
                `;
                $('#pokemonContainer').html(details);
                hideLoadingMessage();

                $('#prevPage').hide();
                $('#nextPage').hide();
                $('#prevPokemon').hide();
                $('#nextPokemon').hide();

                $('#backButton').on('click', function () {
                    loadPokemonList();
                });
            }).fail(function () {
                hideLoadingMessage();
                $('#pokemonContainer').html('<div class="error-message">Pokémon no encontrado. Intenta nuevamente.</div>');
            });
        }
    });

    $('#showAllButton').on('click', function () {
        $('#pokemonSearch').val('');
        loadPokemonList();
    });

    loadPokemonList();
});
