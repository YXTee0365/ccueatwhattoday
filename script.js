//==============================
// Google Apps Script API
//==============================

const API =
"https://script.google.com/macros/s/AKfycbw3sfc4u0lmCYjY1rOhk1Vnrg6R0Uo_OfCuVJG2HBsctKYvyK_EeYgKIQJQaXFqyvGCJQ/exec";

let shops = [];
let currentMeal = "";

//==============================
// 判斷目前餐別
//==============================

function getMeal() {

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11)
        return "早餐";

    if (hour >= 11 && hour < 17)
        return "午餐";

    if (hour >= 17 && hour < 21)
        return "晚餐";

    return "宵夜";
}

//==============================
// 更新時間
//==============================

function updateTime() {

    const now = new Date();

    document.getElementById("currentTime").innerHTML =
        `目前時間：${now.toLocaleTimeString("zh-TW")}`;

}

//==============================
// 載入Google Sheet
//==============================

async function loadData() {

    try {

        const response = await fetch(API);

        shops = await response.json();

        randomShop();

    } catch (error) {

        alert("讀取Google Sheet失敗");

        console.error(error);

    }

}

//==============================
// 隨機抽店家
//==============================

function randomShop() {

    const mealList = shops.filter(shop => {

        if (!shop.Meal) return false;

        return shop.Meal.includes(currentMeal);

    });

    if (mealList.length === 0) {

        alert("沒有符合的店家");

        return;

    }

    const randomIndex = Math.floor(Math.random() * mealList.length);

    const shop = mealList[randomIndex];

    document.getElementById("shopName").innerHTML =
        `🍜 ${shop["店名"]}`;

    document.getElementById("shopAddress").innerHTML =
        `📍 ${shop["地址"]}`;

    if (shop["備注"]) {

        document.getElementById("shopNote").innerHTML =
            `📝 ${shop["備注"]}`;

    } else {

        document.getElementById("shopNote").innerHTML = "";

    }

    // Google Maps
    document.getElementById("shopMap").href =
        shop["Google Maps"];

}

//==============================
// 初始化
//==============================

currentMeal = getMeal();

updateTime();

setInterval(updateTime, 1000);

//==============================
// 餐別按鈕
//==============================

document.querySelectorAll(".meal-btn").forEach(btn => {

    if (btn.dataset.meal === currentMeal) {
        btn.classList.add("active");
    }

    btn.onclick = () => {

        document.querySelectorAll(".meal-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentMeal = btn.dataset.meal;

        randomShop();

    }

});

//==============================
// 再抽一次
//==============================

document.getElementById("randomBtn").onclick = randomShop;

//==============================
// 開始
//==============================

loadData();