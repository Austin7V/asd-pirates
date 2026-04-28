# Backend Template Engines — Nunjucks

## What are template engines?

Template engines move HTML into separate files (templates) with special placeholders that the server fills in at render time. This solves the problem of repeating layout HTML across pages.

**Split of responsibilities:**
- JavaScript/TypeScript — handles data
- Template files — handle presentation

---

## Template syntax

| Syntax | Purpose |
|--------|---------|
| `{{ expression }}` | Output a variable or expression value |
| `{% tag %}` | Control flow: `for`, `if`, `block`, `macro`, etc. |

```html
<h1>{{ title }}</h1>
<ul>
  {% for item in items %}
  <li>{{ item }}</li>
  {% endfor %}
</ul>
```

---

## Setup

```bash
npm install nunjucks
npm install --save-dev @types/nunjucks
```

```ts
import express from "express";
import nunjucks from "nunjucks";

const app = express();

nunjucks.configure("views", {
  autoescape: true,  // prevents HTML injection from user input
  express: app,
});

app.get("/", (req, res) => {
  res.render("index.html", { title: "Home" });
});
```

### VS Code

Install **Better Nunjucks** extension for syntax highlighting in `.html` / `.njk` files.

### Prettier

```bash
npm install --save-dev prettier prettier-plugin-jinja-template
```

`.prettierrc`:
```json
{
  "plugins": ["prettier-plugin-jinja-template"],
  "overrides": [
    {
      "files": ["*.html"],
      "options": { "parser": "jinja-template" }
    }
  ]
}
```

---

## Template inheritance (Layouts)

Write the shared structure once in a base template. Child templates extend it and fill in named blocks.

**`views/base.html`:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>{% block title %}My App{% endblock %}</title>
  </head>
  <body>
    <header>...</header>
    <main>{% block content %}{% endblock %}</main>
    <footer>...</footer>
  </body>
</html>
```

**`views/events.html`:**
```html
{% extends "base.html" %}

{% block title %}Events — My App{% endblock %}

{% block content %}
<h2>Upcoming Events</h2>
{% endblock %}
```

---

## For loops

```html
{% for event in events %}
<div>
  <h3>{{ event.name }}</h3>
  <p>{{ event.date }} — {{ event.location }}</p>
</div>
{% else %}
<p>No upcoming events.</p>
{% endfor %}
```

### Loop variables

| Variable | Value |
|----------|-------|
| `loop.index` | Current position (starts at 1) |
| `loop.index0` | Current position (starts at 0) |
| `loop.first` | `true` on first iteration |
| `loop.last` | `true` on last iteration |
| `loop.length` | Total number of items |

---

## Conditionals

```html
{% if event.soldOut %}
<span>Sold out</span>
{% elif event.spotsLeft < 10 %}
<span>Almost full — {{ event.spotsLeft }} spots left</span>
{% else %}
<span>Tickets available</span>
{% endif %}
```

---

## Macros (reusable components)

Define once, call anywhere. Parameters can have default values.

**`macros/events.html`:**
```html
{% macro eventCard(name, date, location, soldOut=false) %}
<div class="event-card">
  <h3>{{ name }}</h3>
  <p>{{ date }} — {{ location }}</p>
  {% if soldOut %}
  <span class="badge">Sold out</span>
  {% endif %}
</div>
{% endmacro %}
```

**Import and use:**
```html
{% import "macros/events.html" as eventMacros %}

{{ eventMacros.eventCard("React Conf", "June 10, 2025", "Berlin") }}
{{ eventMacros.eventCard("Vue.js Summit", "July 2, 2025", "Amsterdam", true) }}
```

---

## Template engines across languages

| Engine | Language | Notes |
|--------|----------|-------|
| Nunjucks | JavaScript (Node.js) | Modeled on Jinja2 |
| Jinja2 | Python | Standard in Flask / Django |
| EJS | JavaScript | Embeds JS directly in HTML |
| Pug | JavaScript | Indentation-based, no closing tags |
| Twig | PHP | Close to Jinja2 |
| Thymeleaf | Java | Used with Spring |
| Handlebars | JavaScript | Limits logic in templates by design |
