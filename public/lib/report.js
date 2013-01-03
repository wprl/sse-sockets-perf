report = {
  report: function(results) {
    var sum = results.reduce( function (reduced, n) {
      return reduced + n;
    });

    var mean = sum / results.length;

    var deviations = results.map( function (n) {
      return n - mean;
    });

    var variance = deviations.reduce( function (reduced, n) {
      return reduced + ((n*n) / deviations.length);
    });

    var standardDeviation = Math.sqrt(variance);

    console.log('Mean:' + mean);
    console.log('Variance:' + variance);
    console.log('Standard Deviation: ' + standardDeviation);
  }
};

if (module && module.exports) {
  module.exports = report;
}
