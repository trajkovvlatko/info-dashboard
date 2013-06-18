var User = {
	initialize : function() {
		var email = window.localStorage.getItem("email");
        var email_password = window.localStorage.getItem("email-password");
        User.email = email;
    	User.email_password = email_password;
    	User.rss = window.localStorage.getItem("rss");
    	Cards.initialize();
    	$(".boxes").show();
    },
	
	load_user_form: function(){
		$(".user-form").show();
		$(".settings-box").hide();
		$(".boxes").hide();
	},
	
	save: function(){
		email = $.trim($(".email").val());
		email_password = $.trim($(".email-password").val());
		if( email != "" && email_password != "" ){
			window.localStorage.setItem("email", email);
			window.localStorage.setItem("email-password", email_password);
			$(".user-form").hide();
			$(".boxes").show();
			User.email = email;
			User.email_password = email_password;
			Cards.initialize();
		}else{
			alert("Please insert valid email and password.");
		}
	}

};
User.email = "";
User.password = "";
User.rss = "";