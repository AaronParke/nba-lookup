// Thanks to w3schools for the how-to on autocomplete
// This is based on their code here: https://www.w3schools.com/howto/howto_js_autocomplete.asp

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items text-left");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (player in players) {
        var firstName = players[player].player.FirstName,
        lastName = players[player].player.LastName,
        playerId = players[player].player.ID,
        fullName = firstName + " " + lastName;
        // Check if the player's full name begins with the letters typed so far - full name takes priority
        if (fullName.toUpperCase().substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + fullName.substr(0, val.length) + "</strong>";
          b.innerHTML += fullName.substr(val.length) + " ";
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + fullName + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
          });
          b.setAttribute("class", "autocomplete-item");
          b.setAttribute("data-link", "/player/" + playerId);
          a.appendChild(b);
        } 
        // If full/first name doesn't match the typing, check the last name
        else if (lastName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = firstName + " ";
          b.innerHTML += "<strong>" + lastName.substr(0, val.length) + "</strong>";
          b.innerHTML += lastName.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + fullName + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
          });
          b.setAttribute("class", "autocomplete-item");
          b.setAttribute("data-link", "/player/" + playerId);
          a.appendChild(b);
        } 
      }

      // When autocomplete list is generated, add click listeners on each item
      // If clicked, navigate to the link for the player
      var autocompleteItemArray = document.getElementsByClassName("autocomplete-item");
      for (var i = 0; i < autocompleteItemArray.length; i++) {
        autocompleteItemArray[i].addEventListener("click", function() {
          //parentContainer tracks which container this search was called from
          var parentContainer = $(this).closest('.player-container');
          // Fire function to load player HTML inside this player-container
          loadPlayer(parentContainer, this.dataset.link);
          //window.location.href = this.dataset.link;
          //closeAllLists();
        });
      }

  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

function addAutocomplete (searchInputs) {
  searchInputs = $('.search-input');
  searchInputs.each(function() {
    autocomplete($(this).context, players);
  });
}

// To hold object from /player-names JSON
var players;
// For any search bars on the page, attempt to get the JSON from the route created by the back-end
// If successful, run the autocomplete function on the search bar
// This initialization handles the first load, for new search bars call addAutocomplete
var searchInputs = $('.search-input');

if(searchInputs.length > 0) {
  //if(document.getElementById("searchInput") != undefined) {
  $.getJSON("././player-names", function(result,status) {
    players = result;
    searchInputs.each(function() {
      autocomplete($(this).context, players);
    });
  });
}