/** @type {HTMLElement[]} */
const e = {};
function loadIDS() {
 var allElements = document.querySelectorAll("*[id]");
 for (let i = 0, n = allElements.length; i < n; i++) {
  e[allElements[i].id] = allElements[i];
 }
}
Decimal.config({ precision: 8, rounding: 4 });

let game = {};
function reset() {
 game = {
  mass: Decimal(0),
  hawking: Decimal(0),
  totalhawking: Decimal(0),
  hawkingresets: 0,
  researchresets: 0,
  stholes: Decimal(0),
  researchresetstart: new Date(),
  bestresearchresettime: 0,
  

  upgrades: {},
 };
 for (const key in Upgrades) {
  game.upgrades[key] = 0;
 }
}
UpgradeData = {
 costType: "mass",
 description: "",
 amount: 0,
 limit: 0,
 effectFunc: 0,
 hideOnMaxing: false,
 priceFunc: (amount) => 0,
 getLimit: (limit) => limit,
};

class Upgrade {
 /**
  *
  * @param {UpgradeData} data
  */
 constructor(data) {
  this.data = Object.assign(
   Object.create(Object.getPrototypeOf(UpgradeData)),
   UpgradeData
  );
  this.isMaxed = false;
  this.data = loadObject(this.data, data);
  this.construct();
 }
 construct() {
  this.container = document.createElement("button");
  this.container.className = "upgrade";
  let description = document.createElement("p");
  description.innerHTML = this.data.description;
  this.container.appendChild(description);
  this.cost = document.createElement("p");
  this.effectContainer = document.createElement("p");
  this.container.appendChild(this.cost);
  this.container.appendChild(this.effectContainer);
  this.container.onclick = this.buy.bind(this);
  if (this.data.container != "none") {
   $(this.data.container)[0].appendChild(this.container);
  }
  this.update();
 }
 getAmount() {
  return this.data.amount;
 }
 getTag() {
  return this.container;
 }
 load(amount) {
  this.data.amount = amount;
  this.update();
 }
 updatePrice() {
  this.cost.innerText = this.isMaxed
   ? ""
   : this.data.priceFunc(this.data.amount).formateNumber() +
     " " +
     Names[this.data.costType];
 }
 updateEffect() {
  if (this.data.effectFunc)
   this.effectContainer.innerHTML =
    "Effect: " + this.data.effectFunc(this.data.amount);
 }
 buy() {
  if (this.canBuy()) {
   if (this.canAfford()) {
    game[this.data.costType] = game[this.data.costType].minus(
     this.data.priceFunc(this.data.amount)
    );
    this.data.amount++;
    this.update();
   }
  }
 }
 update() {
  this.becomeMaxed();
  this.updateEffect();
  this.updatePrice();
  this.container.disabled = !this.canAfford() && !this.isMaxed;
 }

 canBuy() {
  return this.data.amount < this.data.getLimit(this.data.limit);
 }
 canAfford() {
  return game[this.data.costType].gte(this.data.priceFunc(this.data.amount));
 }

 becomeMaxed() {
  if (this.isMaxed) {
   if (this.canBuy()) {
    this.container.classList.remove("upgrade-maxed");
    this.isMaxed = false;
    if (this.data.hideOnMaxing) this.container.style.display = "block";
   }
  } else if (!this.canBuy()) {
   this.isMaxed = true;
   this.container.classList.add("upgrade-maxed");
   if (this.data.hideOnMaxing) this.container.style.display = "none";
  }
 }
}

let Upgrades = {};

let timers = {};

function LOADING() {
 loadIDS();
 reset();
 loadUpgrades();
 reset();
 load();

 timers.save = setInterval(save, 2000);
 timers.updateUpgrade = setInterval(
  updateUpgrade,
  1000 / upgradeUpdatedPerSecond
 );
 setInterval(fastTick, 1000 / fastTicksPerSecond);
 timers.reveal = setInterval(reveal, 1000);
 reveal();
}
function fastTick() {
 const MPS = massPerSecond();
 const HPS = hawkingPerSecond();
 game.mass = game.mass.plus(MPS.div(fastTicksPerSecond));
 game.hawking = game.hawking.plus(HPS.div(fastTicksPerSecond));
 game.totalhawking = game.totalhawking.plus(HPS.div(fastTicksPerSecond));
 e.masscounterinner.innerText =
  game.mass.formateNumber() + " (+" + MPS.formateNumber() + "/s)";
 e.hawkingnumber.innerText = getHawkingGain().formateNumber(5, 0);
 e.hawkingcounterinner.innerText =
  game.hawking.formateNumber(5, 0) + " (+" + HPS.formateNumber() + "/s)";
 e.hawkingeffectcounter.innerText =
  "x" + getHawkingMassEffect().formateNumber(undefined, 0);
e.stholescounterinner.innerText = game.stholes.formateNumber(undefined,0)
}

