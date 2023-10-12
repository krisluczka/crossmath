const war_colors = ["♥", "♦", "♠", "♣"];
const war_cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let war_time = 10;
let war_timer = document.querySelector(".war-timer");
let war_stage = 0;
let war_status = 0;
let war_odds = [2, 2];

let war_user_account = 100;
let war_user_bet = 0;
let war_user_ticket = 0;
let war_user_odds = 0;

let war_croupier = document.querySelector("#war-croupier");
let war_player = document.querySelector("#war-player");

let war_odds_croupier = document.querySelector("#war-odds-croupier");
let war_odds_war = document.querySelector("#war-odds-war");
let war_odds_player = document.querySelector("#war-odds-player");

let war_croupier_card = -1;
let war_player_card = -1;

let war_bet_button = document.querySelector(".war-betpanel-bet");
let war_user_balance = document.querySelector(".war-user-balance");
let war_tickets = document.querySelector(".war-tickets");

function check() {
    if ( war_stage == 0 || war_stage == 3 ) {
        war_stage = 0;
        war_status = 0;
        war_croupier_card = -1;
        war_player_card = -1;
        war_odds = [2, 2];
        war_croupier.innerHTML = "Croupier";
        war_croupier.style.color = "white";
        war_player.innerHTML = "Player";
        war_player.style.color = "white";

        war_user_bet = 0;
        war_user_ticket = 0;
        war_user_odds = 0;

        war_croupier.style.backgroundColor = "#202020";
        war_odds_croupier.style.backgroundColor = "#202020";
        war_player.style.backgroundColor = "#202020";
        war_odds_player.style.backgroundColor = "#202020";
        war_odds_war.style.backgroundColor = "#202020";

        war_stage++;
    } else if ( war_stage == 1 ) {
        war_croupier_card = Math.floor(Math.random() * 13);
        let color = Math.floor(Math.random() * 4);
        if( color == 0 || color == 1 ) war_croupier.style.color = "red";
        war_croupier.innerHTML = war_cards[war_croupier_card] + war_colors[color];
        war_odds[0] = Math.round(1300 / war_croupier_card) / 100;
        war_odds[1] = Math.round(1300 / (13 - war_croupier_card)) / 100;

        war_stage++;
    } else if ( war_stage == 2 ) {
        war_time = 3;
        war_player_card = Math.floor(Math.random() * 13);
        let color = Math.floor(Math.random() * 4);
        if( color == 0 || color == 1 ) war_player.style.color = "red";
        war_player.innerHTML = war_cards[war_player_card] + war_colors[color];

        if ( war_croupier_card > war_player_card ) {
            war_status = 1;
            war_croupier.style.backgroundColor = "green";
            war_odds_croupier.style.backgroundColor = "green";
        } else if ( war_croupier_card < war_player_card ) {
            war_status = 2;
            war_player.style.backgroundColor = "green";
            war_odds_player.style.backgroundColor = "green";
        } else {
            war_status = 3;
            war_odds_war.style.backgroundColor = "green";
        }

        settle();

        war_stage++;
    }
    war_odds_croupier.innerHTML = "C " + war_odds[0];
    war_odds_player.innerHTML = "P " + war_odds[1];
}

function settle() {
    let tickets = document.querySelectorAll(".war-ticket-unresolved");
    console.log(tickets);
    let ih = "";
    let prize;
    let result = "";

    for ( let ticket of tickets ) {
        let values = [];
        prize = 0;
        for ( let child of ticket.children ) {
            values.push(child.innerHTML);
        }

        values.push(String(values[1]).charAt(0));
        values.push(Number(values[1].slice(1)));
        if ( values[4] == "C" ) values[4] = 1;
        else if ( values[4] == "P" ) values[4] = 2;
        else if ( values[4] == "W" ) values[4] = 3;

        if ( values[4] == war_status ) {
            prize = Math.round(Number(values[0]) * Number(values[5]) * 100) / 100;
        }

        if ( war_status == 1 ) result = "Croupier";
        else if ( war_status == 2 ) result = "Player";
        else result = "War";

        ticket.innerHTML = "<p>" + values[0] + "</p><p>"
        + values[1] + "</p><p>" + result + "</p><p>" + prize + "</p>";

        war_user_account += prize;

        war_user_account = Math.round(war_user_account * 100) / 100;
        war_user_balance.innerHTML = "Balance: " + war_user_account;

        ticket.className = "war-ticket";
    }
}

function bet() {
    war_user_ticket = Number(document.getElementById("war-betpanel-amount").value);
    if ( war_user_account >= war_user_ticket && war_user_bet > 0 ) {
        war_user_account -= war_user_ticket;
        let bet;
        if ( war_user_bet == 1 ) {
            war_user_odds = war_odds[0];
            bet = "C ";
        } else if ( war_user_bet == 2 ) {
            war_user_odds = war_odds[1];
            bet = "P ";
        } else {
            war_user_odds = 13;
            bet = "W ";
        }
        let ticket = document.createElement("div");
        ticket.className = "war-ticket-unresolved";
        ticket.innerHTML = "<p>" + war_user_ticket + "</p><p>"
        + bet + war_user_odds + "</p><p>Unresolved</p><p>?</p>";

        war_tickets.appendChild(ticket);

        war_user_account = Math.round(war_user_account * 100) / 100;
        war_user_balance.innerHTML = "Balance: " + war_user_account;

        war_user_bet = 0;
        war_user_ticket = 0;
        war_user_odds = 0;
        war_odds_croupier.style.backgroundColor = "#202020";
        war_odds_war.style.backgroundColor = "#202020";
        war_odds_player.style.backgroundColor = "#202020";
    }
}

war_bet_button.addEventListener("click", bet);

war_odds_croupier.addEventListener("click", ()=> {
    if ( war_stage == 0 || war_stage == 1 || war_stage == 2 )  {
        war_odds_croupier.style.backgroundColor = "#4f4f4f";
        war_odds_war.style.backgroundColor = "#202020";
        war_odds_player.style.backgroundColor = "#202020";
        war_user_bet = 1;
    }
});
war_odds_war.addEventListener("click", ()=> {
    if ( war_stage == 0 || war_stage == 1 || war_stage == 2 ) {
        war_odds_croupier.style.backgroundColor = "#202020";
        war_odds_war.style.backgroundColor = "#4f4f4f";
        war_odds_player.style.backgroundColor = "#202020"
        war_user_bet = 3;
    }
});
war_odds_player.addEventListener("click", ()=> {
    if ( war_stage == 0 || war_stage == 1 || war_stage == 2 ) {
        war_odds_croupier.style.backgroundColor = "#202020";
        war_odds_war.style.backgroundColor = "#202020";
        war_odds_player.style.backgroundColor = "#4f4f4f";
        war_user_bet = 2;
    }
});


setInterval(() => {
    war_time -= 1;
    if ( war_time < 0 ) {
        war_time = 10;
        check();
    }
    war_timer.innerHTML = war_time + "s";
}, 1000);