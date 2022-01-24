let model;
let outcome;

let table;
let fields = []

function preload() {
    table = loadTable( "data/healthcare-dataset-stroke-data.csv", "header", "csv")
}


function setup() {
  noCanvas();
  getOptions()

  let options = {
    dataUrl: "data/healthcare-dataset-stroke-data.csv",
    inputs: ["gender", "age", "hypertension", "heart_disease", "ever_married", "residence_type", "work_type", "avg_glucose_level", "smoking_status"],
    outputs: ["stroke"],
    task: "classification",
    debug: true,
  };

  model = ml5.neuralNetwork(options, modelReady);

  predictButton = select("#predict");
  predictButton.mousePressed(classify);
  predictButton.hide();

  trainButton = select("#train");

  trainButton.mousePressed(function () {
    let trainOptions = {
      epochs: 15,
      batchSize: 32
    };

    model.train(trainOptions, whileTraining, finishedTraining);
  });


}

function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  predictButton.show();
  trainButton.hide();
}

function classify() {
  let hypertension = parseInt(select("#hypertension").elt.value);
  let heart_disease = parseInt(select("#heart_disease").elt.value);
  let gender = parseInt(select("#gender").elt.value);
  let ever_married = select("#ever_married").value();
  let smoking_status = select("#smoking_status").value();
  let residence_type = select("#residence_type").value();
  let work_type = select("#work_type").value();
  let age = parseInt(select("#age").value());
  let avg_glucose_level = select("#avg_glucose_level").value();
  // let geschlecht = parseInt(select("#classification").elt.value);

  let userInputs = {
    hypertension: hypertension,
    heart_disease: heart_disease,
    gender: gender,
    smoking_status: smoking_status,
    ever_married: ever_married,
    residence_type: residence_type,
    age: age,
    work_type: work_type,
    avg_glucose_level: avg_glucose_level,
  };

  model.classify(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    // if (result[0].label == "no") {
    //   outcome = "nicht bestehen";
    // } else {
    //   outcome = "bestehen!";
    // }
    
    select("#result").html(
      "Stroke prediction: "+result[0].label +" "+parseInt(100*(result[0].confidence))+"%"
    );
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}


function getOptions() {
  let selection = document.getElementById('smoking_status');

  let rows2 = table.getRows()
  for (let i = 0; i< rows2.length; i++) {
      let eduField = rows2[i].getString("smoking_status")
      fields.push(eduField)
  }
  let uniqueValues = getUniqueValues(fields)

  for ( let j = 0; j < uniqueValues.length; j++ ) {
        var option = document.createElement("option");
        option.value = uniqueValues[j];
        option.text = uniqueValues[j];
        selection.appendChild(option);
    }
}


function getUniqueValues (array) {

  let newarray = array.filter((element, index, array) => array.indexOf(element) === index);
  return newarray;

}
