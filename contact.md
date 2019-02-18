---
layout: default
---

<div class="row">
    <div class="column">
        <h1>Sou todo ouvidos!</h1>
        <p>Então quer dizer que tem algo interessante por aqui? Eba! Deixa uma mensagem me contando como posso te ajudar e prometo responder bem rápido!</p>
        <p>Se sua mensagem não couber aqui do lado, fica a vontade pra só mandar um 'oi' e eu respondo por e-mail :)</p>
    </div>
    <div class="column">
        <form id="contact-form" target="_self" method="post" action="https://qhzigh4g20.execute-api.us-west-2.amazonaws.com/latest/contact">
            <input required placeholder="nome" type="text" name="name"><br/>
            <input required placeholder="e-mail" type="email" name="email"><br/>
            <input required placeholder="assunto" type="text" name="subject"><br/>
            <textarea maxlength="2500" required placeholder="mensagem" name="message" rows='20'></textarea><br/>
            <input type="submit">
        </form>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.3.1.min.js" 
integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
crossorigin="anonymous"></script>
<script type="text/javascript" src="/assets/js/form.js"></script>