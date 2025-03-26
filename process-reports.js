const fs = require('fs');
const path = require('path');

// Read the collected reports from the lhci_reports directory
const reportsDir = './lhci_reports';
const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.json'));

const performanceScores = [];

files.forEach(file => {
  const report = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf-8'));
  performanceScores.push(report.categories.performance.score);
});

// Calculate the 95th percentile
const sortedScores = performanceScores.sort((a, b) => a - b);
const percentile95 = sortedScores[Math.floor(0.95 * sortedScores.length)];

// Generate the aggregate report
const aggregateReport = {
  performanceScore: percentile95 * 100,
  reports: files
};

// Generate HTML report
const aggregateHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aggregated Lighthouse Report</title>
</head>
<body>
  <h1>Aggregated Lighthouse Report</h1>
  <h2>95th Percentile Performance Score: ${percentile95 * 100}%</h2>
  <h3>Raw Reports:</h3>
  <pre>${JSON.stringify(aggregateReport, null, 2)}</pre>
</body>
</html>
`;

// Save the aggregated HTML report
fs.writeFileSync('./lhci_reports/aggregate_report.html', aggregateHtml, 'utf-8');

console.log('Aggregated report generated at ./lhci_reports/aggregate_report.html');
