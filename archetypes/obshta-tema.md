---
title: "{{ replace .Name "-" " " | title }} (обща тема)"
date: {{ .Date }}
draft: false
tags: [ "тема", "обща" ]
description: "
- lit1

- lit2

- lit3
"
---

## Включва

| Произведение | Автор | Жанр |
|--------------|-------|------|
| [лит1]({{< ref "english-name" >}}) | author1 | genre1 |
| [лит2]({{< ref "" >}}) | author2 | genre2 |
| [лит3]({{< ref "" >}}) | author3 | genre3 |

## Тематични връзки

| Тема | lit1 | lit2 | lit3 |
|------|---------------------|-----------------------------|----------------------|
| Tema1 | 111 | 222 | 333 |
| Tema2 | 444 | 555 | 666 |

template for lists inside table:
{{< list "" "" >}}

## Мотиви и ценности (not required)
