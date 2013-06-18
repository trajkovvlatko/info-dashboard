var app = {

	initialize : function() {
		this.bindEvents();
	},

	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		$(".dashboard").click(
				function() {
					$(".settings-box").hide();
					$(".boxes .box").html("");
					Cards.initialize();
					$(".boxes").show();
					$(".user-form").hide();
				});
		$(".settings").click(
				function() {
					$(".rss").css({ "height" : "50px" });
					$(".settings-box").show();
					$(".user-form").hide();
					$(".boxes").hide();
					if (window.localStorage.getItem("email")
							&& window.localStorage.getItem("email") != "") {
						$(".login").addClass("logout").removeClass("login")
								.val("Logout");
						$(".current-email").html(window.localStorage.getItem("email"));
					} else {
						$(".logout").addClass("login").removeClass("logout")
								.val("Login");
						$(".current-email").html("Not logged in.");
					}
					if(User.rss){
						$(".rss").val(User.rss);
					}
				});
		$(".logout").click(function() {
			window.localStorage.setItem("email", "");
			window.localStorage.setItem("email-password", "");
			$(".logout").addClass("login").removeClass("logout").val("Login");
			$(".boxes, .settings-box").hide();
			User.load_user_form();
			$(".current-email").html("Not logged in.")
			$(".boxes .box").html("");
		});
		$(".login").click(function() {
			User.save();
		});
		$(".save-email").click(function() {
			User.save();
		});
		$(".box-header").click(function() {
			if(!$(this).next().find(".loader").is(":visible")){
				var txt = $(this).find("span");
				if($.trim($(txt).html()) != ""){
					$(this).next().find(".title-item.hidden").toggle();
					if(txt.html() == "Show more"){
						txt.html("Show less");
					}else{
						txt.html("Show more");
					}
				}
			}
		});
		$(".save-rss").click(function() {
			User.rss = $.trim($(".rss").val());
			window.localStorage.setItem("rss", User.rss);
			Cards.initialize();
			$(".boxes").show();
			$(".user-form, .settings-box").hide();
		});
		$("body").on("click", ".news .title-item, .mail .title-item", function(){
			var title = $(this).text();
			var text = $(this).next().text();
			$(".news-text .news-text-content").html("<h2>" + title + "</h2><div>" + text + "</div>")
			$(".news-text").fadeIn(500);
		});
		$(".news-text").click(function(){
			$(this).fadeOut(500);
			$(this).find(".news-text-content").html("");
		});
	},

	onDeviceReady : function() {
		app.receivedEvent('deviceready');
	},

	receivedEvent : function(id) {
		User.initialize();
	}
};
