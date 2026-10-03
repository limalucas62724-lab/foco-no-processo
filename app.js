const KEY="fnp_v2";
const defaults={name:"",currentWeight:78.5,initialWeight:78.5,targetWeight:70,waterGoal:2,water:0,meals:[],workouts:0,weights:[],note:"",mood:"",challengeDays:0};
let S=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaults);
function save(){localStorage.setItem(KEY,JSON.stringify(S));render();}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1900)}
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll(".nav button").forEach(x=>x.classList.toggle("active",x.dataset.go===id));window.scrollTo(0,0)}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("notifyBtn").onclick=()=>toast("Você está no controle do seu processo 💚");

function render(){
  document.getElementById("helloName").textContent=S.name||"você";
  document.getElementById("currentWeight").textContent=(S.currentWeight||0).toFixed(1)+" kg";
  document.getElementById("targetWeight").textContent=(S.targetWeight||0).toFixed(1)+" kg";
  const total=Math.max(Math.abs((S.initialWeight||0)-(S.targetWeight||0)),.1), done=Math.max(0,Math.abs((S.initialWeight||0)-(S.currentWeight||0)));
  const pct=Math.min(100,Math.round(done/total*100));
  document.getElementById("remainingWeight").textContent=Math.max(0,Math.abs((S.currentWeight||0)-(S.targetWeight||0))).toFixed(1)+" kg";
  document.getElementById("goalRing").style.setProperty("--p",pct+"%");
  document.getElementById("goalPct").textContent=pct+"%";
  const glasses=Math.round((S.water||0)*4);
  document.getElementById("waterQuick").textContent=glasses+" / "+Math.round((S.waterGoal||2)*4);
  document.getElementById("mealQuick").textContent=S.meals.length+" refeições";
  document.getElementById("workoutQuick").textContent=S.workouts+" min";
  document.getElementById("daysQuick").textContent=S.weights.length+" registros";
  const wp=Math.min(100,(S.water||0)/(S.waterGoal||2)*100);
  document.getElementById("waterBar").style.width=wp+"%"; document.getElementById("waterBarText").textContent=Math.round(wp)+"%";
  const hp=Math.min(100,(S.meals.length+S.workouts>0?100:0)); document.getElementById("habitBar").style.width=hp+"%"; document.getElementById("habitBarText").textContent=hp+"%";
  document.getElementById("waterLiters").textContent=(S.water||0).toFixed(2).replace(".",",");
  document.getElementById("waterGoal").textContent=(S.waterGoal||2).toFixed(1).replace(".",",");
  document.getElementById("waterLitersBar").style.width=wp+"%";
  document.getElementById("mealCount").textContent=S.meals.length;
  document.getElementById("dailyNote").value=S.note||"";
  document.getElementById("initialStat").textContent=(S.initialWeight||0).toFixed(1)+" kg";
  document.getElementById("currentStat").textContent=(S.currentWeight||0).toFixed(1)+" kg";
  document.getElementById("lossStat").textContent=((S.currentWeight||0)-(S.initialWeight||0)).toFixed(1)+" kg";
  document.getElementById("nameInput").value=S.name||""; document.getElementById("profileWeight").value=S.currentWeight||"";
  document.getElementById("profileTarget").value=S.targetWeight||""; document.getElementById("profileWater").value=S.waterGoal||"";
  document.getElementById("challengeBar").style.width=Math.min(100,S.challengeDays/7*100)+"%";
  document.getElementById("challengeText").textContent=S.challengeDays+" / 7 dias";
  document.getElementById("meals").innerHTML=S.meals.length?S.meals.map((m,i)=>`<div class="historyitem"><span>${m.time} · ${m.name}</span><button class="textbtn" onclick="removeMeal(${i})">Excluir</button></div>`).join(""):`<p class="muted">Nenhuma refeição registrada ainda.</p>`;
  document.getElementById("weightHistory").innerHTML=S.weights.length?S.weights.slice().reverse().map(w=>`<div class="historyitem"><span>${w.date}</span><b>${Number(w.value).toFixed(1)} kg</b></div>`).join(""):`<p class="muted">Registre seu primeiro peso.</p>`;
  document.getElementById("challengeList").innerHTML=[
    ["💧","Beba sua meta de água","Registre sua hidratação diariamente."],
    ["🏃","Movimente-se","Faça pelo menos 15 minutos de atividade."],
    ["🥗","Uma escolha consciente","Registre uma refeição e reflita sobre ela."]
  ].map(x=>`<div class="listcard"><span>${x[0]}</span><div><b>${x[1]}</b><small>${x[2]}</small></div></div>`).join("");
}
window.removeMeal=i=>{S.meals.splice(i,1);save();toast("Refeição removida")};
document.getElementById("addMeal").onclick=()=>{const n=prompt("Qual refeição você quer registrar?");if(n){S.meals.push({name:n,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});save();toast("Refeição registrada!")}};
document.getElementById("saveNote").onclick=()=>{S.note=document.getElementById("dailyNote").value;save();toast("Nota salva!")};
document.querySelectorAll("[data-mood]").forEach(b=>b.onclick=()=>{S.mood=b.dataset.mood;save();toast("Humor registrado "+S.mood)});
document.querySelectorAll("[data-water]").forEach(b=>b.onclick=()=>{S.water=Math.min((S.water||0)+Number(b.dataset.water)/1000,(S.waterGoal||2)*2);save();toast("Hidratação atualizada 💧")});
document.getElementById("resetWater").onclick=()=>{S.water=0;save();toast("Contador zerado")};
document.querySelectorAll(".workout").forEach(b=>b.onclick=()=>{S.workouts+=Number(b.dataset.min);S.challengeDays=Math.min(7,S.challengeDays+1);save();toast("Treino registrado! 🏃")});
document.getElementById("startWalk").onclick=()=>{S.workouts+=30;S.challengeDays=Math.min(7,S.challengeDays+1);save();toast("30 minutos registrados! 💪")};
document.getElementById("saveWeight").onclick=()=>{const v=Number(document.getElementById("weightInput").value);if(!v||v<20||v>400){toast("Digite um peso válido");return}S.currentWeight=v;if(!S.initialWeight)S.initialWeight=v;S.weights.push({value:v,date:new Date().toLocaleDateString("pt-BR")});save();document.getElementById("weightInput").value="";toast("Peso salvo!")};
document.getElementById("saveProfile").onclick=()=>{S.name=document.getElementById("nameInput").value.trim();S.currentWeight=Number(document.getElementById("profileWeight").value)||S.currentWeight;S.targetWeight=Number(document.getElementById("profileTarget").value)||S.targetWeight;S.waterGoal=Number(document.getElementById("profileWater").value)||S.waterGoal;if(!S.initialWeight)S.initialWeight=S.currentWeight;save();toast("Perfil atualizado!")};
document.getElementById("clearData").onclick=()=>{if(confirm("Apagar todos os dados deste aparelho?")){localStorage.removeItem(KEY);S=structuredClone(defaults);render();toast("Dados apagados")}};
document.getElementById("premiumBtn").onclick=()=>toast("Premium: pagamento será conectado na versão de publicação.");
document.querySelectorAll("[data-foodtab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-foodtab]").forEach(x=>x.classList.toggle("active",x===b));document.getElementById("foodTips").classList.toggle("hidden",b.dataset.foodtab!=="tips");document.getElementById("foodRecipes").classList.toggle("hidden",b.dataset.foodtab!=="recipes")});
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
render();
