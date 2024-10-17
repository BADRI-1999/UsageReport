fetch('UsageReport.json')
  .then(response => response.json())
  .then(data => {
    // Get the template from the HTML
    const source = document.getElementById("report-template").innerHTML;
    console.log(data);
    
    // Compile the template
    const template = Handlebars.compile(source);
    
    // Generate the HTML using the data
    const html = template(data);
    
    // Insert the generated HTML into the DOM
    document.getElementById("display").innerHTML = html;
  });
