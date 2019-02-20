---
layout: post
title:  "Site de graça usando GitHub Pages + Jekyll e formulário de contato com AWS Lambda e SES"
summary: "Aqui tem almoço de graça sim! Construí meu site com blog e tudo gastando 0 talkeis ou jairs, como queira, usando quatro ingredientes: GitHub Pages pra me prover hospedagem, Jekyll pra gerar os arquivos estáticos (HTML, CSS, JS, imagens), AWS SES pra me mandar e-mail quando algum cidadão enviasse uma mensagem usando o formulário e AWS Lambda pra executar esse código de envio de e-mail sem precisar de um servidor."
author: Raphael Sampaio
date:   2019-02-17 18:35:00 -0200
categories: tech
---

Salve discípulos d'**o Mito** ou detratores d'**#ELENÃO**. Nossas diferenças políticas se anulam quando, como bons brasileiros, observamos aquela **pechinchinha dos justos**. 

Nossos olhos antes tristonhos como os de David Luiz agora brilham alegremente ao perceber que sim, nós podemos (2008; OBAMA, Barack) criar um site com blog (ou **brogue**) e formulário de contato de forma gratuita.

<img src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/idontbelieveyou.gif" class='center'>

O site em si será construído com aquilo que a web tem de melhor: HTML, CSS e JS. No entanto, vamos contar com a ajuda do nosso amigão [Jekyll](https://jekyllrb.com/), uma verdadeira mão na roda se quisermos incluir um **brogue** no nosso site. 

Hospedaremos no [GitHub Pages](https://pages.github.com) por quatro motivos: o primeiro e mais importante é o fator preço, afinal isso vai nos custar zero, nada, **nothing**; o segundo é a facilidade de **deploy** da nossa aplicação, pois um `git push` será suficiente. Além disso, você pode usar um domínio próprio (no meu caso **raphaelsampaio.com**) e se apontar seu endereço pros [servidores certos do GitHub](https://help.github.com/articles/setting-up-an-apex-domain/#configuring-a-records-with-your-dns-provider) na interface do seu provedor de DNS (eu uso o [Namecheap](https://namecheap.com)), terá um certificado [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) gratuito. Ou seja, seu site vai transmitir informações criptografadas usando [HTTPS](https://en.wikipedia.org/wiki/HTTPS), o que aumenta consideravelmente a segurança dos usuários do dito cujo.

Acho que se você tem um site seu objetivo é que as pessoas te encontrem e entrem em contato. Existem algumas opções pra isso:
* Colocar seu e-mail no site usando um link HTML com **mailto**
    * Vantagem: facilidade. Em 10 segundos você coloca isso no site e pronto. 
    * Desvantagens: revelar seu e-mail pro mundo (prepare-se pra receber **spam**) e forçar o usuário a abrir o Outlook ou Gmail pra te mandar uma mensagem.

```html
<a href="mailto:alguem@seusite.com">Mande um e-mail!</a>  
```
* Empresas que ofereçam **form as a service**, tipo a [Formspree](https://formspree.io).
    * Vantagem: muito fácil de integrar.
    * Desvantagens: continua revelando seu e-mail, embora de forma mais escondida, afinal só quem abrir o inspetor do browser vai encontrá-lo. Além disso, o plano gratuito pode não atender suas necessidades e você vai precisar pagar.

* Plataformas de integração, por exemplo [DataFire](https://datafire.io) e [Zapier](https://zapier.com).
    * Vantagem: não revela seu e-mail e é possível customizar.
    * Desvantagens: não tão fácil de integrar. Customização exige trabalho.
* Construir um formulário de contato com seu próprio **backend**.
    * Vantagem: não revela seu e-mail e é possível customizar; se você for desenvolvedor te permite aprender coisas bem legais, por exemplo [AWS SES](https://aws.amazon.com/ses/) pra envio de e-mails e [AWS Lambda](https://aws.amazon.com/lambda/) pra que a gente não tenha que se preocupar em manter servidores EC2(https://aws.amazon.com/ec2/).
    * Desvantagens: dá mais trabalho.

## Criando o site com brogue

Já temos na blogosfera diversos tutoriais sobre [como criar um blog usando GitHub Pages + Jekyll](https://www.google.com/search?q=como+criar+blog+github+pages&oq=como+criar+blog+github+pages&). Mesmo assim vou deixar aqui, de forma resumida, um passo a passo:

### GitHub Pages: seu site de graça
1. Crie uma conta no [GitHub](https://github.com)
2. Crie um repositório no GitHub chamado `NOME.github.io`. No meu caso, o domínio é `raphaelsampaio.com` então o repositório ficou `raphaelsampaio.github.io`.
3. Em `Settings > Github Pages`, escolha a `master branch` como **Source**. Salve.
4. Faça o commit de algum arquivo **HTML** pra testar e acesse `NOME.github.io`. Não deu certo? [Me dá um toque](/contact.html) e eu atualizo o brogue.

### Jekyll: adicionando o brogue 
1. Baixe o gerenciador de versões do Ruby [rvm](https://rvm.io/) e instale (opcional, porém recomendado). Siga as instruções e se não tiver `gpg` instalado e usar macOS, instale via [Homebrew](https://brew.sh): `brew install gnupg`.

2. Instale Ruby (opcional, porém recomendado)
```bash
rvm install 2.6 # substitua 2.6 pela versão estável mais recente do Ruby
```

3. Crie uma [gemset](https://rvm.io/gemsets/basics) exclusiva pra uso nesse projeto (opcional, porém recomendado)
```bash 
rvm gemset use raphaelsampaio.github.io --create 
# uso sempre uma gemset com nome idêntico ao da pasta/repositório Git
```

4. Baixe o Jekyll
```bash
gem install bundler jekyll -N
```

5. Crie o projeto
```bash
jekyll new . --force # inclua a flag de force caso você tenha um diretório não vazio
```

6. Explore a documentação do Jekyll, dispare um servidor local em `http://localhost:4000` usando `jekyll serve` e divirta-se

## Adicionando um formulário de contato

Maraviiiilha, Alberto! Agora você já deve ter um site com uma página index e se convencido de que não é uma boa ideia revelar seu e-mail pro mundo. Então precisamos criar uma página nova no nosso site que **muito criativamente** chamaremos de **contact.md**. Nela vai o seguinte código:
```html
---
layout: default
---

<form id="contact-form" target="_self" method="post" action="URL_DO_SEU_BACKEND">
    <input required placeholder="nome" type="text" name="name"><br/>
    <input required placeholder="e-mail" type="email" name="email"><br/>
    <input required placeholder="assunto" type="text" name="subject"><br/>
    <textarea maxlength="2500" required placeholder="mensagem" name="message" rows='20'></textarea><br/>
    <input type="submit">
</form>
```

Perceba que o trabalho pesado de criar a tag `<html>`,`<head>` e importar scripts CSS e JS fica todo no layout default, dentro da pasta `/_layouts/default.html`. 

Um exemplo bem tosco de layout seria:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Descrição maravilhosa"/>
    <title>Meu site lindo</title>
    <link rel="stylesheet" type="text/css" href="/assets/css/styles.css">
</head>
<body>
    {% raw %}{{content}}{% endraw %}
</body>
</html>
```

O Jekyll fica então encarregado de renderizar uma página HTML `contact.html` substituindo o `{% raw %}{{content}}{% endraw %}` pelo código do seu **form** e o resultado é:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Descrição maravilhosa"/>
    <title>Meu site lindo</title>
    <link rel="stylesheet" type="text/css" href="/assets/css/styles.css">
</head>
<body>
    <form id="contact-form" target="_self" method="post" action="URL_DO_SEU_BACKEND">
        <input required placeholder="nome" type="text" name="name"><br/>
        <input required placeholder="e-mail" type="email" name="email"><br/>
        <input required placeholder="assunto" type="text" name="subject"><br/>
        <textarea maxlength="2500" required placeholder="mensagem" name="message" rows='20'></textarea><br/>
        <input type="submit">
    </form>
</body>
</html>
```

Já diria Sócrates, por volta de 400 a.C, ainda que não soubesse programar:
> <img class='small-img' src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/socrates.jpg" alt="socrates" width="200"/> Loko é poko

Antes de partir pro código **backend**, vamos colocar um script JS no nosso site pra interceptar o envio do form e mandar um **HTTP [POST]** pro servidor via [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)):

```js
var formSubmit = function(form) {
    var url = form.attr('action');
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(), // envio como x-www-form-urlencoded
        dataType: 'text', // resposta do servidor vazia exige 'text'
        success: function(data) {
            alert("Obrigado pela mensagem! Redirecionando para a página principal...");
            window.location.href='index.html';
        },
        error: function(e) {
            console.error(e)
            alert("Alguma coisa deu errado! Verifique se todos os campos do formulário foram preenchidos");
        }
    });
    return false;
}

$(document).ready(function() {
    $("#contact-form").submit(function(e) {
        e.preventDefault();
        formSubmit($(this));
    });
})
```


### Enviando um e-mail quando alguém mandar mensagem

Bom, se você sabiamente escolheu esconder seu e-mail dos **spammers**, então nos restam duas alternativas: integrar via plataforma ou criar nosso próprio backend. Lembrando que a primeira opção é mais fácil, porém menos customizável, enquanto a segunda é mais difícil, mas mais flexível e de quebra nos **oportuniza** (TITE; 2018) aprender a usar as tecnologias AWS SES e Lambda.

Então vamos entrar no bonde da Amazon sem freio e adicionar habilidades ao nosso leque.

Ao usar o AWS Lambda a gente pode escrever código **backend** sem se preocupar em provisionar um servidor pra rodá-lo. Essa é a tal da tecnologia **serverless** que anda na moda hoje com microsserviços. O melhor amigo do Lambda é o framework [express.js](https://expressjs.com). Com ele vamos escrever de forma fácil e rápida um servidor HTTP capaz de receber um POST contendo os dados do formulário e nos enviar um e-mail.

Instalar o express é bem simples. Caso você não tenha `npm` instale através do gerenciador de pacotes do seu sistema operacional. No meu caso, uso o `homebrew`:
```bash
brew install npm
```

Depois instale o `express.js`
```bash
npm install express --save
```

Agora veja como é simples o código do servidor:

```js
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/contact', function(req, res) {
    sendEmail(req.body).then(function(data){
        res.status(200).end()
    }).catch(function(err) {
        res.status(500).end()
    })
})

app.listen(port, () => log.info(`Example app listening on port ${port}!`))
```

<img src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/claps.gif" alt='claps' class='center'>

Ao submetermos um HTTP POST com cabeçalho `Content-Type=application/x-www-form-urlencoded`, como é o caso de chamadas AJAX, pra rota **/contact**, enviaremos um e-mail baseado no corpo da nossa requisição e se tudo der certo retornaremos uma resposta vazia com código HTTP 200. Caso tomemos algum 7 a 1, respondemos HTTP 500.

Observe que a única função a implementar é a `sendEmail`. No nosso caso usaremos o SES pra isso, mas nada te impediria de usar outro serviço escrevendo sua própria `sendEmail`.

Pra usar o SES, precisamos:
* instalar a SDK
```bash
npm install aws-sdk --save
```

* importar a biblioteca da AWS pra JavaScript 
```js 
const aws = require('aws-sdk')
```

* instanciar o SES 
```js 
const ses = new aws.SES({apiVersion: '2010-12-01'})
``` 
* e enviar o email: 

```js
var sendEmail = function(reqBody) {
    return ses.sendEmail({
        Destination: { ToAddresses: [process.env.EMAIL_DESTINATION]},
            Message: { 
            Body: { Text: { Charset: "UTF-8", Data: reqBody.message } },
            Subject: { Charset: 'UTF-8', Data: reqBody.subject }
        },
        Source: process.env.EMAIL_SOURCE,
        ReplyToAddresses: [reqBody.email]
    }).promise()
}
```

Essas variáveis `process.env.EMAIL_DESTINATION` e `process.env.EMAIL_SOURCE` visam esconder seu e-mail de origem (por exemplo `mailbot@SEUDOMINIO`) e destino (por exemplo seu Gmail pessoal). Elas são criadas no console do AWS Lambda como variáveis de ambiente e ficam a disposição do seu script em tempo de execução.

Testar a sua aplicação localmente é muito simples. Após ter criado uma conta na AWS, configurado o SES e supondo que seu código esteja num arquivo chamado `contact.js`, basta rodar `node contact.js`. O servidor HTTP estará disponível pra uso em `http://localhost:3000`. 

Recomendo testar através de um cliente HTTP como o [Advanced REST Client](https://install.advancedrestclient.com/install). Se tiver dúvidas na configuração do SES, pode [entrar em contato](/contact) que eu te ajudo :)

### Deploy do código no AWS Lambda

Um ajuste é necessauro pra que possamos tirar o código da nossa máquina, colocando-o à disposição do mundo, na AWS. Ao invés de disparar um servidor local através da instrução 
```js
app.listen(port, () => log.info(`Example app listening on port ${port}!`))
```
precisamos da instrução
```js
module.exports = app
```

Pô, Rapha, se eu fizer isso eu perco meu servidor local. Como vou testar a aplicação localmente? É verdade, meu/minha parça. Pra isso você vai trocar o nome do seu arquivo local pra `contact.local.js` e criar um script de `build` da sua aplicação que vai pegar o `contact.local.js`, copiar o conteúdo pra um arquivo `contact.js` e substituir a linha `app.listen...` por `module.exports = app`. Além de trazer sua aplicação local de volta do mundo dos mortos, você ainda estará exercitando seu músculo DevOps. Isso me lembra quando conheci o Desenvolvedor Maromba, que me disse as seguintes frases:


> FICA INDO NA ACADEMIA E SÓ TRABALHA BRAÇO? DEPOIS FICA COM AS PERNAS FINAS!

> FICA ESCREVENDO SÓ CÓDIGO DE APLICAÇÃO? DEPOIS JOGA PRO TIME DE DEVOPS A RESPONSA!

<img alt='desenvolvedor maromba' class='center' src="https://media1.tenor.com/images/887592adce8be1fe953796df817676ed/tenor.gif?itemid=3535756">

O jeito mais bonito que eu vejo de criar um script de `build` é através de uma ferramenta desenvolvida quando os dinossauros ainda habitavam este planeta, poucos dias após Steve Jobs e Steve Wozniac fundarem a Apple, em abril de 1976. Tô falando dela mesma: Make!

```bash
# Makefile
build:
    cp contact.local.js contact.js
    sed -i '' 's/app\.listen.*//g' contact.js
    echo 'module.exports = app' >> contact.js
```

Voilà, mes amis! Rodando `make build` teremos nosso arquivo `contact.js` pronto pra ir pra AWS Lambda.

Agora, pro deploy em si usaremos uma ferramenta sensacional cujo nome não é Jennifer, mas é [Claudia](https://claudiajs.com).

São dois passos, retirados [desse blog post](https://medium.freecodecamp.org/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35):

1. A geração de um wrapper AWS Lambda (arquivo `lambda.js`):
```bash
claudia generate-serverless-express-proxy --express-module contact
```

2. Primeiro deploy (eu uso a região de Oregon na Amazon, ou seja `us-west-2`)
```bash
claudia create --handler lambda.handler --deploy-proxy-api --region us-west-2
```

Deploys subsequentes podem ser realizados através do comando `claudia update`.

Tanto o comando `claudia create` quanto o `claudia update`, caso bem sucedidos, retornarão um JSON contendo a URL do seu backend. É só copiá-la e colar na `action` do seu form :)

```json
{
  "lambda": {
    "role": "awesome-serverless-expressjs-app-executor",
    "name": "awesome-serverless-expressjs-app",
    "region": "eu-central-1"
  },
  "api": {
    "id": "iltfb5bke3",
    "url": "https://iltfb5bke3.execute-api.eu-central-1.amazonaws.com/latest"
  }
}
```

Confesso que a primeira vez que rodei esses comandos nada deu certo. Eram problemas de autenticação na AWS, os quais solucionei com a seguinte `Policy`, carinhosamente chamada de `DeployExpressLambda`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:*",
                "apigateway:*",
                "lambda:*",
                "ses:*"
            ],
            "Resource": "*"
        }
    ]
}
```

Crie essa Policy entrando no AWS Console, depois escolha o serviço IAM. Vá em `Policies > Create Policy > JSON` e cole o trecho acima.

Depois, vá em `IAM > Groups`, escolha o grupo apropriado (ou crie um se não tiver) e na aba `Permissions` clique em `Attach Policy`. Busque a Policy `DeployExpressLambda`, selecione-a e clique em `Attach Policy`.

Pronto, agora tudo deve estar funcionando. Caso não esteja, [por favor me avisa](/contact) e eu corrijo esse post.

## Fim

Bem amigos do nosso blog (BUENO, GALVÃO; *circa* 1900), por hoje é só! 

<img alt='galvão' class='center' src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/acabou.gif">

Aprendemos a montar um site de graça, incluindo blog e formulário de contato. De quebra, ainda aprendemos a usar tecnologias da AWS e praticamos nosso músculo DevOps. Eu e o Desenvolvedor Maromba ficamos orgulhosos. As empresas que nos contratam mais felizes; demos alegria ao povo brasileiro e há rumores de que até David Luiz sorriu.

<img alt="david sorriu" class='center' src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/perfect.gif">

O [código do site](https://github.com/raphaelsampaio/raphaelsampaio.github.io) e da [API de envio de e-mail](https://github.com/raphaelsampaio/website-contact-api) estão disponíveis no GitHub pra que vocês usem e abusem.

Qualquer problema ou dúvida, [avisaê](/contact).