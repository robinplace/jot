var draftCount,wrapperFeedback,
		shadow = document.getElementsByClassName('shadow')[0],
		popoverFeedbackTextarea = document.getElementsByClassName('popoverFeedbackTextarea')[0],
		popoverFeedbackContact = document.getElementsByClassName('popoverFeedbackContact')[0],
		body = document.getElementsByTagName('body')[0],
		draft = document.getElementsByClassName('draft')[0],
		feedback = document.getElementsByClassName('feedback')[0],
		is_formula = false,
		formula,
		calculatable = true;

if (localStorage.draft != undefined) {
	draft.value = localStorage.draft;
} else {
	draft.value = '';
	draft.setAttribute('placeholder', 'Thanks for downloading New Tab Draft. \nType anything here to start a new way to use New Tab!')
}

if (localStorage.draftCount != undefined) {
	draftCount = localStorage.draftCount;
	draftCount++;
	localStorage.draftCount = draftCount;
} else {
	localStorage.draftCount = 1;
}

if (localStorage.rated != 'true') {
	if (localStorage.rated != undefined) {
		if (draftCount > 5 && localStorage.rated == 'false') {
			document.getElementsByClassName('wrapperFeedback')[0].style.display = 'block';
		}
	} else {
		localStorage.rated = false;
	}
}


draft.onkeyup = function (e) {
	//calculate(e, this.value, this);
	localStorage.draft = this.value;
}
feedback.onclick = function (argument) {
	shadow.className = 'shadow fadeInDown';
	ga('send', 'event', 'buttonFeedback', 'feedback', 'button');
}

function hideFeedbackShadow (argument) {
	shadow.className = 'shadow fadeOutUp';
	setTimeout(function (argument) {
		shadow.className = 'shadow u-hide';
		popoverFeedbackTextarea.value = '';
	}, 1500);
}

// 点击设计好的反馈按钮
body.addEventListener('click', function (e) {
	var target = e.target;
	if (target.id == 'submitFeedback') {
		var popoverFeedbackTextareaValue = popoverFeedbackTextarea.value;
		var popoverFeedbackContactValue = popoverFeedbackContact.value;
		ga('send', 'event', 'formFeedback', popoverFeedbackTextareaValue, popoverFeedbackContactValue);
		hideFeedbackShadow();
	} else if (target.className == 'closeFeedback') {
		ga('send', 'event', 'closeFeedback', 'close', 'button');
		hideFeedbackShadow();
	} else if (target.id == 'rateGood') {
		ga('send', 'event', 'rateGood', 'buttonRate', 'designedRate');
		document.getElementsByClassName('wrapperFeedback')[0].style.opacity = '0';
		var dom_popover_good = '<div class="shadow fadeInDown"><div class="popover"><p class="popoverTip">Please give us a 5 Star Rating!</p><img src="img/slice/5star.png" alt="" class="fiveStar scaleOutIn"></div></div>';
		body.innerHTML = body.innerHTML + dom_popover_good;
		localStorage.rated = true;
		setTimeout(function (argument) {
			location.href = "https://chrome.google.com/webstore/detail/new-tab-draft/nmfjkeiebceinkbggliapgfdjphocpdh/reviews";
		}, 1300);
	} else if (target.id == 'rateBad') {
		localStorage.rated = true;
		ga('send', 'event', 'rateBad', 'buttonRate', 'designedRate');
		document.getElementById('rateBad').style.display = 'none';
		document.getElementById('rateGood').style.display = 'none';
		document.getElementsByClassName('inputFeedbackBad')[0].style.display = 'block';
		document.getElementsByClassName('submitFeedbackBad')[0].style.display = 'block';
	} else if (target.className.indexOf('submitFeedbackBad') > -1) {
		var inputFeedbackBadValue = document.getElementsByClassName('inputFeedbackBad')[0].value;
		var wrapperFeedback = document.getElementsByClassName('wrapperFeedback')[0];
		wrapperFeedback.innerHTML = "<p>Thanks for letting us know! We'll try and get it fixed as soon as possible.</p>";
		setTimeout(function (argument) {
			wrapperFeedback.style.opacity = 0;
		}, 2000);
		ga('send', 'event', 'designedFeedback', inputFeedbackBadValue, 'designedRate');
		localStorage.rated = true;
		// 出现 change log
	} else if (target.className.indexOf('closeLog') > -1) {
		document.getElementsByClassName('wrapperLog')[0].className = 'wrapperLog fadeOutUpShort';
		localStorage.log_0_0_9 = true;
	}

	// 点击分享列表中的按钮，记录到 localstorage 并展示出来
	if (target.getAttribute('data-icon')) {
		var added = '' || localStorage.addedSocialShare,
				adding = target.getAttribute('data-icon');
		if (added == undefined) {
			localStorage.addedSocialShare = adding;
			showAddedSocialShare(adding);
		} else if (added.indexOf(adding) == -1) {
			localStorage.addedSocialShare = added + ',' + adding;
			showAddedSocialShare(adding);
		}

	}


});

function showAddedSocialShare (adding) {
	document.getElementsByClassName('socialShareListItem ' + adding)[0].style.display = 'block';
}

// 分享
// var shareList = document.getElementById('shareList');
// body.addEventListener('click', function (e) {
// 	var target = e.target;
// 	if (target.id == 'socialShare') {
// 		if (target.className.indexOf('active') == -1) {
// 			shareList.style.display = 'block';
// 			target.className = 'button share active';
// 		} else {
// 			shareList.style.display = 'none';
// 			target.className = 'button share';
// 		}
// 		return false;
// 	}
// });

// if (localStorage.addedSocialShare != undefined) {
// 	var array = localStorage.addedSocialShare.split(',');
// 	for (var i = 0, l = array.length; i < l; i++) {
// 		console.log(i);
// 		console.log(array[i]);
// 		console.log(document.getElementsByClassName('socialShareListItem ' + array[i])[0]);
// 		document.getElementsByClassName('socialShareListItem ' + array[i])[0].style.display = 'block';
// 	}
// }







// 计算的功能
/* 1. 用户打开新 Tab ---- 输入一个式子之后按回车 ----- 按回车后显示等号和答案【输入的时候实时显示答案】【第一次判断用户在输入式子之后，提示用户可以按 enter 获得答案】
	 2. 用户新换行后直接输入一个式子之后
*/

function calculate (e, value, dom) {
	if (calculatable) {
		if (e.which == 13) {
			var array_value = value.split('\n');
			for (var i = 0, l = array_value.length; i < l-1; i++) {
				try {
					if (eval(array_value[i])) {
						console.log(typeof(array_value[i]));
						if (array_value[i].indexOf('+') > -1 || array_value[i].indexOf('-') > -1 || array_value[i].indexOf('*') > -1 || array_value[i].indexOf('/') > -1) {
							draft.value = draft.value.slice(0,-1) + '=' + eval(array_value[i]) + '\n';
						}
					}
				}
				catch (err) {
					
				}
			}
			
			if (draft.value.match(/\n/g).length > 4) {
				calculatable = false;
			}
		}
	}
}






// 如果 rate 过显示 log

function showLog (argument) {
	if (localStorage.log_0_0_9 == undefined) {
		document.getElementsByClassName('wrapperLog')[0].style.display = 'block';
	}
}
showLog();
