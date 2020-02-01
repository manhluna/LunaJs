$(document).on('click', "#mailDropdown", function(e) {
    $(this).parent().toggleClass('show');
    $(this).next().toggleClass('show');
    $(this).attr('aria-expanded', true);
});
$(document).on('click', 'body', function(e) {
    if (!$('#ms-nav-options li.dropdown').is(e.target) && $('#ms-nav-options li.dropdown').has(e.target).length === 0 && !$('.btn-add-to-cart').is(e.target) && $('.btn-add-to-cart').has(e.target).length === 0 && $('.show').has(e.target).length === 0) {
        $('#ms-nav-options li.dropdown').removeClass('show');
        $('#ms-nav-options .dropdown-menu').removeClass('show');
        $("#mailDropdown").attr('aria-expanded', false);
    }
});
$(document).on('blur', '[data-uppercase="1"]', function() {
    var th = $(this);
    var val = th.val();
    var string = val.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    th.val(string);
});