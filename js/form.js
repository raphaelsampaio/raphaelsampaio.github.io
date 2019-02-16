var formSubmit = function(form) {
    var url = form.attr('action');
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        dataType: 'text',
        success: function(data) {
            alert("Obrigado pela mensagem! Redirecionando para a página principal...");
            window.location.href='index.html';
        },
        error: function(e) {
            console.error(e)
            alert("Alguma coisa deu errado! Verifique se todos os campos do formulário foram preenchidos");
            // window.location.href='index.html';
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