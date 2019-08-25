 // UI CONTROLLER
      const UIController = (function() {
        const data = {
          picture: '',
          facts: {
            hasRun: false,
            factArray: [],
            usedFacts: []
          },
          count: 0,
          tilt: [3, 1, -2, 2, -3, -1]
        };

        const getPicture = async function() {
          try {
            axios.get('https://api.thecatapi.com/v1/images/search')
            .then( response => {
              data.picture = response.data[0].url;
              let picUrl = data.picture;
            })
          } catch(error) {
            alert(error);
          }
        }

        const getFacts = async function() {
          try {
            axios.get('https://cors-anywhere.herokuapp.com/https://cat-fact.herokuapp.com/facts/')
            .then( response => {
              data.facts.factArray = response.data.all;
              data.facts.hasRun = true;
            })

          } catch(error) {
            alert(error);
          }
        }

        const DOMstrings = {
          photoPile: '.photo-pile',
          buttonInput: '.button__input',
          buttonBackground: '.button__background',
          buttonHide: 'button__hide',
          buttonAnimate: 'button__animate'
        };

        const pullFact = function() {
          let newFactId;

          function chooseFactFromList() {
            // Pull new fact from list
            newFactId = Math.ceil(Math.random() * data.facts.factArray.length); 
            // Check if it's been used
            !data.facts.usedFacts.includes(newFactId)
            ? data.facts.usedFacts.push(newFactId)
            : chooseFactFromList();
          };

          chooseFactFromList();
          return data.facts.factArray[newFactId].text;
        }

        const setZindex = function() {
          data.count++;
          return data.count;
        }

        const setTilt = function(count) {
          if (Number.isInteger(count / 6)) {
            return data.tilt[5];
          } else if (Number.isInteger(count / 5)) {
            return data.tilt[4];
          } else if (Number.isInteger(count / 4)) {
            return data.tilt[3];
          } else if (Number.isInteger(count / 3)) {
            return data.tilt[2];
          } else if (Number.isInteger(count / 2)) {
            return data.tilt[1];
          } else {
            return data.tilt[0];
          }
        }

        return {
          getDOMstrings: function() {
            return DOMstrings;
          },

          populatePoloroid: function() {
            // Pull picture and facts through API
            getPicture();
            if (!data.facts.hasRun) {
              getFacts();
            }

            let poloroidHtml = setTimeout(function() {
              let fact, zIndex, tilt, html, newHtml;

              // Populate picture HTML
              fact = pullFact();
              zIndex = setZindex();
              tilt = setTilt(zIndex);
              
              html = `<div class="poloroid" style="z-index: %zIndex%; transform: rotate(%tilt%deg);"><div class="poloroid__picture">
              <img src="%picUrl%" class="poloroid__picture-img" alt="Cat Picture" /></div><p class="poloroid__fact">%fact%</p></div>`
              newHtml = html.replace('%picUrl%', data.picture).replace('%fact%', fact).replace('%tilt%', tilt).replace('%zIndex%', zIndex);
              document.querySelector(DOMstrings.photoPile).insertAdjacentHTML('beforeend', newHtml);
            }, 2500)
          }
        };
      })();
      
      // APP CONTROLLER
      const controller = (function(UICtrl) {
        const ctrlAppFlow = function() {
          UICtrl.populatePoloroid();
        }

        const transitionPhoto = (function() {
          // Add/Remove CSS classes for trainsition
          const DOM = UICtrl.getDOMstrings();
          document.querySelector(DOM.buttonInput).classList.add(DOM.buttonHide);
          document.querySelector(DOM.buttonBackground).classList.add(DOM.buttonAnimate);
            setTimeout(function() {
              document.querySelector(DOM.buttonBackground).classList.remove(DOM.buttonAnimate);
              document.querySelector(DOM.buttonInput).classList.remove(DOM.buttonHide);
            }, 4000);
        })

        return {
          init: function() {
            ctrlAppFlow();
            transitionPhoto();
          }
        }
      })(UIController);

      document.querySelector(".button").addEventListener('click', controller.init);