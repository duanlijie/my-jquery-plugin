/*
* @Author: Duan
* @Date:   2017-04-12 11:22:30
*
* @param width{number} 轮播图高度,单位为px，默认为600px
* @param height{number} 轮播图宽度，单位为px，默认为400px
* @param hasNubmer{boolean} 有无底部数字键，默认为true
* @param hasDirButton{boolean} 有无方向按钮，默认为true
* @param autoPlay{boolean} 是否自动播放,默认为true
* @param duration{number} 自动播放的时间间隔，单位为毫秒，默认为2000毫秒
*
*
*
* HTML
* <div id="slider-wrap">
*	<ul class="slider-list">
*		<li><a href="#"><img src="images/slidepic1.jpg" alt=""></a></li>
*		<li><a href="#"><img src="images/slidepic2.jpg" alt=""></a></li>
*		<li><a href="#"><img src="images/slidepic3.jpg" alt=""></a></li>
*		<li><a href="#"><img src="images/slidepic4.jpg" alt=""></a></li>
*		<li><a href="#"><img src="images/slidepic5.jpg" alt=""></a></li>
*	</ul>
*	<button>&lt;</button>
*	<button>&gt;</button>
*	<ol></ol>
*</div>
*
* JS
*
* $('#slider-wrap').slide({
*	'width': 600,
*	'height': 300,
*	'duration': 1000,
*	'autoPlay': true,
*	'hasDirButton': false,
*	'hasNumber': false
*})
*/

