var Cards = {
	initialize : function() {
		//this.host = "http://192.168.1.152:9393/"; 
		this.load_news();
		this.load_weather();
		if(window.localStorage.getItem("email") && window.localStorage.getItem("email") != ""){
			this.load_mail();
		}else{
			$(".mail").hide();
			$(".mail").prev().hide();
		}
	},
	
	
	load_weather: function(){
		city = "Skopje,mk";
		$(".weather").html("<div class='loader'></div>");
		$.ajax({
			type: "GET",
			url: Cards.host + "weather",
			dataType: "json",
			async: true,
			cache: false,
			success: function(data) {
				Cards.items["weather"] = data;
				Cards.loaded++;
				$(".weather .loader").hide();
				$(".weather").append("<div class='title-item item'><span>City:</span> " + data.city + "</div>");
				$(".weather").append("<div class='title-item item'><span>Current weather:</span> " + data.weather + "</div>");
				$(".weather").append("<div class='title-item item hidden'><span>Description:</span> " + data.description + "</div>");
				$(".weather").append("<div class='title-item item'><span>Current temperature:</span> " + data.current_temperature + "</div>");
				$(".weather").append("<div class='title-item item hidden'><span>Clouds density:</span> " + data.clouds_density + "</div>");
				$(".weather").append("<div class='title-item item hidden'><span>Humidity:</span> " + data.humidity + "</div>");
				$(".weather").fadeIn(500);
				$(".weather").prev().fadeIn(500) 
			},
			error: function (xhr, ajaxOptions, thrownError){
				$(".weather").html("Errors while loading weather.");
			}
		});
	},
	
	load_news: function(){
		$(".news").html("<div class='loader'></div>");
		$.ajax({ 
			type: "GET",
			url: Cards.host + "news",
			dataType: "json",
			async: true,
			cache: false,
			data: {
				"rss" : User.rss
			},
			success: function(data) {
				Cards.items["news"] = data;
				$(".news .loader").hide();
				if(data.length > 0){
					var hidden = "";
					for(var i = 0; i < data.length; i++){
						if(i > 2) hidden = "hidden"
						$(".news").append("<div class='title-item item " + hidden + "'>" + data[i].title + "</div>");
						$(".news").append("<div class='text-item hidden'>" + data[i].text + "</div>");
					}
					$(".news").fadeIn(500);
					$(".news").prev().fadeIn(500)
				}else{
					$(".news").append("<div class='item'>News cannot be fetched.</div>");
				}
			},
			error: function (xhr, ajaxOptions, thrownError){
				$(".news").html("Errors while loading news.");
			}
		});
	},

	load_mail: function(){
		$(".mail").html("<div class='loader'></div>");
		$.ajax({
			type: "GET",
			url: Cards.host + "emails", 
			dataType: "json",
			cache: false,
			async: true, 
			data: {
				"email": User.email,
				"email_password": User.email_password
			},
			success: function(data) {
				Cards.items["mail"] = data;
				$(".mail .loader").hide();
				if(data.length > 0){
					var hidden = "";
					for(var i = 0; i < data.length; i++){
						if(i > 2) hidden = "hidden"
						$(".mail").append("<div class='title-item item " + hidden + "'>" + data[i].subject + "</div>");
						$(".mail").append("<div class='text-item hidden'>" + data[i].text + "</div>");
					}
					if((data.length / 2) > 3){
						$(".mail").prev().find("span").html("Show more");
					}else{
						$(".mail").prev().find("span").html("");
					}
				}else{
					$(".mail").append("<div class='title-item item'>There aren't any new emails.</div>");
					$(".mail").prev().find("span").html("");
				}
				$(".mail").fadeIn(500);
				$(".mail").prev().fadeIn(500);
			},
			error: function (xhr, ajaxOptions, thrownError){
				$(".mail .loader").hide();
				$(".mail").html("Errors while loading email.");
	        }
		});
	}
};
Cards.items = new Object();
Cards.host = "";
Cards.loaded = 0;
