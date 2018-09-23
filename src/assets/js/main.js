window.addEventListener("load", function() {

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // custom select
  const INPUT = document.querySelector("input[name='currency']");
  const SELECT = document.querySelector(".select__list");
  const ITEM = document.querySelector(".select__item");
  const ITEMS = document.querySelectorAll(".select__item");

  INPUT.addEventListener("click", function() {
    SELECT.classList.remove("hidden");
    ITEMS.forEach(function(item) {
      if (item.innerHTML != INPUT.value) item.classList.remove("hidden")
      else item.classList.add("hidden");
    });
  });

  ITEMS.forEach(function(item) {
    item.addEventListener("click", function() {
      INPUT.value = this.innerHTML;
      setData();
      setIconsClass(this.innerHTML);
      this.classList.add("hidden");
      SELECT.classList.add("hidden");
    })
  });

  // changes currency icon when changed
  function setIconsClass(value) {
    console.log(value);
    switch(value) {
      case 'USD':
        document.querySelectorAll(".currency-icon").forEach( function(item) {
          item.className = "currency-icon fas fa-sm fa-dollar-sign";
        })
      break;
    case 'EUR':
      document.querySelectorAll(".currency-icon").forEach( function(item) {
        item.className = "currency-icon fas fa-sm fa-euro-sign";
      })
    break;
    case 'RUB':
      document.querySelectorAll(".currency-icon").forEach( function(item) {
        item.className = "currency-icon fas fa-sm fa-ruble-sign";
      })
    break;
    case 'GBP':
      document.querySelectorAll(".currency-icon").forEach( function(item) {
        item.className = "currency-icon fas fa-sm fa-pound-sign";
      })
    break;
    }
  }

  //change data-atr when checkbox status changes
  document.querySelectorAll('.card__checkbox__input').forEach( function(element) {
    element.addEventListener('change', function() {
      let infoBlock = element.closest('.card__info');
      console.log(infoBlock);
      if (this.checked) {
        infoBlock.dataset.filter = "percent";
        infoBlock.querySelectorAll('.card__field i').forEach( function(element) {
          element.className = "fas fa-sm fa-percent";
        })
      }
      else {
        infoBlock.dataset.filter = "price";
        infoBlock.querySelectorAll('.card__field i').forEach( function(element) {
          element.className = "currency-icon";
          setIconsClass(INPUT.value);
        })
      }
      setData();
    })
  })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // getting data from server
  const axios = require('axios');
  const URL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD";

  function setData() {
    axios.get(URL)
    .then(function (response) {
      let data = response.data;
      // set price
      document.querySelectorAll('.card__price span').forEach( function(element) {
        element.innerHTML = data.ask;
      })
      // set changes info
      document.querySelectorAll('.card__field span').forEach( function(element) {
        let Elementfilter = element.dataset.filter;
        // is nearest checkbox is checked?
        let checkbox = element.closest('.card__info');
        let checkboxFilter = checkbox.dataset.filter;
        element.innerHTML = data.changes[`${checkboxFilter}`][`${Elementfilter}`];
        // set red color to negative values
        if (element.innerHTML <= 0) {
          element.closest("p").classList.add("red");
        }
        else {
          element.closest("p").classList.remove("red");
        }
      })
    })
    .catch(err => console.log(err));
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setData();
  // continuosly update data every minute
  let timerId = setInterval(function() {
    setData();
  }, 60000);

});
