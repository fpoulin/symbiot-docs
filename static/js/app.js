var shiftWindow = function () {
	scrollBy(0, -65)
};
window.addEventListener("hashchange", shiftWindow);
function load() {
	if (window.location.hash) shiftWindow();
}

$(window).load(function() {
  var icons = ["adjust", "asterisk", "bell", "briefcase","camera", 
 			"cloud", "cog", "cutlery", "earphone", "envelope", "eye-open", 
 			"facetime-video", "fire", "flag", "flash", "gift", "glass", 
 			"headphones", "heart", "home", "music", "paperclip", "pencil",
 			"phone", "phone-alt", "plane", "pushpin", "shopping-cart", "star",
 			"time", "tower", "tree-conifer", "tree-deciduous", "user", "wrench"];

  $("div.header > div.container > h1 > span.glyphicon.rand").each(function() {
  	$(this).attr("class", "glyphicon glyphicon-" + icons[Math.floor(Math.random()*icons.length)]);
  })
});

