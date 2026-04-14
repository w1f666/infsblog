---
title: '这份博客支持哪些写作语法'
description: '用一篇真实示例说明当前博客已经支持的 Markdown 能力，方便后续直接写作。'
pubDate: 'Apr 02 2026'
tags: ['Markdown', '写作', '内容工作流']
featured: false
heroImage: '../../assets/blog-placeholder-1.jpg'
---

这篇文章不是占位内容，而是一份可以长期保留的写作参考。以后你在这个博客里写文时，可以直接对照它确认当前支持的语法形式。

## 标题层级

建议每篇文章只保留一个一级标题，也就是 frontmatter 里的 `title`。正文从二级标题开始组织最稳妥。

## 二级标题

### 三级标题

#### 四级标题

## 段落与强调

普通段落直接书写即可。你也可以在文中使用 **加粗**、_斜体_、`行内代码` 来强调重点，但最好克制使用。

## 图片

如果你希望在文章里插图，直接使用标准 Markdown 图片语法即可。

```markdown
![图片说明](../../assets/blog-placeholder-about.jpg)
```

![博客图片示例](../../assets/blog-placeholder-about.jpg)

## 引用

适合在观点文章里引用资料、原话或结论摘要。

> 不要把博客理解成信息堆栈，它更像是一个持续公开的思考索引。

## 表格

表格适合放一些简洁的对比信息，例如技术选型、维护成本或内容形式区别。

| 形式 | 适用场景 | 推荐程度 |
| --- | --- | --- |
| Markdown | 日常写作、教程、笔记 | 高 |
| MDX | 需要混合组件或复杂内容块 | 中 |
| 纯 HTML | 少量特殊排版补充 | 低 |

## 代码块

代码块已经带有统一的深色背景样式，适合写配置和示例代码。

```ts
const post = {
  title: '文章标题',
  tags: ['Astro', '内容'],
  featured: false,
};
```

## 列表

你可以正常使用有序列表和无序列表：

1. 先有提纲
2. 再写摘要
3. 最后补充标题和标签

- 一篇文章只讲一个核心问题
- 摘要要尽量具体
- 标签最好能长期复用

## 额外的内联元素

<abbr title="Graphics Interchange Format">GIF</abbr> 这样的缩写说明也能正常显示。

H<sub>2</sub>O 和 X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup> 这类上下标同样支持。

## 推荐写法

如果你只是写长文、教程和笔记，那么 Markdown 已经足够；如果你要在文章里嵌入定制组件、复杂说明块或后续的 React 交互模块，再考虑 MDX 会更合适。

## Tables

### Syntax

```markdown
| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |
```

### Output

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## Code Blocks

### Syntax

we can use 3 backticks ``` in new line and write snippet and close with 3 backticks on new line and to highlight language specific syntax, write one word of language name after first 3 backticks, for eg. html, javascript, css, markdown, typescript, txt, bash

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```
````

### Output

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## List Types

### Ordered List

#### Syntax

```markdown
1. First item
2. Second item
3. Third item
```

#### Output

1. First item
2. Second item
3. Third item

### Unordered List

#### Syntax

```markdown
- List item
- Another item
- And another item
```

#### Output

- List item
- Another item
- And another item

### Nested list

#### Syntax

```markdown
- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese
```

#### Output

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

## Other Elements — abbr, sub, sup, kbd, mark

### Syntax

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
```

### Output

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
