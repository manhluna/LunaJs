jQuery(function(){
	jQuery("#wizard").steps({
        headerTag: "h4",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 300,
        labels: {
            next: "Tiếp Tục",
            previous: "Trở Lại",
            finish: 'Tiến Hành Kiểm Tra'
        },
        onStepChanging: function (event, currentIndex, newIndex) { 
            if ( newIndex >= 1 ) {
                jQuery('.steps ul li:first-child a img').attr('src','Wizard/images/step-1.png');
            } else {
                jQuery('.steps ul li:first-child a img').attr('src','Wizard/images/step-1-active.png');
            }

            if ( newIndex === 1 ) {
                jQuery('.steps ul li:nth-child(2) a img').attr('src','Wizard/images/step-2-active.png');
            } else {
                jQuery('.steps ul li:nth-child(2) a img').attr('src','Wizard/images/step-2.png');
            }

            if ( newIndex === 2 ) {
                jQuery('.steps ul li:nth-child(3) a img').attr('src','Wizard/images/step-3-active.png');
            } else {
                jQuery('.steps ul li:nth-child(3) a img').attr('src','Wizard/images/step-3.png');
            }

            if ( newIndex === 3 ) {
                jQuery('.steps ul li:nth-child(4) a img').attr('src','Wizard/images/step-4-active.png');
                jQuery('.actions ul').addClass('step-4');
            } else {
                jQuery('.steps ul li:nth-child(4) a img').attr('src','Wizard/images/step-4.png');
                jQuery('.actions ul').removeClass('step-4');
            }
            return true; 
        }
    });
    // Custom Button Jquery Steps
    jQuery('.forward').click(function(){
    	jQuery("#wizard").steps('next');
    })
    jQuery('.backward').click(function(){
        jQuery("#wizard").steps('previous');
    })
    // Click to see password 
    jQuery('.password i').click(function(){
        if ( jQuery('.password input').attr('type') === 'password' ) {
            jQuery(this).next().attr('type', 'text');
        } else {
            jQuery('.password input').attr('type', 'password');
        }
    }) 
    // Create Steps Image
    jQuery('.steps ul li:first-child').append('<img src="Wizard/images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="Wizard/images/step-1-active.png" alt=""> ').append('<span class="step-order">Bước 1</span>');
    jQuery('.steps ul li:nth-child(2').append('<img src="Wizard/images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="Wizard/images/step-2.png" alt="">').append('<span class="step-order">Bước 2</span>');
    jQuery('.steps ul li:nth-child(3)').append('<img src="Wizard/images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="Wizard/images/step-3.png" alt="">').append('<span class="step-order">Bước 3</span>');
    jQuery('.steps ul li:last-child a').append('<img src="Wizard/images/step-4.png" alt="">').append('<span class="step-order">Bước 4</span>');
    // Count input 
    jQuery(".quantity span").on("click", function() {

        var jQuerybutton = jQuery(this);
        var oldValue = jQuerybutton.parent().find("input").val();

        if (jQuerybutton.hasClass('plus')) {
          var newVal = parseFloat(oldValue) + 1;
        } else {
           // Don't allow decrementing below zero
          if (oldValue > 0) {
            var newVal = parseFloat(oldValue) - 1;
            } else {
            newVal = 0;
          }
        }
        jQuerybutton.parent().find("input").val(newVal);
    });
})
