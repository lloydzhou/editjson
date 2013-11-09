(function($){  
	var defaults = {  
		separator:' : ',
		tag: 'span', 
		rootClass: 'root',
		rootText: 'ROOT',
		rootTextClass: 'root-text',
		keyClass: 'key', 
		valueClass: 'val',
		editableClass: 'editable',
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
		change: function ($this){},
		
		/*callback function to validate the user input.*/
		validate: function (val){return ('' != val) && (!/[\{\}]+/.test(val));},
		data: {}
	}, _w = function(v, w, c, t){w = w||defaults.tag;
		return ['<', w, (c ? ' class="'+c+'"' : ''),(t ? ' title="'+ t +'"' : ''),  '>',v ,'</', w, '>'].join('');
	}, _t = function(d, k, o, r){
		o = o || defaults;
		var sp = o.separator, w = o.tag;
		k = _w(k, w, r || o.keyClass);
		if (typeof d == 'object') {
			var s = ''; for(var i in d) s += _t(d[i], i, o);
			return '<li>__<ul>_</ul></li>'.replace('__', k).replace('_', s);
		}
		return '<li>' + k + sp + _w(_(d), w, o.valueClass) +'</li>';
	}, _j = function (o){
		var r = {}, w = (o && o.tag) || defaults.tag, l = $(this).children(), isObj = false;
		$.each(l, function (i,n){
			var c = $(n).children('ul');
			if (c.length > 0) {
				var k_ = $(n).children(w+':first').text(), k = k_ ? k_ : i;
				r[_k(k,i)] = _j.call(c, o);
			} else {
				var k = $(n).children(w+':first').text(), v = $(n).children(w+':eq(1)').text();
				r[_k(k,i)] = v ? v : k;
			}
			isObj = isObj || isNaN(parseInt(k));
		})
		if (isObj) return r;
		r.length = l.length;
		return Array.prototype.slice.call(r);
	}, _k = function(k, i){
		return isNaN(parseInt(k)) ? k : i;
	}, 	_ = function(t){
	  return t.replace(/[<>"®©]/g, function(m){ return {'<':'&lt;','>':'&gt;', '"':'&quot;', '®':'&reg;', '©':'&copy;'}[m]});
	}, _e = function (o){
		o = o|| defaults;
		if (o.rootText != $(this).text())
		$(this).one('dblclick', function (){
			var obj = this, oldval = $(obj).text(), l = oldval.length
				, t = (l < 20) ? '<input value="_">' : '<textarea rows="'+Math.floor(l/10+1)+'" cols="20">_</textarea>';
			$(obj).html($(t.replace('_', _(oldval)))).children().focus().blur(function(){
				var val = $(this).val();
				_e.call($(obj).html(_(o.validate(val) ? val : oldval)), o);
				o.change && o.change(o.obj);
			});
		})
	}, _h = function (o){
		o = o || defaults;
		var w = o.tag, bw = o.buttonTag, 
			ac = o.addButtonClass, ic = o.insertButtonClass, dc = o.deleteButtonClass,
			ab = o.addButton, ib = o.insertButton, db = o.deleteButton,
			at = o.addButtonTitle, it = o.insertButtonTitle,  dt = o.deleteButtonTitle,
			ec = o.editableClass;
		$(this).hover(function (){
			var obj = this;
			$(o.obj).find('li').removeClass(ec);$(obj).addClass(ec);
			if ($(obj).children(bw).length < 1) {
				//remove
				if (!$(obj).parent().hasClass(o.rootClass))
				$(_w(db,bw, dc, dt)).insertAfter($(obj).children(w+':last')).click(function (){
					if ($(obj).parent().children('li').length == 1 && $(obj).parent().parent().children(w).length == 1) {
						$(obj).children(':eq(1)').insertAfter($(obj).parent().parent().children(w+':first'));
						$(obj).parent().remove();
					}
					else $(obj).remove();
					o.change && o.change(o.obj);
				})
				//insert
				if ($(obj).children('ul').length < 1)
				$(_w(ib,bw, ic, it)).insertAfter($(obj).children(w+':last')).click(function (){
					$(obj).html($(_t({key:_($(obj).children(w+':eq(1)').text())}, _($(obj).children(w+':first').text()), o)).html());
					$(obj).find(w)._editor(o);
					$(obj).find('li')._hover(o);
					o.change && o.change(o.obj);
				})
				//add after
				if (!$(obj).parent().hasClass(o.rootClass))
				$(_w(ab,bw, ac, it)).insertAfter($(obj).children(w+':last')).click(function (){
					$(_t('value','key', o)).insertAfter(obj)._hover(o).children(w)._editor(o);
					o.change && o.change(o.obj);
				})
			}
		}, function (){
			$(o.obj).find('li').removeClass(ec);
			$(this).children([bw, '.', ac, ',', bw,'.', ic, ',', bw,'.', dc].join('')).remove()
		})
	};
	$.htmlEncode = function(t) {return _(t);}
    $.fn.extend({
        jsonEditor: function(options) {  
			var o = $.extend(defaults, options);
            return this.each(function() {  
				o.obj = this;
				$(this).data('option', o);
				$(this).html(_t(o.data, o.rootText, o, o.rootTextClass)).addClass(o.rootClass);
				$(this).find(o.tag + ':gt(0)')._editor(o)
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
			var o = $(this).data('option') || defaults;
			return _j.call(this, o)[o.rootText];
		}
    });  
})(jQuery);  