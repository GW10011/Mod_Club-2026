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

// ========== 高性能+炫酷烟花核心（更快频率+更大范围） ==========
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

// 设备检测与性能参数（调整后：更快、更多粒子、更大范围）
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
const config = {
    particleCount: isMobile ? 50 : 70, // 爆炸粒子数：移动端50个（更密集）
    autoInterval: isMobile ? 800 : 600, // 自动频率：移动端800ms（更快）
    maxParticles: isMobile ? 250 : 400, // 最大粒子数：适度增加
    fps: isMobile ? 30 : 60, // 帧率不变，保证流畅
    gravity: isMobile ? 0.03 : 0.05 // 重力稍增，粒子下落更自然
};
const FRAME_INTERVAL = 1000 / config.fps;

// 烟花音效（可选）
const fireworkSound = document.getElementById("fireworkSound");
const playSound = () => {
    if (fireworkSound) {
        fireworkSound.currentTime = 0;
        fireworkSound.play().catch(() => {}); // 移动端交互后才能播放，失败不影响
    }
};

// 烟花类型：圆形/心形/星形
const FIREWORK_TYPES = ['circle', 'heart', 'star'];

// 升空轨迹类（调整爆炸高度：更大范围）
class FireworkTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetY = Math.random() * h * 0.6; // 爆炸高度扩大到屏幕60%处
        this.speed = Math.random() * 3 + 2;
        this.alpha = 1;
        this.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*200)},${Math.floor(Math.random()*255)})`;
    }
    update() {
        this.y -= this.speed; // 向上移动
        this.alpha -= 0.005;
        return this.y > this.targetY; // 未到爆炸高度返回true
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 爆炸粒子类（调整爆炸速度：飞得更远）
class FireworkParticle {
    constructor(x, y, type, baseColor) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * config.particleCount/8 + 1.5; // 粒子速度提升，飞更远
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed + config.gravity;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        // 渐变颜色：从亮到暗
        this.r = parseInt(baseColor.split(',')[0].replace('rgb(', ''));
        this.g = parseInt(baseColor.split(',')[1]);
        this.b = parseInt(baseColor.split(',')[2].replace(')', ''));
        this.size = Math.random() * 3 + 1;
        this.type = type; // 烟花形状
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.alpha -= this.decay;
        // 颜色变暗
        this.r = Math.max(0, this.r - 2);
        this.g = Math.max(0, this.g - 2);
        this.b = Math.max(0, this.b - 2);
    }
    draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
        
        // 绘制不同形状
        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'heart': // 简易心形
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.size);
                ctx.bezierCurveTo(
                    this.x - this.size, this.y - this.size,
                    this.x + this.size, this.y - this.size,
                    this.x, this.y + this.size
                );
                ctx.fill();
                break;
            case 'star': // 简易星形
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                    const x = this.x + Math.cos(angle) * this.size;
                    const y = this.y + Math.sin(angle) * this.size;
                    i % 2 === 0 ? ctx.lineTo(x, y) : ctx.quadraticCurveTo(this.x, this.y, x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }
}

// 烟花池：管理升空轨迹和爆炸粒子
let trails = []; // 升空轨迹
let particles = []; // 爆炸粒子

// 创建完整烟花（调整初始位置：更靠近屏幕底部）
function createFirework(x, y) {
    // 随机烟花形状
    const type = FIREWORK_TYPES[Math.floor(Math.random() * FIREWORK_TYPES.length)];
    // 初始Y坐标调整为95%高度，更靠近底部
    const trail = new FireworkTrail(x || Math.random() * w, y || Math.random() * h * 0.95);
    trails.push(trail);
    // 播放音效
    playSound();

    // 监听升空轨迹，到达高度后生成爆炸粒子
    const checkTrail = () => {
        const index = trails.indexOf(trail);
        if (index === -1) return;
        if (!trail.update()) { // 到达爆炸高度
            // 生成爆炸粒子
            const baseColor = trail.color;
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new FireworkParticle(trail.x, trail.y, type, baseColor));
            }
            trails.splice(index, 1); // 移除升空轨迹
            // 限制粒子总数
            if (particles.length > config.maxParticles) {
                particles = particles.slice(-config.maxParticles);
            }
        } else {
            requestAnimationFrame(checkTrail);
        }
    };
    checkTrail();
}

// 自动生成烟花（更快频率）
setInterval(() => {
    createFirework();
}, config.autoInterval);

// 动画循环（帧率节流+高性能渲染）
let lastFrameTime = 0;
function animateFireworks(timestamp) {
    if (timestamp - lastFrameTime < FRAME_INTERVAL) {
        requestAnimationFrame(animateFireworks);
        return;
    }
    lastFrameTime = timestamp;

    // 清画布（半透明保留轨迹，移动端降低透明度减少消耗）
    ctx.fillStyle = isMobile ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, w, h);

    // 绘制升空轨迹
    trails.forEach(trail => {
        trail.draw();
    });

    // 绘制爆炸粒子（反向遍历，快速清理）
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateFireworks);
}
animateFireworks(0);

// ========== 点击/触摸特效（小烟花+爱心） ==========
function createClickEffect(x, y) {
    // 点击位置生成烟花
    createFirework(x, y);
    // 保留原有表情特效
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
    if (headUrls.length === 0) return;
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random()*headUrls.length);
    } while (usedHeadIndexes.includes(randomIndex));
    if (usedHeadIndexes.length >= headUrls.length) usedHeadIndexes = [];
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

// ========== 背景音乐（单次播放+弹窗消失） ==========
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
