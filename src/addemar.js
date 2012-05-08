/**
 * @name Addemar.js
 * @desc Bookmarklet script to help making Template with Addemar
 * @author Stéphan Zych (monkeymonk.be)
 * @version 0.2b
 * @date 2012-05-01
 */
var debugMode = true;
var debug = function(msg){
	if(!debugMode)	return;
	if(window.console && window.console.log)	window.console.log(msg);
	else	alert(msg);
};

var addemar = {
	init: function(s){ debug('init');
		if(s.loaded)	return;
		
		addemar.createPanel.call(this, s);
		
		s.loaded = true;
	}, // init
	
	createPanel: function(s){ debug('createPanel');
		var panelHTML = '<div id="addemarPanel"><form method="post" action="#">'
			+'<fieldset>'
				+'<legend>Path to images</legend>'
				+'<label for="localPath">Local Path</label><input id="localPath" class="text" type="text" name="localPath" value="' + s.localPath + '" /><br/>'
				+'<label for="addemarPath">Addemar Path</label><input id="addemarPath" class="text" type="text" name="addemarPath" value="' + s.addemarPath + '" /><br/>'
			+'</fieldset><fieldset>'
				+'<legend>Highlights</legend>'
				+'<label class="checkbox" for="highlight"><input id="highlight" type="checkbox" name="higlight" value=""' + (s.highlight?' checked="checked"':'') + ' /> Highlight</label><br/>'
			+'</fieldset><fieldset>'
				+'<button class="reload" type="button">Reload</button>'
			+'</fieldset>'
		+'</form>'
		+'<a class="pin" href="#pin">|-</a>'
		+'</div>';
		
		jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + s.panelCSS + '" />');
		jQuery('body').append(panelHTML);
		
		jQuery('#addemarPanel')
		.live('mouseenter', function(e){
			if(!jQuery(this).hasClass('pin'))	jQuery(this).stop().animate({left: 0}, 500);
		})
		.live('mouseleave', function(e){
			if(!jQuery(this).hasClass('pin'))	jQuery(this).stop().animate({left: -347}, 500);
		}).trigger('mouseleave');
		
		jQuery('#addemarPanel .pin')
		.live('click', function(e){
			e.preventDefault();
			if(!jQuery('#addemarPanel').hasClass('pin'))	jQuery('#addemarPanel').addClass('pin');
			else	jQuery('#addemarPanel').removeClass('pin');
		});
		
		jQuery('#addemarPanel input')
		.live('focus', function(){
			jQuery(this).select();
		})
		.live('change', function(){
			var o = jQuery(this), field = o.attr('name');
			if(o.attr('type') != 'checkbox'){
				$('.atag').remove();
				$('.hidetag').removeClass('hidetag');
				s[field] = o.val();
				addemar.swapTag.call(this, s);
			}else{
				s.highlight = !!o.attr('checked');
				if(s.highlight)	$('body').addClass('highlight');
				else	$('body').removeClass('highlight');
			}
		}).trigger('change');
	}, // createPanel
	
	swapTag: function(s){ debug('swapTag');
		var tag = arguments[1] || jQuery('ADDEMAR');
		
		tag.each(function(){
			var o = jQuery(this), a = this.attributes;
						
			switch(a.type.value){
				case 'textarea':
				case 'texteditor':
				case 'texteditor_full':
				case 'texteditor_small':
					var style = o.attr('style'), html = '<div id="' + a.name.value + '" class="' + a.type.value + ' atag">' + o.html() + '</div>';
					break;
					
				case 'link':
				case 'image':
					var html = '';
					if(a.href)	html += '<a id="' + a.name.value + '" class="' + a.type.value + ' atag" href="' + a.href.value + '" title="' + (a.title?a.title.value:'') + '" target="' + (a.target?a.target.value:'') + '" style="' + (a.style?a.style.value:'') + '">';
					
					if(a.src)	html += '<img id="' + a.name.value + '" class="' + a.type.value + ' atag" src="' + a.src.value.replace(s.addemarPath, s.localPath) + '" height="' + (a.height?a.height.value:'') + '" width="' + (a.width?a.width.value:'') + '" alt="' + (a.alt?a.alt.value:'') + '" title="' + (a.title?a.title.value:'') + '" style="' + (a.style?a.style.value:'') + '" />';
					else html += o.html();
					
					if(a.href)	html += '</a>';
					break;
					
				case 'list':
					addemar.swapTag.call(this, s, o.contents().find('ADDEMAR'));
					var html = '<div id="' + a.name.value + '" class="' + a.type.value + ' atag">' + o.html() + '</div>';
					break;
					
				default:
			}

			o.addClass('hidetag')
			.after(html);
		});
		
	}, // swapTag
};

var options = {
	addemarPath: '<?add_userdata?>/Image/7DEL0420/'
	, localPath: '_images/'
	, highlight: true
	
	, panelCSS: 'http://monkeymonk.be/addemarjs/src/addemar.css'
};

window.jQuery || (document.body.appendChild(document.createElement('script')).src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');

(function jQueryLoaded(t){
	if(typeof window.jQuery === "undefined")	setTimeout(function(){jQueryLoaded(t);}, 10);
	else	addemar.init.call(this, options);
})(this);