(function ($) {
	$.fn.extend({
		slide: function (opt) {
			// slide构造函数
			function Slide (container, opt) {
				// 默认选项
				this.opt = {
					width: 600,
					height: 400,
					hasNumber: true,
					hasDirButton: true,
					autoPlay: true,
					duration: 2000
				}
				// 用户若传入选项，使用用户的选项
				$.extend(this.opt, opt);
				// 最外层容器
				this.container = $(container);
				// 盛放图片的容器
				this.imgContainer = this.container.children('ul').eq(0);
				// 所有图片
				this.imgs = this.imgContainer.find('img');
				// 获取左右方向按钮
				this.button = this.container.find('button');
				// 左按钮
				this.leftBtn = this.button.first();
				// 右按钮
				this.rightBtn = this.button.last();
				// 底部数字容器
				this.numberContainer = this.container.find('ol')
				// 默认从第一张图片开始轮播
				this.index = 0;
				this.isClick = false;
				this.timer = null;
				this.count = this.imgContainer.find('li').length;
				this._setStyle();
				this.bindEvent();
				this.move();
				if (this.opt.hasNumber) {
					this.setBottomNumber();
				}
				if (this.opt.hasDirButton) {
					this._setDirStyle();	
				}
				if (this.opt.autoPlay) {
					this.autoPlay();
				}
			}
			// 设置样式
			Slide.prototype._setStyle = function () {
				var _this = this;
				// 最外层容器的样式
				_this.container.css({
					'position': 'relative',
					'width': _this.opt.width + 'px',
					'height': _this.opt.height + 'px',
					'overflow': 'hidden'
				});   
				// 图片容器的样式
				_this.imgContainer.css({
					'position': 'absolute',
					'width': '20000px',
					'height': _this.opt.height + 'px',
					'list-style': 'none'
				})
				// 图片容器中li的样式
				_this.imgContainer.find('li').css('float','left');
				// 图片宽高
				_this.imgs.css({
					'width': _this.opt.width + 'px',
					'height': _this.opt.height + 'px'
				})
			}
			// 设置方向按钮的样式
			Slide.prototype._setDirStyle = function () {
				this.button.css({
					'position': 'absolute',
					'top': (this.opt.height - 45)/2,
					'width': '30px',
					'height': '45px',
					'display': 'none',
					'line-height': '45px',
					'text-align': 'center',
					'font-weight': 700,
					'color': '#FFF',
					'font-family': '宋体',
					'font-size': '30px',
					'cursor': 'pointer',
					'background': 'rgba(0, 0, 0, 0.5)',
					'border': '0 none'
				})
				this.leftBtn.css('left', 0);
				this.rightBtn.css('right', 0);
			}
			// 绑定事件
			Slide.prototype.bindEvent = function () {
				var _this = this;
				this.container.hover(function() {
					_this.button.show();
					if (_this.autoPlay) {	
						clearInterval(_this.timer);
					}
				}, function() {
					_this.button.hide();
					_this.autoPlay()
				});
			}
			// 图片播放
			Slide.prototype.move = function () {
				var _this = this;
				var cloneFirstLi = this.imgContainer.find('li').first().clone(true);
				this.imgContainer.append(cloneFirstLi)
				this.imgLength = this.imgContainer.find('li').length;
				// 右侧按钮点击事件
				this.rightBtn.click(function () {
					// 防止快速点击
					if (!_this.isClick) {
						_this.isClick = true;
						_this.index++;
						if (_this.index === _this.imgLength - 1) {
							_this.numberContainer.find('li').css('background-color', 'rgba(0,0,0,0.5)').eq(0).css('background-color', 'red')
						}else {
							_this.numberContainer.find('li').css('background-color', 'rgba(0,0,0,0.5)').eq(_this.index).css('background-color', 'red')
						}
						_this.imgContainer.animate({'left': -(_this.index * _this.opt.width) + 'px'}, function () {
							if (_this.index === _this.imgLength - 1) {
								_this.index = 0;
								_this.imgContainer.css('left', 0);
							}
							_this.isClick = false;
						});
						
					}
				})
				// 左侧按钮点击事件
				this.leftBtn.click(function () {
					if (!_this.isClick) {
						_this.isClick = true;
						if (_this.index === 0) {
							_this.index = _this.imgLength - 1;
							_this.imgContainer.css('left', -(_this.index * _this.opt.width) + 'px');
						}
						_this.index--;
						_this.imgContainer.animate({'left': -(_this.index * _this.opt.width) + 'px'}, function () {
							if (_this.index === 0) {
								_this.index = _this.imgLength - 1;
								_this.imgContainer.css('left', -(_this.index * _this.opt.width) + 'px');
							}
							_this.isClick = false;
						});
						_this.numberContainer.find('li').css('background-color', 'rgba(0,0,0,0.5)').eq(_this.index).css('background-color', 'red');
					}
					
				})
			}
			// 自动播放
			Slide.prototype.autoPlay = function () {
				var _this = this;
				this.timer = setInterval(function () {
					clearInterval(this.timer)
					_this.rightBtn.click();
				}, this.opt.duration)
			}
			// 底部数字
			Slide.prototype.setBottomNumber = function () {
				var _this = this;
				for (var i = 0; i < this.count; i++) {
					this.numberContainer.append('<li>' + (i + 1) + '</li>')
				}
				this.numberContainer.css({
					'position': 'absolute',
					'bottom': '10px',
					'width': '100%',
					'height': '20px',
					'text-align': 'center'
				})
				this.numberContainer.find('li').css({
					'display': 'inline-block',
					'width': '20px',
					'height': '20px',
					'line-height': '20px',
					'background-color': 'rgba(0,0,0,0.5)',
					'color': '#FFF',
					'border-radius': '50%',
					'margin': '0 4px',
					'font-family': 'Arial',
					'font-size': '14px',
					'cursor': 'pointer'

				})
				this.numberContainer.find('li').eq(0).css('background-color', 'red');
				this.numberContainer.find('li').click(function () {
					_this.index = $(this).index();
					_this.imgContainer.animate({'left': -(_this.index * _this.opt.width) + 'px'})
					_this.numberContainer.find('li').css('background-color', 'rgba(0,0,0,0.5)').eq(_this.index).css('background-color', 'red');
				});
			}
			return new Slide(this, opt);
		}
	})
})(jQuery)