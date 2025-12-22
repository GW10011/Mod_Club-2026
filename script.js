// ========== 基础配置 ==========
const members = [
    ["历块",""],
    ["莔币",""],
    ["卿泽","wang卿泽"],
    ["女倬","溯糸"],
    ["少许","少许痛郁泪绪_"],
    ["辰姐","辰宝an"],
    ["小涵","害怕心机女"],
    ["白菜","白菜肉汤包"],
    ["小芊","呆妹小芊"],
    ["小菲","蔫逾"]
];
const wishes = [
    "新年新气象，愿你地铁逃生把把得吃，现实里好运连连！",
    "新的一年，物资捡到手软，快乐多到满溢，每局游戏都尽兴～",
    "愿俱乐部的相聚越来越开心，你生活里事事顺心，新年超幸运！",
    "新岁启封，愿你游戏里落地满配，生活中烦恼清零，天天都开心！",
    "2026，盼我们地铁逃生次次搜刮到顶级物资，稳稳踏上撤离飞机，现实日子也顺风顺水、惊喜连连！"
];

// ========== 祝福弹窗 ==========
let usedMemberIndexes = []; 
function popup() {
    if (usedMemberIndexes.length >= members.length) usedMemberIndexes = [];
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * members.length);
    } while (usedMemberIndexes.includes(randomIndex));
    usedMemberIndexes.push(randomIndex);

    const m = members[randomIndex];
    const showName = m[1] ? `${m[0]}（${m[1]}）` : m[0];
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    const div = document.createElement("div");
    div.className = "popup";
    div.innerHTML = `致 ${showName}：<br/>${randomWish}`;
    div.style.left = Math.random() * 70 + "%";
    div.style.top = Math.random() * 60 + 10 + "%";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}
let popupTimer = setInterval(popup, 2000);

// ========== 豪华烟花核心（修复+升级） ==========
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let w, h;

// 画布适配
function resize() { 
    w = canvas.width = window.innerWidth; 
    h = canvas.height = window.innerHeight; 
} 
resize();
window.addEventListener("resize", resize);

// 烟花粒子类（豪华样式）
class FireworkParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 3; // 粒子速度
        this.gravity = 0.05; // 重力
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005; // 衰减速度
        // 随机渐变颜色
        this.r = Math.floor(Math.random() * 255);
        this.g = Math.floor(Math.random() * 200);
        this.b = Math.floor(Math.random() * 255);
        this.size = Math.random() * 4 + 2; // 粒子大小
    }
    update() {
        // 加入重力效果
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        // 速度衰减
        this.vx *= 0.98;
        this.vy *= 0.98;
        // 透明度衰减
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        // 圆形粒子+渐变
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgb(${this.r},${this.g},${this.b})`);
        gradient.addColorStop(1, `rgba(${this.r},${this.g},${this.b},0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let fireworks = [];
// 创建烟花（自动+点击）
function createFirework(x, y) {
    // 生成更多粒子（豪华效果）
    for (let i = 0; i < 80; i++) {
        fireworks.push(new FireworkParticle(x, y));
    }
}

// 自动生成烟花（频率可调）
setInterval(() => {
    createFirework(Math.random() * w, Math.random() * h * 0.6);
}, 800);

// 动画循环
function animateFireworks() {
    // 半透明遮罩，保留烟花轨迹
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, w, h);
    
    // 更新并绘制所有粒子
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.update();
        p.draw();
        // 移除透明粒子
        if (p.alpha <= 0) fireworks.splice(i, 1);
    }
    requestAnimationFrame(animateFireworks);
}
animateFireworks(); // 启动烟花动画

// ========== 点击/触摸特效（小烟花+爱心） ==========
function createClickEffect(x, y) {
    // 1. 小烟花特效（核心）
    createFirework(x, y);
    
    // 2. 额外爱心/星星特效（可选）
    const effects = ["❤️", "✨", "🎆", "🌟", "🎇"];
    const effect = document.createElement("div");
    effect.className = "click-effect";
    effect.innerText = effects[Math.floor(Math.random() * effects.length)];
    effect.style.left = x + "px";
    effect.style.top = y + "px";
    effect.style.fontSize = Math.random() * 20 + 15 + "px";
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

// ========== 头像漂浮 ==========
const headUrls = [
    "avatars/avatar_01_likuai.jpg",
    "avatars/avatar_02_mengbi.jpg",
    "avatars/avatar_03_qingze.jpg",
    "avatars/avatar_04_nvzhuo.jpg",
    "avatars/avatar_05_shaoxu.jpg",
    "avatars/avatar_06_chenjie.jpg",
    "avatars/avatar_07_xiaohan.jpg",
    "avatars/avatar_08_baicai.jpg",
    "avatars/avatar_09_xiaoqian.jpg",
    "avatars/avatar_10_xiaofei.jpg"
];
let usedHeadIndexes = [];
function createHead() {
    if(headUrls.length === 0) return;
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random()*headUrls.length);
    } while (usedHeadIndexes.includes(randomIndex) && usedHeadIndexes.length < headUrls.length);
    if(usedHeadIndexes.length >= headUrls.length) usedHeadIndexes = [];
    usedHeadIndexes.push(randomIndex);

    const img = document.createElement("img");
    img.src = headUrls[randomIndex];
    img.className = "head";
    img.onerror = () => img.src = "avatars/default.png"; // 修正默认路径
    img.style.left = Math.random()*85 + "%";
    img.style.top = "100%";
    document.body.appendChild(img);
    setTimeout(()=>img.remove(),10000);
}
setInterval(createHead, 2000);

// ========== 背景音乐（核心修改：单次播放+弹窗消失） ==========
const music = document.getElementById("bgm");
const musicTip = document.getElementById("musicTip");
let isMusicInitiated = false; // 标记是否首次触发播放

// 页面加载后尝试自动播放（电脑端）
window.addEventListener('load', () => {
    music.play().then(() => {
        isMusicInitiated = true;
        musicTip.style.opacity = 0; // 隐藏弹窗
        setTimeout(() => musicTip.remove(), 500);
    }).catch(err => {
        console.log("移动端需点击播放：", err);
    });
});

// 点击/触摸统一处理：仅首次点击播放音乐+隐藏弹窗
function handleInteraction(e) {
    // 1. 触发点击特效
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    createClickEffect(x, y);

    // 2. 仅首次点击处理音乐+弹窗
    if (!isMusicInitiated) {
        music.play();
        isMusicInitiated = true;
        musicTip.style.opacity = 0; // 渐变隐藏弹窗
        setTimeout(() => musicTip.remove(), 500); // 移除弹窗DOM
    }
    // 后续点击仅触发特效，不操控音乐
}

// 绑定点击/触摸事件
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction, {passive: true});