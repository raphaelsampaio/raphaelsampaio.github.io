---
layout: default
---

<h1>Últimos posts</h1>

<ul>
    {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <p>{{ post.summary }}</p>
    </li>
    {% endfor %}
</ul>