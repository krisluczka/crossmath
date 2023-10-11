const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
let number_factorization = [];

let current_board = 0;

function randomize() {
    let primess = primes.slice();
    let index;
    number_factorization = [];
    number = 1;
    for ( let i = 0; i < 5; i++ ) {
        index = Math.floor(Math.random() * (25 - i));
        number_factorization.push(primess[index]);
        primess.splice(index, 1);
    }
    number_factorization.sort();
}

function setup() {
    const date = new Date;
    let primess = primes.slice();
    let seed = (date.getDay() + 1)*date.getDate()*date.getMonth()*date.getFullYear();

    number_factorization = [];
    number = 1;

    number_factorization.push(primess[seed % 25]);
    primess.splice(seed % 25, 1);
    seed += primes[seed % 25];

    number_factorization.push(primess[seed % 24]);
    primess.splice(seed % 24, 1);
    seed *= primes[seed % 25];

    number_factorization.push(primess[seed % 23]);
    primess.splice(seed % 23, 1);
    seed += primes[seed % 25];

    number_factorization.push(primess[seed % 22]);
    primess.splice(seed % 22, 1);
    seed *= primes[seed % 25];

    number_factorization.push(primess[seed % 21]);

    number_factorization.sort();
}

function prime_test( number ) {
    if ( primes.includes( Number(number) ) ) return true;
    else return false;
}

function check() {
    let block;
    let index;
    let checkindex = [false,false,false,false,false];

    for ( let i = 1; i < 6; i++ ) {
        block = document.getElementById("game-field-" + ((current_board) * 5 + i));

        block.style.backgroundColor = "white";
        if ( !prime_test(block.value) ) block.style.backgroundColor = "red";
        else {
            index = primes.indexOf(Number(block.value));

            if (( index > 0 && number_factorization.includes(primes[index - 1]) )
            || ( index < 24 && number_factorization.includes(primes[index + 1]) )) block.style.backgroundColor = "yellow";

            if ( number_factorization.includes(Number(block.value)) ) {
                index = number_factorization.indexOf(Number(block.value));
                if ( checkindex[index] ) {
                    block.style.backgroundColor = "yellow";
                } else {
                    block.style.backgroundColor = "green";
                    checkindex[index] = true;
                }
            }
        }
        block.disabled = true;
    }

    if ( checkindex[0] && checkindex[1] && checkindex[2] && checkindex[3] && checkindex[4] ) {
        alert("Wygrales!");
    } else {
        current_board++;
    }
    // gdy zgadniesz nie podswietla sie calosc na zielono, a musi
    if ( current_board == 5 ) {
        console.log("Koniec, kutasie...");
    } else {
        for ( let i = 1; i < 6; i++ ) {
            block = document.getElementById("game-field-" + ((current_board) * 5 + i));
            block.style.backgroundColor = "white";
            block.disabled = false;
        }
    }
}

window.onkeydown = (event)=>{
    if (event.key == "Enter") {
        check();
    }
}

window.onload = ()=> {
    setup();
    let game = document.querySelector(".game");

    for ( let i = 0; i < 25; i++ ){
        let input = document.createElement("input");
        input.type = "text";
        input.className = "field";
        input.id = "game-field-" + (i + 1);

        if( i < 5 ) {
            input.style.backgroundColor = "white";
        } else {
            input.disabled = true;
        }

        input.addEventListener("keydown", (event)=>{
            if ((isNaN(event.key) || event.target.value.length == 2) && event.key != "Backspace"){
                event.preventDefault();
            }
        });
        game.appendChild(input);
    }
}