---
title: 'nextjs高版本server action杂谈'
description: '如题'
pubDate: 'Apr 14 2026'
tags: ['Nextjs', '写作', '内容工作流']
featured: false
---

1、nextjs中是如何将server action作为函数props传入子组件中的？
2、在传统的nextjs中，SSR仅有首屏和SEO优势，但是在高版本server action阶段则更加强大
3、在传统nextjs应用中，我们经常使用如下方法进行安全防御，防止经典的网络请求攻击：
cookie中的jwt token和cookie中和localstorgae中共有的csfr token（请求时设置在headers中和cookie中的相比较）鉴权
但是在server action中，这条链路变得不可行了，具体表现为：
Server Action 并不是传统的 API 路由。
在传统的 AJAX/Fetch 请求中，你可以在请求头（Headers）里塞入 X-CSRF-Token。但是，Server Action 抽象了底层的网络请求，Next.js 官方并不推荐（也很难优雅地）在触发 Server Action 时自定义 HTTP Headers。

因此，为了在 Server Action 中实现这个鉴权链路，我们需要把原本放在 Header 中的 CSRF Token，改为作为函数的参数（或 FormData 的一部分）传递。
4、既然nextjs会自动合并fetch请求，那么为什么还需要useabortcontroller来处理竞态请求比如高频滚动
这是一个非常深刻的问题，触及到了前端开发中**网络优化**与**状态一致性**的本质区别。

简单来说：**Next.js 的 `fetch` 自动合并（Request Memoization）是为了“节省资源”，而 `AbortController` 解决竞态请求是为了“保证数据的绝对正确”。**

这两者处理的场景和痛点完全不同。我们可以通过以下三个核心差异来彻底理清为什么有了前者，依然需要后者。

---

### 1. 触发条件不同：相同的请求 vs 不同的请求

**Next.js 的自动合并（Deduplication/Memoization）只针对“完全相同”的请求。**
在 React 树渲染期间，如果遇到 URL 和 options 完全一致的 `fetch` GET 请求，Next.js（依托 React 的机制）会将其拦截，只发送一次网络请求，并将结果共享给所有调用者。
* **适用场景：** 页面顶部导航栏和侧边栏都需要获取 `fetch('/api/user')`，此时合并能避免重复发包。

**高频滚动（如无限滚动、快速切换过滤条件）往往产生的是“不同”的请求。**
当用户高频滚动时，你发送的请求通常带有不同的游标或页码，例如：
* 请求 A：`fetch('/api/data?page=1')`
* 请求 B：`fetch('/api/data?page=2')`
* 请求 C：`fetch('/api/data?page=3')`

因为 URL 参数变了，**Next.js 的缓存和去重机制会直接失效**，它会老老实实地发出这三个独立的请求。

### 2. 核心痛点不同：性能优化 vs 竞态条件 (Race Conditions)

在上述高频滚动的场景中，真正的致命问题不是“发了多少个请求”，而是**“哪个请求先回来”**。

现实中的网络环境是不稳定的（也就是所谓的**竞态条件**）：
1. 用户快速滚动，依次触发了 请求 A (`page=1`)，然后是 请求 B (`page=2`)。
2. 请求 B 数据量小或者命中了 CDN 节点，耗时 50ms，先返回了。前端状态更新为**第 2 页的数据**。
3. 请求 A 遇到了网络波动，耗时 500ms，后返回了。前端状态被覆盖为了**第 1 页的数据**。

**结果：** 用户明明已经滚动到了第 2 页，屏幕上显示的却是第 1 页的数据。UI 状态与用户的预期发生了灾难性的错位。

Next.js 的 `fetch` 合并根本不管请求响应的先后顺序。这时候就需要 **`AbortController`** 登场。

### 3. AbortController 的不可替代性：主动“掐断”过时请求

`AbortController` 的作用是**主动取消（Cancel）** 已经发出但前端不再关心的网络请求。

在高频滚动的场景中加入 `AbortController` 的流程是这样的：
1. 触发 请求 A (`page=1`)，并绑定 `Controller A`。
2. 用户继续滚动，准备触发 请求 B (`page=2`)。
3. **关键动作：** 在发出请求 B 之前，调用 `Controller A.abort()`。
4. 此时，无论请求 A 走到哪一步（哪怕数据已经到了浏览器门口），它都会被直接丢弃，并且对应的 Promise 会抛出一个 `AbortError`，不会触发 `setState`。
5. 前端永远只会渲染最后一次、最新的请求（请求 B）的结果。

---

### 总结对比

为了更直观地理解，可以参考以下对比：

| 特性 | Next.js Fetch 自动合并 | AbortController (中断控制) |
| :--- | :--- | :--- |
| **主要目的** | 提升性能，减少多余网络开销 | 保证 UI 状态正确，防止数据相互覆盖 |
| **生效前提** | URL 和 Request Options **完全一致** | 多次操作触发的请求（URL 相同或不同均可） |
| **作用机制** | **被动缓存**：缓存第一个请求的 Promise 供后续复用 | **主动阻断**：在新请求发生时，强行中止旧请求 |
| **处理目标** | 避免“相同的数据查多次” | 避免“旧的数据覆盖新的数据” |

因此，即使你在使用拥有顶级缓存机制的 Next.js，只要涉及客户端的频繁交互（如搜索框防抖/节流后的输入、高频点击 Tab 切换、无限滚动加载），为了防止出现幽灵般的旧数据覆盖新数据现象，**`AbortController` 依然是处理复杂异步 UI 状态的必要武器。**