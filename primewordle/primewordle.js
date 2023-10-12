const pw_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
let pw_number_factorization = [];
let pw_current_board = 0;
let pw_random_amount = 0;

function randomize() {
    let pw_primess = pw_primes.slice();
    let index;
    pw_number_factorization = [];
    pw_current_board = 0;

    for ( let i = 0; i < 5; i++ ) {
        index = Math.floor(Math.random() * (25 - i));
        pw_number_factorization.push(pw_primess[index]);
        pw_primess.splice(index, 1);
    }
    pw_number_factorization.sort( function(a, b) {
        return a - b;
    });
}

function setup() {
    const date = new Date;
    let pw_primess = pw_primes.slice();
    let seed = (date.getDay() + 1)*date.getDate()*date.getMonth()*date.getFullYear();

    pw_number_factorization = [];
    pw_current_board = 0;

    pw_number_factorization.push(pw_primess[seed % 25]);
    pw_primess.splice(seed % 25, 1);
    seed += pw_primes[seed % 25];

    pw_number_factorization.push(pw_primess[seed % 24]);
    pw_primess.splice(seed % 24, 1);
    seed *= pw_primes[seed % 25];

    pw_number_factorization.push(pw_primess[seed % 23]);
    pw_primess.splice(seed % 23, 1);
    seed += pw_primes[seed % 25];

    pw_number_factorization.push(pw_primess[seed % 22]);
    pw_primess.splice(seed % 22, 1);
    seed *= pw_primes[seed % 25];

    pw_number_factorization.push(pw_primess[seed % 21]);

    pw_number_factorization.sort( function(a, b) {
        return a - b;
    });
}

function prime_test( number ) {
    if ( pw_primes.includes( Number(number) ) ) return true;
    else return false;
}

function check() {
    let block;
    let checkindex = [false,false,false,false,false];
    let win = false;

    for ( let i = 1; i < 6; i++ ) {
        block = document.getElementById("pw-game-field-" + ((pw_current_board) * 5 + i));

        block.style.backgroundColor = "white";
        if ( Number(block.value) == 0 ) block.style.backgroundColor = "gray";
        else {
            if ( pw_number_factorization.includes(Number(block.value)) ) {
                if ( pw_number_factorization[i - 1] == Number(block.value) ) {
                    block.style.backgroundColor = "green";
                    checkindex[i - 1] = true;
                } else {
                    block.style.backgroundColor = "yellow";
                }
            } else {
                if ( pw_number_factorization[i - 1] > Number(block.value) ) {
                    block.style.backgroundColor = "cyan";
                } else {
                    block.style.backgroundColor = "pink";
                }
            }
        }
        block.disabled = true;
    }

    if ( checkindex[0] && checkindex[1] && checkindex[2] && checkindex[3] && checkindex[4] ) {
        win = true;
    }
    pw_current_board++;

    if (( pw_current_board == 5 ) || ( win )) {
        for ( let i = 1; i < 26; i++ ) {
            block = document.getElementById("pw-game-field-" + i);
            block.disabled = false;
        }
    } else {
        for ( let i = 1; i < 6; i++ ) {
            block = document.getElementById("pw-game-field-" + ((pw_current_board) * 5 + i));
            if ( checkindex[i - 1] ) {
                block.style.backgroundColor = "green";
                block.value = pw_number_factorization[i - 1];
                block.disabled = true;
            } else {
                block.style.backgroundColor = "white";
                block.disabled = false;
            }
        }
    }
}

function loadMathWordle( isRandom = false ) {
    let game = document.querySelector(".game");
    let info = document.querySelector(".game-info");

    if ( isRandom ) {
        randomize();
        pw_random_amount++;
        info.innerHTML = "RANDOM #" + pw_random_amount;
    } else {
        setup();
        info.innerHTML = "DAILY";
    }

    game.innerHTML = "";

    for ( let i = 0; i < 25; i++ ){
        let input = document.createElement("input");
        input.type = "text";
        input.className = "pw-field";
        input.id = "pw-game-field-" + (i + 1);

        if( i < 5 ) {
            input.style.backgroundColor = "white";
        } else {
            input.disabled = true;
        }

        input.addEventListener("keydown", (event)=>{
            if ((isNaN(event.key) || event.target.value.length == 2) 
            && event.key != "Backspace" && event.key != "Tab"
            && event.key != "ArrowLeft" && event.key != "ArrowRight" ) {
                event.preventDefault();
            }
        });
        game.appendChild(input);
    }
}

window.onkeydown = (event)=>{
    if ( event.key == "Enter" ) {
        check();
    }
}

window.onload = ()=> {
    loadMathWordle( false );
}

document.getElementById("pw-randomize").addEventListener("click", ()=> {
    loadMathWordle( true );
});