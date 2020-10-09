import React, { useState } from 'react';
import FieldService from './MockService.js';

function App() {
  const MAX_NUM_CHOICES = 50;
  const initialData = FieldService.getField();
  const [getData, setData] = useState(initialData);
  const [addChoiceField, setAddChoiceField] = useState("");

  const handleChange = (event) => {
    setData({
      ...getData,
      [event.currentTarget.name]: event.currentTarget.value
    });

    setAddChoiceField(event.currentTarget.value);
  }

  const clearForm = (event) => {
    event.preventDefault()
    setData({
      "label": "",
		  "required": "false",
		  "choices": [],
		  "displayAlpha": "true",
		  "default": ""
    })
  }

  const addChoiceHandler = (event) => {
    event.preventDefault();
    const choiceOptionsArray = document.getElementById("choices").options;
    const choiceValuesArray = [];

    for (let i = 0; i < choiceOptionsArray.length; i++) {
      choiceValuesArray.push(choiceOptionsArray[i].value)
    }

    const additionsString = document.getElementById("additions").value;
    const additionsArray = additionsString.split('\n');
    const duplicates = [];

    if (choiceValuesArray.length + additionsArray.length < MAX_NUM_CHOICES) {
      for (let i = 0; i < additionsArray.length; i++) {
        debugger;
        if (choiceValuesArray.includes(additionsArray[i])) {
          duplicates.push(additionsArray[i]);
        }
      }

      if (duplicates.length === 0) {
        const newChoices = choiceValuesArray.concat(additionsArray)
        setData({
          ...getData,
          choices: newChoices
        })
        setAddChoiceField("");
      } else {
        const duplicatesString = duplicates.join('\n')

        alert("Please remove the following duplicate item(s) before adding to the choice list:\n" + duplicatesString)
      }
    } else {
      alert("Please Note: There may not be more than 50 choices total.")
    }
  }

  const removeChoiceHandler = (event) => {
    event.preventDefault();
    const list = document.getElementById("choices");
    const selectedOptions = [];

    for (let i = 0; i < list.options.length; i++) {
      if (!list.options[i].selected) {
        selectedOptions.push(list.options[i].value)
      }
    }

    setData({
      ...getData,
      choices: selectedOptions
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let readyToSubmit = true;

    let formPayload = {
      "label": getData.label,
		  "required": getData.required,
		  "choices": getData.choices,
		  "displayAlpha": getData.displayAlpha,
		  "default": getData.default
    };

    if (getData.label.trim() === "") {
      readyToSubmit = false;
      alert("Label cannot be blank.");
    }

    if (readyToSubmit) {
      if (!getData.choices.includes(getData.default)) {
        const newChoices = getData.choices;
        newChoices.unshift(getData.default);
        setData({
          ...getData,
          choices: newChoices
        })
      }
      FieldService.saveField(formPayload);
    }
  }

  const choiceItems = getData.choices.map(choice => {
    return <option key={choice} value={choice}>{choice}</option>;
  });

  return (
    <div className="App">
      <div className="form-title">
        <h4>Field Builder</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-container">
          <div className="rounded grid-x grid-padding-x">
            <div className="medium-3 cell">
              <label htmlFor="label" className="right inline">Label</label>
            </div>

            <div className="medium-9 cell">
              <input className="input" type="text" id="label" name="label" onChange={handleChange} value={getData.label}/>
            </div>

            <div className="medium-3 cell">
              <label htmlFor="type">Type</label>
            </div>

            <div className="medium-3 cell">
              <legend>Multi-select</legend>
            </div>
              
            <div className="medium-6 cell">
              <input id="type" type="checkbox"/>
              <label htmlFor="type">A Value is required</label>
            </div>

            <div className="medium-3 cell">
              <label htmlFor="default">Default Value</label>
            </div>

            <div className="medium-9 cell">
              <input className="input" type="text" id="default" name="default" onChange={handleChange} value={getData.default}/>
            </div>

            <div className="medium-3 cell">
              <label htmlFor="choices">Choices</label>
            </div>

            <div className="medium-9 cell">
              <select multiple className="input" id="choices" name="choices" size="10">
                {choiceItems}
              </select>
            </div>

            <div className="small-12 columns align-left">
              <i htmlFor="choices" className="fas fa-minus" onClick={removeChoiceHandler}></i>
              <i htmlFor="choices" className="fas fa-plus" onClick={addChoiceHandler}></i>
            </div>

            <div className="medium-3 cell">
            </div>

            <div className="medium-9 cell">
              <textarea className="input" type="text" id="additions" name="additions" onChange={handleChange} value={addChoiceField}/>
            </div>

            <div className="medium-3 cell">
              <label htmlFor="order">Order</label>
            </div>

            <div className="medium-9 cell">
              <select className="input" id="order" name="order">
                <option value="example1">Ascending Alphabetical</option>
                <option value="example2">Descending Alphabetical</option>
              </select>
            </div>

            <div className="button-group align-center">
              <input className="hollow success button" type="submit" value="Save Changes"/>
              <button className="hollow alert button">Cancel</button>
              <button className="hollow button" onClick={clearForm}>Clear</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
