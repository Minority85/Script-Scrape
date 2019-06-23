$.getJSON("/articles", function (data) {

  if (data.isEmptyObject) {

    $(".articles").attr("id", "out");

    $("#btn1").val("out").text("Scrape Articles");

  }
  else if (!data.isEmptyObject) {

    for (var i = 0; i < data.length; i++) {

      var link = "https://www.azfamily.com/news" + data[i].link;
      var card = $("<div class='card text-center bg-light mb-3' id='style1'>").attr("data-id", data[i]._id);
      var cardHeader = $("<div class='card-header'>");
      var nav = $("<ul class='nav nav-pills card-header-pills'>");
      var nav1 = $("<li class='nav-item'>");
      var active = $("<a class='nav-link active' href='#'>").text("Article");
      var nav2 = $("<li class='nav-item'>");
      var linkAddress = $("<a class='nav-link' href='" + link + "'>").text("link");
      var cardBody = $("<div class='card-body'>");
      var title = $("<h5 class='card-title'>").text(data[i].title);

      nav1.append(active);
      nav2.append(linkAddress);
      nav.append(nav1).append(nav2);
      cardHeader.append(nav);
      cardBody.append(title);
      card.append(cardHeader).append(cardBody);

      $(".articles").append(card).attr("id", "in");
      $("#btn1").val("in").text("Remove Articles");

    };
  };
});

$("#btn1").click(function () {
  if ($("#btn1").val() === "out") {
    getArticle();
  }
  else if ($("#btn1").val() === "in") {
    deleteArticle();
  }

})

function getArticle() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(
      setTimeout(function () {
        postArticles()
        return
      }, 1500)
    );
}

function deleteArticle() {
  $.ajax({
    method: "DELETE",
    url: "/articles"
  })
    .then(
      setTimeout(function () {
        $(".articles").empty();
        $("#btn1").val("out").text("Scrape Article");
        return
      }, 500)
    );
}

function postArticles() {

  $.getJSON("/articles", function (data) {

    var counter = 0;

    for (var i = 0; i < data.length; i++) {

      console.log(data)

      var link = "https://www.azfamily.com/news" + data[i].link;

      var card = $("<div class='card text-center bg-light mb-3' id='style1'>").attr("data-id", data[i]._id);
      var cardHeader = $("<div class='card-header'>");
      var nav = $("<ul class='nav nav-pills card-header-pills'>");
      var nav1 = $("<li class='nav-item'>");
      var active = $("<a class='nav-link active' href='#'>").text("Article");
      var nav2 = $("<li class='nav-item'>");
      var linkAddress = $("<a class='nav-link' href='" + link + "'>").text("link");
      var cardBody = $("<div class='card-body'>");
      var title = $("<h5 class='card-title'>").text(data[i].title);

      nav1.append(active);
      nav2.append(linkAddress);
      nav.append(nav1).append(nav2);
      cardHeader.append(nav);
      cardBody.append(title);
      card.append(cardHeader).append(cardBody);

      $(".articles").append(card).attr("id", "in");

      counter++;
    }

    if (counter === 0) {
      return postArticles();
    }

    alert(counter + " Articles have been added.")
    $("#btn1").val("in").text("Remove Article");
  });
};