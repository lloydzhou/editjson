(function($){  
	var defaults = {  
		separator:' : ',
		tag: 'span', 
		keyClass: 'key', 
		valueClass: 'val',
		buttonTag: 'a',
		addButton: 'add after this node',
		addButtonClass: 'add',
		addButtonTitle: 'add after this node',
		insertButton: 'insert to this node',
		insertButtonTitle: 'insert to this node',
		insertButtonClass: 'insert',
		deleteButton: 'delete this node',
		deleteButtonClass: 'delete',
		deleteButtonTitle: 'delete this node',
		
		/*callback function to validate the user input.*/
		validate: function (val){return ('' != val) && (!/[\{\}]+/.test(val));},
		edit: {},
		data: {}
	}, _w = function(v, w, c, t){w = w||defaults.tag;
		return ['<', w, (c ? ' class="'+c+'"' : ''),(t ? ' title="'+ t +'"' : ''),  '>',v ,'</', w, '>'].join('');
	}, _t = function(d, k, o){
		o = o || defaults;
		var sp = o.separator, w = o.tag;
		k = (k ? _w(k, w, o.keyClass) : '');
		if (typeof d == 'object') {
			var s = ''; for(var i in d) s += _t(d[i], i, o);
			return '<li>__<ul>_</ul></li>'.replace('__', k).replace('_', s);
		}
		return '<li>' + k + sp + _w(d, w, o.valueClass) +'</li>';
	}, _j = function (o){
		var r = {}, w = (o && o.tag) || defaults.tag;
		$.each($(this).children(), function (i,n){
			var c = $(n).children('ul');
			if (c.length > 0) {
				var k_ = $(n).children(w+':first').text(), k = k_ ? k_ : i;
				r[k] = _j.call(c, o);
			} else {
				var k = $(n).children(w+':first').text(), v = $(n).children(w+':eq(1)').text();
				r[k] = v ? v : k;
			}
		})
		return r;
	}, _e = function (o){
		o = o|| defaults;
		$(this).one('dblclick', function (){
			var obj = this, oldval = $(obj).text();
			$(obj).html($('<input value="' + oldval +'"/>')).children().focus().blur(function(){
				var val = $(this).val();
				_e.call($(obj).html(o.validate(val) ? val : oldval), o)
			});
		})
	}, _h = function (o){
		o = o || defaults;
		var w = o.tag, bw = o.buttonTag, 
			ac = o.addButtonClass, ic = o.insertButtonClass, dc = o.deleteButtonClass,
			ab = o.addButton, ib = o.insertButton, db = o.deleteButton,
			at = o.addButtonTitle, it = o.insertButtonTitle,  dt = o.deleteButtonTitle;
		$(this).hover(function (){
			var obj = this;
			if ($(obj).children(bw).length < 1) {
				$(_w(db,bw, dc, dt)).insertAfter($(obj).children(w+':last')).click(function (){
					if ($(obj).parent().children().length == 1) {
						$(obj).children(':eq(1)').insertAfter($(obj).parent().parent().children(w+':first'));
						$(obj).parent().remove();
					}
					else $(obj).remove();
				})
				if ($(obj).children('ul').length < 1)
				$(_w(ib,bw, ic, it)).insertAfter($(obj).children(w+':last')).click(function (){
					$(obj).html($(_t({key:$(obj).children(w+':eq(1)').text()}, $(obj).children(w+':first').text(), o)).html());
					$(obj).find(w)._editor(o);
					$(obj).find('li')._hover(o);
				})
				$(_w(ab,bw, ac, it)).insertAfter($(obj).children(w+':last')).click(function (){
					$(_t('value','key', o)).insertAfter(obj)._hover(o).children(w)._editor(o);
				})
				
			}
		}, function (){
			$(this).children([bw, '.', ac, ',', bw,'.', ic, ',', bw,'.', dc].join('')).remove()
		})
	};
    $.fn.extend({
        jsonEditor: function(options) {  
			var o = $.extend(defaults, options);
            return this.each(function() {  
				$(this).data('option', o);
				$(this).html(_t(o.data, 'data', o));
				$(this).find(o.tag)._editor(o)
				$(this).find('li')._hover(o)
            });  
        }, _editor: function (o){
			return this.each(function() {  
				_e.call(this, o);
			})
		},	_hover: function (o){
			return this.each(function() {  
				_h.call(this, o);
			})
		}, toJson: function (){
			return _j.call(this, $(this).data('option'));
		}
    });  
})(jQuery);  