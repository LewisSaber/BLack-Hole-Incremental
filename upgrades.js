function loadUpgrades() {
 Upgrades = {
  massUpgrade1: new Upgrade({
   description: "Better Diet",
   limit: 100,
   amount: 0,
   priceFunc: (amount) => 5 ** (amount + 1),
   container: containers.blackHoleTab,
  }),
  massUpgrade2: new Upgrade({
   description: "Better Diet II",
   limit: 200,
   amount: 0,

   priceFunc: (amount) => Decimal(10).pow(amount + 2).mul(2),
   container: containers.blackHoleTab,
  }),
  massUpgrade3: new Upgrade({
   description: "Mass multiply Mass",
   limit: 1,
   amount: 0,

   priceFunc: (amount) => 25000,
   container: containers.blackHoleTab,
  }),
  massUpgrade4: new Upgrade({
   description: "Better Better Diet<br>^1.22 Better Diet Effect",
   limit: 1,
   amount: 0,
   priceFunc: (amount) => 200000,
   container: containers.blackHoleTab,
  }),
  massUpgrade5: new Upgrade({
   description: "Even Better Diet",
   limit: 20,
   amount: 0,
   priceFunc: (amount) => Decimal(1e75).mul(Decimal(1e25).pow(amount)),
   effectFunc: (amount) =>
    "+" + perUpgrade.massUpgrade5 * amount + " Better Diet Limit",
   container: containers.blackHoleTab,
  }),
  massUpgrade6: new Upgrade({
   description: "Square 'Mass multiply Mass'",
   limit: 5,
   amount: 0,
   priceFunc: (amount) => Decimal(1e86).mul(Decimal(1e15).pow(amount)),
   container: containers.blackHoleTab,
  }),
  massUpgrade7: new Upgrade({
    description: "Better Gathering<br> ^20 Hawking Mass Boost",
    limit: 1,
    amount: 0,
    priceFunc: (amount) => Decimal("1e9699"),
    container: containers.blackHoleTab,
   }),

  hawkingUpgrade1: new Upgrade({
   description: "Harness Hawking",
   limit: 100,
   amount: 0,
   costType: "hawking",
   priceFunc: (amount) => 100 * 1.8 ** amount,
   container: containers.hawkingTab,
   effectFunc: (amount) =>
    "Get " + 10 * amount + "% of Hawking Radiation Per Second",
  }),
  hawkingUpgrade2: new Upgrade({
   description: "Hawking Boom",
   limit: 100,
   amount: 0,
   costType: "hawking",
   priceFunc: (amount) => 6 * 10 ** (amount + 2),
   container: containers.hawkingTab,
   effectFunc: (amount) =>
    "x" + (perUpgrade.hawkingUpgrade2 ** amount).formateNumber() + " Hawking Radiation Gain",
  }),
  hawkingUpgrade3: new Upgrade({
   description: "Hawking Diet",
   limit: 100,
   amount: 0,
   costType: "hawking",
   priceFunc: (amount) =>  8 ** (amount + 3),
   container: containers.hawkingTab,
   effectFunc: (amount) =>
    "+" +
    (perUpgrade.hawkingUpgrade3 * amount).formateNumber() +
    " better Diet II base",
  }),
  hawkingUpgrade4: new Upgrade({
    description: "Screw IT!",
    limit: 1,
    amount: 0,
    costType: "hawking",
    priceFunc: (amount) =>  5e5,
    container: containers.hawkingTab,
    effectFunc: (amount) =>
     "x1e10 Mass Gain <br> x10 Hawkings Radiation Gain"
     
   }),
   hawkingUpgrade5: new Upgrade({
    description: "Expansion I",
    limit: 9,
    amount: 0,
    costType: "hawking",
    priceFunc: (amount) => Decimal(2e11).mul(Decimal(1e2).pow(amount**2)),  
    container: containers.hawkingTab,
    effectFunc: (amount) =>
    "+" + perUpgrade.hawkingUpgrade5 * amount + " Better Diet II Limit",
     
   }),
   hawkingUpgrade6: new Upgrade({
    description: "Expansion II",
    limit: 3,
    amount: 0,
    costType: "hawking",
    priceFunc: (amount) => hawkingUpgrade6costs[amount],
    // priceFunc: (amount) => Decimal(2e12).mul(Decimal(1e10).pow(amount)),  
    container: containers.hawkingTab,
    effectFunc: (amount) =>
    "+" + perUpgrade.hawkingUpgrade6 * amount + " Square 'Mass multiply Mass' Limit",
     
   }),
 };
 Upgrades.massUpgrade1.data.effectFunc = (amount) =>
  "+" +
  (
   perUpgrade.massUpgrade1 **
   (amount * 2 * 1.22 ** Upgrades.massUpgrade4.getAmount())
  ).formateNumber(1e3, 2) +
  " base Mass Gain";
 Upgrades.massUpgrade1.data.effectFunc = (amount) =>
  "+" +
  (
   perUpgrade.massUpgrade1 **
   (amount * 2 * 1.22 ** Upgrades.massUpgrade4.getAmount())
  ).formateNumber(1e3, 2) +
  " base Mass Gain";
 Upgrades.massUpgrade1.data.getLimit = (limit) =>
  limit + perUpgrade.massUpgrade5 * Upgrades.massUpgrade5.getAmount();
  Upgrades.massUpgrade2.data.getLimit = (limit) =>
  limit + perUpgrade.hawkingUpgrade5 * Upgrades.hawkingUpgrade5.getAmount();
  Upgrades.massUpgrade6.data.getLimit = (limit) =>
  limit + perUpgrade.hawkingUpgrade6 * Upgrades.hawkingUpgrade6.getAmount();
 Upgrades.massUpgrade2.data.effectFunc = (amount) =>
  "*" +
  (
   Decimal(perUpgrade.massUpgrade2 +
    perUpgrade.hawkingUpgrade3 * Upgrades.hawkingUpgrade3.getAmount()).pow(amount)
   
  ).formateNumber(undefined, 1) +
  " Mass Gain";
 Upgrades.massUpgrade3.data.effectFunc = () =>
  "*" +
  game.mass
   .plus(1)
   .log(3)
   .pow(2 ** Upgrades.massUpgrade6.getAmount())
   .formateNumber() +
  " Mass Gain";
}
