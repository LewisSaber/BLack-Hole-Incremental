function loadObject(Original, LoadOne,isDecimal = false) {
 if (Array.isArray(LoadOne)) {
  for (let i = 0; i < LoadOne.length; i++) {
   internal(key);
  }
 } else
  for (const key in LoadOne) {
   internal(key);
  }

 function internal(key) {
  if (typeof LoadOne[key] == "object") {
   Original[key] = loadObject(Original[key], LoadOne[key]);
  } else {
   if (typeof LoadOne[key] == "string" && isDecimal) {
    console.log(LoadOne[key]);
    Original[key] = Decimal(LoadOne[key]);
   } else Original[key] = LoadOne[key];
  }
 }
 return Original;
}

function save(isHardReset = false) {
    console.log("game saved")
    if(!isHardReset)
    {

    
    for(const key in Upgrades){
        game.upgrades[key] = Upgrades[key].getAmount()
      }
    }

 localStorage.setItem("theMIsave", JSON.stringify(game));
}

function load() {
 reset();
 let loadgame = JSON.parse(localStorage.getItem("theMIsave"));
 if (loadgame != null) {
  game = loadObject(game, loadgame,true);
  for(const key in Upgrades){
    Upgrades[key].load(game.upgrades[key])
    
  }
 }

}

Decimal.prototype.formateNumber = function (max = 5, r = 1) {
 if (this.e >= 100000) {
  formatestring = 1 + "ee" + Math.log10(this.e).toFixed(1);
 } else if (this.e >= max) {
  formatestring = this.toExponential(1).replace("+", "");
 } else formatestring = this.toFixed(r, Decimal.ROUND_DOWN);
 return formatestring;
};

Number.prototype.formateNumber = function (max = 1e5,r = 1) {
 if (this.valueOf() >= max) {
  formatestring = this.valueOf().toExponential(1).replace("+", "");
 } else formatestring = this.valueOf().toFixed(r);
 return formatestring;
};