function massPerSecond() {
 return Decimal(0)
  .plus(
   perUpgrade.massUpgrade1 **
    (Upgrades.massUpgrade1.getAmount() *
     2 *
     1.22 ** Upgrades.massUpgrade4.getAmount())
  )
  .mul(Decimal(perUpgrade.massUpgrade2 +
    perUpgrade.hawkingUpgrade3 * Upgrades.hawkingUpgrade3.getAmount()).pow(Upgrades.massUpgrade2.getAmount()))
  .mul(game.mass.plus(10).log(3).pow(2**(Upgrades.massUpgrade6.getAmount())))
  .mul(getHawkingMassEffect())
  .mul(1e10**Upgrades.hawkingUpgrade4.getAmount());
}

function hawkingPerSecond() {
 return getHawkingGain().mul(
  perUpgrade.hawkingUpgrade1 * Upgrades.hawkingUpgrade1.getAmount()
 );
}
let currentTab = "tab-blackhole";
function switchTab(newtab) {
 if (newtab != currentTab) {
  e[currentTab].style.display = "none";
  currentTab = newtab;
  e[currentTab].style.display = "flex";
 }
}
function hardReset() {
 if (confirm("Are you sure?!")) {
  reset();
  save(true);
  clearInterval(timers.save);
  window.location.reload();
 }
}
function updateUpgrade() {
 for (const key in Upgrades) {
  Upgrades[key].update();
 }
 e["hawkingreset-btn"].disabled = game.mass < 1e25;
 e["researchreset-btn"].disabled = game.hawking.e < 160;
}
let revealedGroups = [];
function reveal() {
 if (!revealedGroups[0] && (game.mass >= 1e25 || game.hawkingresets > 0)) {
  revealedGroups[0] = true;
  e["hawking-btn"].style.display = "block";
 }
 if (!revealedGroups[1] && (game.hawking.e >= 160 || game.researchresets > 0)) {
  revealedGroups[1] = true;
  e["research-btn"].style.display = "block";
 }
}
function getHawkingGain() {
 return game.mass
  .pow(1 / (47 * game.mass.plus(1).log(10).plus(1).log(100)))
  .mul(perUpgrade.hawkingUpgrade2 ** Upgrades.hawkingUpgrade2.getAmount()).mul(10**Upgrades.hawkingUpgrade4.getAmount())
  .floor();
}

function test() {
 let Decimals = 0;
 const step = 1;
 let x;
 let EndOfTest = 50;
 function formula() {
  return x.pow(1 / x.plus(1).log(10).plus(2).log(10));
 }
 for (Decimals; Decimals < EndOfTest; Decimals += step) {
  x = Decimal("1e" + Decimals);
  console.log("Testing For x: " + x.formateNumber());
  console.log("Result: " + formula().formateNumber());
 }
}
function doHawkingsReset() {
 if (game.mass >= 1e25) {
  game.hawkingresets++;
  let hawkingsGain = getHawkingGain();
  game.hawking = game.hawking.add(hawkingsGain);
  game.totalhawking = game.totalhawking.add(hawkingsGain);
  game.mass = Decimal(1);
  Upgrades.massUpgrade1.load(0);
  Upgrades.massUpgrade2.load(0);
  Upgrades.massUpgrade3.load(0);
  Upgrades.massUpgrade4.load(0);
 }
}
function getHawkingMassEffect() {
 return game.totalhawking
  .pow(1 / game.totalhawking.plus(1).log(10).plus(1).log(10))
  .plus(1).pow(20**(Upgrades.massUpgrade7.getAmount()));
}
function doResearchReset(){
  if(game.hawking.e > 160){
    game.researchresets++;
    game.stholes = game.stholes.plus(1)
    
    game.hawking = Decimal(0)
    game.totalhawking = Decimal(0)
    game.mass = Decimal(1);
    Upgrades.massUpgrade1.load(0);
    Upgrades.massUpgrade2.load(0);
    Upgrades.massUpgrade3.load(0);
    Upgrades.massUpgrade4.load(0);
    Upgrades.massUpgrade5.load(0);
    Upgrades.massUpgrade6.load(0);
    Upgrades.massUpgrade7.load(0);
    Upgrades.hawkingUpgrade1.load(0);
    Upgrades.hawkingUpgrade2.load(0);
    Upgrades.hawkingUpgrade3.load(0);
    Upgrades.hawkingUpgrade4.load(0);
    Upgrades.hawkingUpgrade5.load(0);
    Upgrades.hawkingUpgrade6.load(0);

const end = new Date()
const besttime = end - game.researchresetstart
if(besttime < game.bestresearchresettime || game.bestresearchresettime == 0){
  game.bestresearchresettime = besttime
}
 
game.researchresetstart = new Date()

  }
}
