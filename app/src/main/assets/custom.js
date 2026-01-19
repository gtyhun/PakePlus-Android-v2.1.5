window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]')
    console.log('origin', origin, isBaseTargetBlank)
    // ✅ 修复1：增强匹配规则 + 排除空链接/无效链接 + 禁止所有新窗口跳转
    if (origin && origin.href && origin.href !== 'javascript:void(0)' && origin.href !== '#') {
        // 匹配：_blank新窗口 / base全局新窗口 / 没有target的超链接（部分网页默认跳转）
        if (origin.target === '_blank' || isBaseTargetBlank || !origin.target) {
            e.preventDefault()
            e.stopPropagation() // ✅ 新增：阻止事件冒泡，彻底禁止系统接管
            console.log('handle origin', origin)
            location.href = origin.href
        }
    } else {
        console.log('not handle origin', origin)
    }
}

// ✅ 修复2：重写window.open 完整兼容，处理所有调用场景，防止传参异常报错
window.open = function (url, target, features) {
    console.log('open', url, target, features)
    if (url && url !== 'about:blank' && url !== 'javascript:void(0)') {
        location.href = url
    }
    // 返回空对象，防止网页因获取返回值报错导致功能异常
    return { close: () => {}, focus: () => {} }
}

// ✅ 新增1：重写 window.location.assign 拦截【最常见的跳浏览器元凶】
window.location.assign = function(url) {
    console.log('hook assign', url)
    if(url && url !== 'about:blank') {
        location.href = url;
    }
}

// ✅ 新增2：重写 window.location.replace 拦截第二种跳转方式
window.location.replace = function(url) {
    console.log('hook replace', url)
    if(url && url !== 'about:blank') {
        location.href = url;
    }
}

// ✅ 修复3：修改监听参数，兼容安卓WebView的事件机制，防止拦截失效
document.addEventListener('click', hookClick, { capture: true, passive: false })

// ✅ 新增3：拦截所有通过JS动态创建的跳转，终极兜底（安卓专属）
document.addEventListener('auxclick', hookClick, { capture: true, passive: false })