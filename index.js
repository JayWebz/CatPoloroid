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
          buttonShutter1: '.button__shutter--1',
          buttonShutter2: '.button__shutter--2',
          buttonShutter3: '.button__shutter--3',
          buttonShutter4: '.button__shutter--4',
          buttonShutter5: '.button__shutter--5',
          buttonShutter6: '.button__shutter--6',
          buttonShutter7: '.button__shutter--7',
          buttonShutter8: '.button__shutter--8',
          buttonShutterAnimate1: 'button__shutter-animate--1',
          buttonShutterAnimate2: 'button__shutter-animate--2',
          buttonShutterAnimate3: 'button__shutter-animate--3',
          buttonShutterAnimate4: 'button__shutter-animate--4',
          buttonShutterAnimate5: 'button__shutter-animate--5',
          buttonShutterAnimate6: 'button__shutter-animate--6',
          buttonShutterAnimate7: 'button__shutter-animate--7',
          buttonShutterAnimate8: 'button__shutter-animate--8',
        };

        const pullFact = function() {
          
        try {
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
        } catch(error) {
          console.log(error);
          return "Unlike humans, cats cannot detect sweetness–which likely explains why they are not drawn to it at all.";
        }
          
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
          document.querySelector(DOM.buttonShutter1).classList.add(DOM.buttonShutterAnimate1);
          document.querySelector(DOM.buttonShutter2).classList.add(DOM.buttonShutterAnimate2);
          document.querySelector(DOM.buttonShutter3).classList.add(DOM.buttonShutterAnimate3);
          document.querySelector(DOM.buttonShutter4).classList.add(DOM.buttonShutterAnimate4);
          document.querySelector(DOM.buttonShutter5).classList.add(DOM.buttonShutterAnimate5);
          document.querySelector(DOM.buttonShutter6).classList.add(DOM.buttonShutterAnimate6);
          document.querySelector(DOM.buttonShutter7).classList.add(DOM.buttonShutterAnimate7);
          document.querySelector(DOM.buttonShutter8).classList.add(DOM.buttonShutterAnimate8);
            setTimeout(function() {
              document.querySelector(DOM.buttonShutter1).classList.remove(DOM.buttonShutterAnimate1);
              document.querySelector(DOM.buttonShutter2).classList.remove(DOM.buttonShutterAnimate2);
              document.querySelector(DOM.buttonShutter3).classList.remove(DOM.buttonShutterAnimate3);
              document.querySelector(DOM.buttonShutter4).classList.remove(DOM.buttonShutterAnimate4);
              document.querySelector(DOM.buttonShutter5).classList.remove(DOM.buttonShutterAnimate5);
              document.querySelector(DOM.buttonShutter6).classList.remove(DOM.buttonShutterAnimate6);
              document.querySelector(DOM.buttonShutter7).classList.remove(DOM.buttonShutterAnimate7);
              document.querySelector(DOM.buttonShutter8).classList.remove(DOM.buttonShutterAnimate8);
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
      // var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      // document.querySelector('body').style.height = h;




