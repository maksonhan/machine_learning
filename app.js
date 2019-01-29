  const KNN = require('ml-knn');
  const csv = require("fast-csv");
  const fs = require('fs'); 
  let knn;

  var seperationSize; 

  let data = [], X = [], y = [];

  let trainingSetX = [], trainingSetY = [], testSetX = [], testSetY = [];

  var stream = fs.createReadStream('data.csv');
  
  var rows = []
  
  var csvStream = csv()
    .on("data", function(data){
      rows.push(data)
    })
    .on("end", function(){

      seperationSize = 0.7 * rows.length;

      rows = shuffleArray(rows);
      
      
      calc(rows)
    });

  stream.pipe(csvStream);


  function calc(data) {

    var rows = data 
    
  

	  data.forEach((row) => {
		X.push(row.slice(0, -1));
		y.push(row.slice(-1));
	  });
    

      trainingSetX = X.slice(0, seperationSize);
      trainingSetY = y.slice(0, seperationSize);
      testSetX = X.slice(seperationSize);
      testSetY = y.slice(seperationSize);  

      knn = new KNN(trainingSetX, trainingSetY, {k: 7});
        
    var arr = []
    var arrRow = []

    testSetX.forEach((row) => {
      arrRow = []
      row.forEach((el) => {
        arrRow.push(parseInt(el))

      })
      arr.push(arrRow)
    });


    const result = knn.predict(arr);
    const testSetLength = testSetX.length;

    const predictionError = error(result, testSetY);

    console.log("Процент неправильных предсказаний --- "+ predictionError/testSetLength)
    

    var signal = [-34,-62,-57,-36,-61,-71,-71]

    console.log("Предсказываем комнату --- "+ knn.predict(signal))
    
  }

  function error(predicted, expected) {
      var misclassifications = 0;
      var misclassificationsPl = 0;
      for (var i = 0; i < predicted.length; i++) {
          if (parseInt(predicted[i]) != parseInt(expected[i])) {
              misclassifications++;
          }
      }
      return misclassifications;
  }

 function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}