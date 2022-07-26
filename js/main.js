const search_form = document.getElementById('search_form')
const search_button = document.getElementById('search_button')

//api: https://pokeapi.co/docs/v2#pokemon
const getPokemonData = async search_value => {
    document.getElementById('show_error').classList.remove('show')
    document.getElementById('show_error').classList.add('hidden')

    const url = `https://pokeapi.co/api/v2/pokemon/${search_value.toLowerCase()}`
    const response = await fetch(url)

    if (response.status == 404 || response.statusText == 'Not Found') {
        document.getElementById('show_error').classList.add('show')
        document.getElementById('show_error').classList.remove('hidden')
    }

    const pokemon = await response.json()
    var spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`

    // update ui with data 
    document.getElementById('update_img').setAttribute('src', spriteUrl)
    setPokemonId(pokemon);
    document.getElementById('update_name').innerHTML = pokemon.name
    //set types
    typeSelection(pokemon);
    //change container background
    changeContainerBackground(pokemon);
    
    const pokemonArrayStats = pokemon.stats;
    for(let i = 0; i < pokemonArrayStats.length; i++){

        const stat = pokemonArrayStats[i].base_stat;
        const statName = pokemonArrayStats[i].stat.name;

        document.getElementById(`${statName}_bar`).setAttribute('style', `width: ${statusBar(pokemon, i)}%`);
        document.getElementById(`${statName}_number`).innerHTML = `${stat}`;
        document.getElementById(`total_number`).innerHTML = `${statusTotalSum(pokemon)}`;
    }  
}

search_button.addEventListener('click', () => getPokemonData(search_form.value));
search_form.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        search_button.click();
   }

});

//making a status bar percentage based in each highest pokemon stat based on: https://www.thegamer.com/best-pokemon-of-each-stat-ranked/
//highest HP is Blissey: 255
//highest ATTACK is Kartana: 181
//highest DEFENSE is Shuckle: 230
//highest SP. ATK is Deoxys: 180
//highest SP. DEF is Shuckle: 230
//highest SPEED is Regieleki: 180
function statusBar(pokemon, status) {
    if (status == 0) {
        let value = pokemon.stats[0].base_stat;
        let statusBarResult = parseFloat((statusPercentageCalculator(255, value))).toFixed(2);
        return statusBarResult;
    } else if (status == 1) {
        let value = pokemon.stats[1].base_stat;
        let statusBarResult = parseFloat((statusPercentageCalculator(181, value))).toFixed(2);
        return statusBarResult;
    } else if (status == 2) {
        let value = pokemon.stats[2].base_stat;
        let statusBarResult = parseFloat((statusPercentageCalculator(230, value))).toFixed(2);
        return statusBarResult;
    } else if (status == 3) {
        let value = pokemon.stats[3].base_stat;
        let statusBarResult = parseFloat((statusPercentageCalculator(180, value))).toFixed(3);
        return statusBarResult;
    } else if (status == 4) {
        let value = pokemon.stats[4].base_stat;
        let statusBarResult = parseFloat((statusPercentageCalculator(230, value))).toFixed(4);
        return statusBarResult;
    } else {
        let value = pokemon.stats[5].base_stat;
        let statusBarResult = parseFloat((statusPercentageCalculator(200, value))).toFixed(5);
        return statusBarResult;
    }
}

//rule of three to get percentage bars
function statusPercentageCalculator(valor1, valor2) {
    let total = 100;
    let result = (valor2 * total) / valor1;
    return result;
}

function statusTotalSum(pokemon){
    let total = pokemon.stats[0].base_stat + 
                pokemon.stats[1].base_stat + 
                pokemon.stats[2].base_stat + 
                pokemon.stats[3].base_stat + 
                pokemon.stats[4].base_stat + 
                pokemon.stats[5].base_stat;
    return total;
}

//set pokemon types
function typeSelection(pokemon){
    if(pokemon.types.length > 1){
        //set type 1
        document.getElementById('type1').setAttribute('class', `text-center d-inline p-2 ${pokemon.types[0].type.name}`);
        document.getElementById('type1').innerHTML = `${pokemon.types[0].type.name}`;
        //set type 2
        document.getElementById('type2').style.visibility = 'visible';
        document.getElementById('type2').setAttribute('class', `text-center d-inline p-2 ${pokemon.types[1].type.name}`);
        document.getElementById('type2').innerHTML = `${pokemon.types[1].type.name}`;
    } else {
        //set type 1
        document.getElementById('type1').setAttribute('class', `text-center d-inline p-2 ${pokemon.types[0].type.name}`);
        document.getElementById('type1').innerHTML = `${pokemon.types[0].type.name}`;
        //hide type 2 tag
        document.getElementById('type2').setAttribute('class', `text-center d-inline p-2 hidden`);
    }
}

//changes container background and normal/flying pokemon to flying color
function changeContainerBackground(pokemon){
    //verify if this pokemon has 2 types and if its normal/flying
    if(pokemon.types.length > 1 && (pokemon.types[0].type.name == "normal" && pokemon.types[1].type.name == "flying")){
        document.getElementById('details_container').setAttribute('class', `detail-container ${pokemon.types[1].type.name}`);
    } else {
        document.getElementById('details_container').setAttribute('class', `detail-container ${pokemon.types[0].type.name}`);
    }
}

//add 00 or 0 depeding of pokemon number (just for design)
function setPokemonId(input){
    if(input.id < 10){
        document.getElementById('id_number').innerHTML = '#00'+input.id;
    } else if(input.id < 100){
        document.getElementById('id_number').innerHTML = '#0'+input.id;
    } else {
        document.getElementById('id_number').innerHTML = '#'+input.id;
    }
}
