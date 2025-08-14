// ======== Data ========
let playerPool = JSON.parse(localStorage.getItem("playerPool")) || ["Salah","Kane","De Bruyne","Rashford","Sterling","Alexander-Arnold","Fernandes","Son"];
let teams = JSON.parse(localStorage.getItem("teams")) || {
    "Alice": ["Salah","Kane","De Bruyne","Rashford","Sterling"],
    "Bob": ["Alexander-Arnold","Fernandes","Son","Kane","Rashford"]
};
let playerPoints = JSON.parse(localStorage.getItem("playerPoints")) || {
    "Salah":10,"Kane":8,"De Bruyne":7,"Rashford":6,"Sterling":5,
    "Alexander-Arnold":6,"Fernandes":7,"Son":8
};

// ======== Init ========
function init() {
    populateManagers();
    populateAddPlayerOptions();
    refreshDropPlayerOptions();
    refreshTeamsDisplay();

    document.getElementById("manager-select").addEventListener("change", refreshDropPlayerOptions);
    document.getElementById("transfer-btn").addEventListener("click", doTransfer);
    document.getElementById("add-player-btn").addEventListener("click", addPlayerToPool);
    document.getElementById("update-gw-btn").addEventListener("click", updateGWPoints);
}

// ======== Populate Managers & Player Options ========
function populateManagers() {
    const select = document.getElementById("manager-select");
    select.innerHTML = "";
    Object.keys(teams).forEach(m => {
        const opt = document.createElement("option");
        opt.value = m; opt.textContent = m;
        select.appendChild(opt);
    });
}

function populateAddPlayerOptions() {
    const select = document.getElementById("add-player");
    select.innerHTML = "";
    playerPool.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p; opt.textContent = p;
        select.appendChild(opt);
    });
}

function refreshDropPlayerOptions() {
    const manager = document.getElementById("manager-select").value;
    const dropSelect = document.getElementById("drop-player");
    dropSelect.innerHTML = "";
    teams[manager].forEach(p => {
        const opt = document.createElement("option");
        opt.value = p; opt.textContent = p;
        dropSelect.appendChild(opt);
    });
}

// ======== Transfers ========
function doTransfer() {
    const manager = document.getElementById("manager-select").value;
    const addPlayer = document.getElementById("add-player").value;
    const dropPlayer = document.getElementById("drop-player").value;
    const msg = document.getElementById("transfer-msg");

    // Check duplicates
    for (let m in teams) {
        if (m !== manager && teams[m].includes(addPlayer)) {
            msg.textContent = `${addPlayer} is already in another team!`;
            msg.style.color = "red";
            return;
        }
    }

    // Replace player
    const idx = teams[manager].indexOf(dropPlayer);
    if(idx === -1){ msg.textContent = `${dropPlayer} not found!`; msg.style.color="red"; return;}
    teams[manager][idx] = addPlayer;

    msg.textContent = `Transfer successful: ${dropPlayer} → ${addPlayer}`;
    msg.style.color = "green";

    saveData();
    refreshDropPlayerOptions();
    refreshTeamsDisplay();
}

// ======== Add Player to Pool ========
function addPlayerToPool() {
    const name = document.getElementById("new-player-name").value.trim();
    if(!name) return;
    if(playerPool.includes(name)) { alert("Player already exists!"); return; }
    playerPool.push(name);
    playerPoints[name] = 0; // start with 0 points
    document.getElementById("new-player-name").value = "";
    saveData();
    populateAddPlayerOptions();
}

// ======== Update GW Points ========
function updateGWPoints() {
    const gw = Number(document.getElementById("gw-number").value);
    if(isNaN(gw) || gw<1){ alert("Invalid GW"); return;}
    // Prompt for points for each player
    playerPool.forEach(p=>{
        const pts = prompt(`Enter points for ${p} in GW${gw}:`, playerPoints[p]||0);
        if(pts !== null) playerPoints[p] = Number(pts);
    });
    saveData();
    refreshTeamsDisplay();
}

// ======== Display Teams ========
function refreshTeamsDisplay() {
    const display = document.getElementById("teams-display");
    display.innerHTML = "";
    for(let m in teams){
        const div = document.createElement("div");
        div.className = "team";
        const totalPoints = teams[m].reduce((sum,p)=>sum+(playerPoints[p]||0),0);
        div.innerHTML = `<strong>${m}</strong> - Total Points: ${totalPoints}<br>${teams[m].join(", ")}`;
        display.appendChild(div);
    }
}

// ======== LocalStorage ========
function saveData() {
    localStorage.setItem("playerPool", JSON.stringify(playerPool));
    localStorage.setItem("teams", JSON.stringify(teams));
    localStorage.setItem("playerPoints", JSON.stringify(playerPoints));
}

// ======== Start App ========
init();