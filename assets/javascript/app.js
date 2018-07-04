$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDBy4ZiUXiC_jixXM4kS44zjiTmBMx0CjU",
        authDomain: "train-time-log.firebaseapp.com",
        databaseURL: "https://train-time-log.firebaseio.com",
        projectId: "train-time-log",
        storageBucket: "train-time-log.appspot.com",
        messagingSenderId: "729994678291"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    var trainName = $(".train-name");
    var destination = $(".destination");
    var firstTrainTime = $(".first-train-time");
    var trainFrequency = $(".train-frequency");

    $(".submit-button").on("click", function (event) {
        event.preventDefault();

        let name = trainName.val().trim();
        let dest = destination.val().trim();
        let firstArrival = firstTrainTime.val().trim();
        let freq = trainFrequency.val().trim();

        trainName.val("");
        destination.val("");
        firstTrainTime.val("");
        trainFrequency.val("");

        database.ref().push({
            name: name,
            dest: dest,
            firstArrival: firstArrival,
            freq: freq,
        })

    });

    database.ref().on("child_added", function (snapshot) {

        console.log("New train entry: ");
        console.log(snapshot);
        console.log(snapshot.val());

        let val = snapshot.val();

        var tFrequency = parseInt(val.freq);
        var firstTime = val.firstArrival;
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        let tr = $("<tr>");
        tr.append(`<td>${val.name}`);
        tr.append(`<td>${val.dest}`);
        tr.append(`<td>${tFrequency}`);
        tr.append(`<td>${moment(nextTrain).format("hh:mm")}`);
        tr.append(`<td>${tMinutesTillTrain}`);

        $("tbody").append(tr);

    });


})