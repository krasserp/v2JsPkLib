(function ( $ ) {
    // ok just setting to pQ to avoid jQuery or $ ()
    window.jQuery = window.pQ = jQuery;
    $.fn.doesExist = function(item){
        return this.length > 0;
    };


    $.fn.imgLoad = function(callback) {
            return this.each(function() {
                if (callback) {
                    if (this.complete || /*for IE 10-*/ $(this).height() > 0) {
                        callback.apply(this);
                    }
                    else {
                        $(this).on('load', function(){
                            callback.apply(this);
                        });
                    }
                }
            });
        };


    $.fn.helper = function(action,options ) {

        // basic IE console error prevention
        if(typeof(console) === 'undefined') {
            console = function(){};
            console.log = function(){
                consoleMsg();
            };
        }
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            from: 0,
            to: 2,
            imgTableCellSelector: '.sq-atm1d-table-cell img',
            imgArr: [ 'http://static.businessinsider.com/image/51963a396bb3f77b52000004/image.jpg',
                        'http://microlancer.lancerassets.com/uploads/service_attachments/7509/thumbnail_agile_mascot-1369328743.jpg',
                        'http://s3.amazonaws.com/wbstaticfiles/users/929/ts_244336_dog-hed-1-bwpng.jpg'
                       ],
            testingMsg : 'Do not rush this testing',
            subBtnSelector: '#btn_continue, #btn_finish',
            vTimeout : 5,
            allowedExtensions : ['.jpg','.png','.doc','docx','.pdf','.gif'],
            extensionErrorMsg : 'Please only upload files of the following file types:',
        },
        options );
        /********************** FIRST some Helpers ************************/
        /**
         * return any value between two values 
         * @from  int
         * @to int
         * @return int
         */
        var randomFromToInterval = function(from,to)
            {
                return Math.floor(Math.random()*(settings.to-settings.from+1)+settings.from);
            };

        
        /**
         * get the input field type
         * @return {string}
         */
        var getType = function()
            {
                return this[0].tagName == "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase();
            };
        /**
         * [enable disable ]
         * @param  {[type]} in 0= off 1= on
         * @return {[type]} nothing
         */
        var disEnableSubmit = function(para){
            var b = $(settings.subBtnSelector);
                if (para===0){
                    b.disable();
                    b.addClass('hidden');
                    console.log('disable',$('#btn_continue').attr('class') );

                } else if (para ===1){
                    b.enable();
                    b.removeClass('hidden');
                }
        };


        /**
         * Card sort auto submit
         * @param  {object} action [enable autosubmit]
         * @return {[type]}        nothing
         */
        if(action==='cardSortAuto'){
            var cardSortAuto = function(obj){
            var qn = obj;
            var $qn = $("div[id^='question_'");
            var $submit_btn = $('.continue');
            var $flash_submit = $('.sq-cardsort-buckets-view');
            $rows = $(".survey-q-grid-rowlegend").size();
            $submit_btn.hide();
            $flash_submit.bind('click', function () {
                         var $lastRow = $qn.find("td input:checked");
                         if ($lastRow.length > ($rows-1)){
                              $submit_btn.click();
                         }
                            });
            $flash_submit.bind('mouseup', function () {
                         var $lastRow = $qn.find("td input:checked");
                         if ($lastRow.length == ($rows-1)){
                              setTimeout(function() {$submit_btn.click();} , 1*1000);
             }
                });

          };

          cardSortAuto(settings.passObj);
        }

        
        /******************************* makeImbBtn ********************************/
        /**
         * call if you want atm1d.6 buttons to be an image // note the items will need to include imges as values // default selector is atm1d.6 class see settings
         * @param  {[type]}
         * @return {[type]}
         */
        if(action ==='makeImbBtn'){
            var  callImgGeneration = function(times){
              var counter = times;
              // give it a rest something is seriously wrong if after 8 times the thing hasn't loaded
              if (times > 8){
                return;
              }
              if($(settings.imgTableCellSelector).length > 1){
                    $(settings.imgTableCellSelector).imgLoad(function(){
                      var imgSrc = $(this).attr('src');
                      $(this).css('display','none');
                      $(this).closest('div').parent().find('.sq-atm1d-btn-bg').css("background-image","url('"+imgSrc+"')");
                      $(this).closest('div').parent().find('.sq-atm1d-btn-bg').css("background-size","cover");
                      // specially for mobile rescale the height of the btns if the image is massive
                      $('.sq-atm1d-table,.sq-atm1d-table-cell,li.sq-atm1d-btn').css('height', $(this).closest('div').parent().find('.sq-atm1d-btn-bg').height());
                    });
              } else {
                setTimeout(function(){callImgGeneration(counter+1);}, 100);
              }
            };
            callImgGeneration(0);
        }

        /**
         * prevent super rushed QA's 
         * @param  none  // change imgs in settings.imgArr
         * @return max fun
         */
        if(action ==='hillarious') {

            var hillarious= function(){
                var alt = false, c = false, imgArr = settings.imgArr,from = 0,to = settings.imgArr.length;
                var number = randomFromToInterval(from, to);
                $(document).keyup(function(e) {
                      if(e.which == 17) {
                        alt = false;
                      }
                });
                $(document).keydown(function(e) {
                      if(e.which == 17) {
                        alt = true;
                      }
                    if(alt && e.which == 39) {
                      $ ('#surveyContent').html(
                        '<div class="pkErrorMsg"> '+settings.testingMsg+' <br> <img src="'+imgArr[number]+'" /><div>');
                    }
                });
            }();
        }


        /************************************* videoSkip ***********************************/
        if(action ==='videoSkip'){
            /**
             * Allows via setting (settings.vTimeout)a timeout to not force the user to view the whole video
             * @return enabled continue or submit btn
             */
            var videoSkip = function(){
                disEnableSubmit(0);
                setTimeout(function() { disEnableSubmit(1);} , settings.vTimeout*1000);
                $('input:checkbox').prop( "checked", true );
                }();
        }

        /************************************ fileExtensionCheck *************************/

        if(action==='fileExtensionCheck'){
            $('input[type="file"]').change(function(){
                var that = $(this);
                fileExtensionCheck(settings.allowedExtensions, that);
              });

            var fileExtensionCheck = function(extensionList, that){
                var extension = that.val().substr(that.length - 5);
                var errorMsg = settings.extensionErrorMsg + extensionList.join();
                if( $.inArray(extension.toLowerCase(), extensionList)== -1){
                  that.addClass('pkErrorMsg');
                  alert(errorMsg);
                  disEnableSubmit(0);
                }
                else{
                  that.removeClass('pkErrorMsg');
                  disEnableSubmit(1);
                }
              };

        }

 
    };
 
}( jQuery ));
