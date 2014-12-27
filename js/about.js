$('a[href^=http]').click(function(e){
	e.preventDefault();

	var activity = new MozActivity({
	name: "view",
	data: {
	          type: "url",
	           url: $(this).attr("href")
	      }
	});
});