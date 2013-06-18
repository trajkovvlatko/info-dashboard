require 'sinatra'
require 'json'
require 'net/imap'
require 'mail'
require 'net/http'
require 'open-uri'
require 'nokogiri'

before do
  content_type 'application/json', :charset => 'utf-8'
end

get "/emails" do
  content_type :json
  if params[:email] && params[:email_password]
    server = "imap.gmail.com"
    port = "993"
    mail = params[:email] + "@gmail.com"
    password = params[:email_password]
    ssl = true
    smtp = "smtp.gmail.com"
    smtp_port = 587
    domain = "gmail.com"
    imap = Net::IMAP.new(server, port, ssl)
    imap.login(mail, password)
    imap.select("INBOX")
    unseen = imap.search(["UNSEEN"])
    emails = []
    unseen.each do |email_id|
      m = imap.fetch(email_id, "RFC822")[0].attr["RFC822"]
      mail = Mail.read_from_string m
        email = Hash.new
        email[:subject] = mail.from[0].to_s + ": " + mail.subject.to_s.force_encoding('utf-8')
        email[:text] = (mail.text_part || mail.html_part || mail).body.to_s
        if email[:text].length < 1000
          email[:text] = email[:text].force_encoding("utf-8").encode("utf-8", replace: "").gsub("\n", " ").gsub("\r", "").strip.split.join(" ")
        else
          email[:text] = ""
        end
        emails.push email
    end
    if emails.length > 0
      emails.uniq! {|e| e[:subject] }
    end
  else
    emails = []
  end
  emails.to_json
end

get "/weather" do
  content_type :json
  city = "Skopje,mk"
  uri = URI.parse( "http://api.openweathermap.org/data/2.5/forecast/daily" )
  params = { "q"=> city, "mode" => "json", "cnt" => "1", "units" => "metric" }
  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Get.new(uri.path)
  request.set_form_data( params )
  request = Net::HTTP::Get.new( uri.path+ '?' + request.body )
  response = http.request(request)
  r = JSON.parse(response.body)
  weather = Hash.new
  weather[:city] = city
  weather[:weather] = r["list"][0]["weather"][0]["main"]
  weather[:description] = r["list"][0]["weather"][0]["description"]
  weather[:current_temperature] = r["list"][0]["temp"]["day"]
  weather[:clouds_density] = r["list"][0]["clouds"]
  weather[:humidity] = r["list"][0]["humidity"]
  weather.to_json
end

get "/news" do
  content_type :json
  rss = "http://news.google.com/?output=rss"
  if params[:rss] && !params[:rss].empty?
    case params[:rss]
    when "time_mk"
      rss = "http://www.time.mk/rss/all"
    when "reuters"
      rss = "http://feeds.reuters.com/reuters/topNews?format=xml"
    when "bbc"
      rss = "http://feeds.bbci.co.uk/news/rss.xml"
    end
  end
  news = []
  doc = Nokogiri::XML(Net::HTTP.get(URI.parse(rss)))
  doc.css('item').each do |data|
    article = Hash.new
    title = data.at("title").text.to_s.force_encoding('utf-8')
    text = data.at("description").text.to_s.force_encoding('utf-8').gsub(/<\/a[^>]*>/, " ").gsub(/<\/?[^>]*>/,"").gsub("&nbsp;", " ").gsub("&#39;", "\'").gsub("&raquo;", "").gsub("\n", " | ").strip.split.join(" ").sub(/^\| /, '').gsub(" | |", "")
    article[:title] = title
    article[:text] = text
    news.push article
  end
  news.to_json
end



















