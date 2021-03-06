console.log('Noise Sim')

// sensorChoices is an object read in from a separate js file... I could have planned this better
var sensorChoices = Object.keys(sensorDefinitions).sort(function(a,b){
    if (a.toUpperCase() > b.toUpperCase()){
        return 1
    }
    if (a.toUpperCase() < b.toUpperCase()){
        return -1
    }
    if (a.toUpperCase() == b.toUpperCase()){
        return 0
    }
});

// all sub-models of camera, could be useful
allModels = Object.keys(models);

// build a d3 scale for each parameter to clamp legal values
var paramBounds = { qe : [0.1,1],
               iDark : [0,100],
               readNoise : [0, 100],
               enf : [1,3.5],
               pixelSize : [1,100] };  

paramScales = {};

Object.keys(paramBounds).forEach(function(key){
    paramScales[key] = d3.scaleLinear()
                        .domain(paramBounds[key])
                        .range(paramBounds[key])
                        .clamp(true) 
})

// define steps for changing parameters with the little +/- buttons
var paramStep = { qe : 0.05,
    iDark : 0.01,
    readNoise : 0.1,
    enf : 0.1,
    pixelSize : 0.5};

// create a chart class to mananage plotting
function Chart(paramObj){

    var self = this;

    if (!paramObj){
        paramObj = {canvasWidth : 500,
                    canvasHeight : 300,
                    canvasMargin : 60,
                    tExp : 1,
                    wavelength : 500, // wavelength in nm
                    yTicks : [0.2,1,2,5,10,20],
                    xTicks : [1,10,25,50,100,25,500,1000] };
    }

    // copy values from parameter object to self
   Object.keys(paramObj).forEach(function(k){self[k]=paramObj[k]})

    // plot parameters ... more to here soon
    this.tExp = paramObj.tExp;
    this.illuminationStyle = 'perPixel' // could also be perArea (13*13um)
    // ....

    d3.select('#contentDiv')
        .append('div')
        .text('Signal to Noise Calculator').style('font-size','24px')
        .style('text-align', 'center')
        .style('margin', '10px 0 10px 0')

    d3.select('#contentDiv')
        .append('div')
        .text('Controls')
        .attr('class','blueDivider')
    
    d3.select('#contentDiv')
        .append('div')
        .attr('id','controlDiv')

    d3.select('#contentDiv')
        .append('div')
        .text('Signal to Noise Ratio')
        .attr('class','blueDivider')
        
    this.svg = d3.select('#contentDiv')
        .append('div')
        .attr('id','chartDiv')
        .append('div')
        .append('svg')
        .attr('width', paramObj.canvasWidth)
        .attr('height', paramObj.canvasHeight)

    d3.select('#chartDiv')
        .append('div')
        .attr('id','legendDiv')
        .attr('width','400px')
        .attr('height',this.canvasHeight+'px')

    d3.select('#contentDiv')
        .append('div')
        .text('Sensors')
        .attr('class','blueDivider')

    d3.select('#contentDiv')
        .append('div')
        .attr('id','sensorDiv')

    d3.select('#contentDiv')
        .append('div')
        .text('Notes')
        .attr('class','blueDivider')

    d3.select('#contentDiv')
        .append('div')
        .attr('id','notesDiv')
    
    this.traces = []

    // method to draw traces onto the svg 
    this.draw = function(){
        this.traces.forEach(e=>e.update())
        var maxY = Math.max(...this.yTicks)
        var minY = Math.min(...this.yTicks)
        if (this.traces[0].yAxisSN){
            maxY = Math.max(...self.traces.map(function(item){return item.yAxisSN.slice(-1)[0]}))
            minY = Math.min(...self.traces.map(function(item){return item.yAxisSN[0]}))
        }
        self.yTicks[0] = Math.floor(minY*100)/100
        self.yTicks[self.yTicks.length-1] = Math.ceil(maxY)
        this.updateAxes();
        this.traces.forEach(e=>e.draw())
    }

    // method to update trace paths, reflecting new parameters
    this.update = function(){
        this.traces.forEach(e=>e.update())
    }

    // a method to marshall data in each trace into an exportable CSV string 
    this.getData = function(){
        this.update();
        var n = this.traces.length;
        var outputData = []
        var line = []
        var headings = this.traces.map(function(t){return t.name + ' S:N'})
        headings.unshift('Photons')
        outputData.push(headings.join(','))

        for (var l = 0; l < this.traces[0].yAxisSN.length; l++){
        line = []
            line.push(this.traces[0].xAxisPhotons[l])
            for (var i = 0; i < n; i++){
                line.push(this.traces[i].yAxisSN[l])
            }   
            outputData.push(line.join(','))
        }
        return outputData.join('\n')
    }

    //method to download data in the chart from the web page as csv
    this.downloadData = function () {
        var a = document.createElement('a');
        var mimeType = 'application/octet-stream';
        var data = this.getData();
        var fileName = 'exported_data.csv'
        
        if (URL && 'download' in a) { 
            a.href = URL.createObjectURL(new Blob([data], {
              type: mimeType
            }));
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
         
        }
    }

    this.remove = function(){

    }

    // method to update axes 
    this.updateAxes = function() {
        d3.selectAll('.axis').remove()
    // generate scales and axes including formatting
        self.xScale = d3.scaleLog()
                        .domain([self.xTicks.slice(0)[0], self.xTicks.slice(-1)[0]])
                        .range([self.canvasMargin, self.canvasWidth-self.canvasMargin])

        self.yScale = d3.scaleLog()
                        .domain([self.yTicks.slice(0)[0], self.yTicks.slice(-1)[0]])
                        .range([self.canvasHeight-self.canvasMargin, self.canvasMargin/5])

        self.dataLine = d3.line()
                        .x(d=>self.xScale(d.x))
                        .y(d=>self.yScale(d.y))

        self.xAxis = d3.axisBottom()
                        .scale(self.xScale)
                        .tickValues( self.xTicks )
                        .tickFormat(d=>d);

        self.yAxis = d3.axisLeft()
                        .scale(self.yScale)
                        .tickValues( self.yTicks )
                        .tickFormat(d=>d);

        self.svg
                .append('g')
                .classed('axis',true)
                .attr('id','yAxis')
                .attr('transform',`translate(${self.xScale(self.xTicks[0])-2},0)`)
                .call(self.yAxis)
                .style('font-size',13)
                            
        self.svg
                .append('g')
                .classed('axis',true)
                .attr('id','xAxis')
                .attr('transform',`translate(0,${self.yScale(self.yTicks[0])-2})`)
                .call(self.xAxis)
                .style('font-size',13)

                // draw decorative rectangles to denote y axis divisions
                for (var i = 0;  i < self.yTicks.length-1; i++ ){
                    self.svg.append('rect')
                        .classed('axis',true)
                        .attr('x', self.xScale(self.xTicks[0]))
                        .attr('y', self.yScale(self.yTicks[i+1])+2)
                     
                }
    }

    // initially draw the axes once
    self.updateAxes();

    // add x axis label
    this.svg
       .append('text')
       .attr('id','xLabel')
       .text('Photons / Pixel')
       .attr('fill','black')
       .attr('x',self.canvasWidth/2)
       .attr('y', self.canvasHeight-self.canvasMargin/8)
       .style('text-anchor','middle')

    // add y axis label
    this.svg
       .append('text')
       .text('Signal / Noise Ratio')
       .attr('fill','black')
       .style('text-anchor','middle')
       .attr('transform', `translate(${self.canvasMargin/3},${self.canvasHeight/2}) rotate(-90)`)

    // add additional controls to chart
    var controlDiv = d3.select('#controlDiv')
        .append('div')
        .style('margin','0px')
        .attr('id','controlDiv')
    
    // append control for wavelength
    console.log(this)
    controlDiv
    .append('span')
    .html('&nbsp; Wavelength, nm : ')
    .style('margin','0 5px 0 0')
    .append('input')
    .style('width','30px')
    .attr('id','texp')
    .attr('value',500)
    .on('input', function(){
        self.wavelength = this.value;
        self.traces.forEach(e=>e.updateQE())
        self.traces.forEach(e=>e.updatePanel())
        self.draw()
    })
    
    controlDiv
        .append('span')
        .html('&nbsp; Exposure Time, s : ')
        .style('margin','0 5px 0 0')
        .append('input')
        .style('width','30px')
        .attr('id','texp')
        .attr('value',1)
        .on('input', function(){
            self.tExp = this.value;
            self.draw()
        })

    controlDiv
        .append('button')
        .attr('class','controlButton')  
        .text('Add Camera')
        .on('click',function(){
        var t = new Trace({
            name : 'Custom Camera',
            iDark : 0,
            readNoise : 5,
            enf : 1,
            qe : 1,
            tExp : 1,
            pixelSize : 25,
            chart : mainChart,
            dashArray : 0,
            color : randColor(),
            availableModels : allModels,
            currentModel : 'Ideal'
        });
        mainChart.draw()
        })

    controlDiv
        .append('button')
        .attr('class','controlButton')
        .text('Download as CSV')
        .on('click', function(){self.downloadData.call(self)})

    controlDiv
        .append('button')
        .attr('class','controlButton')
        .text('Plot as Photons / Pixel')
        .on('click', function(){
            self.illuminationStyle = 'perPixel';
            d3.select('#xLabel').text('Photons / Pixel');
            self.update();
            self.draw();
        })

    controlDiv
        .append('button')
        .attr('class','controlButton')
        .html('Plot as Photons / 13um*13um')
        .on('click', function(){
            self.illuminationStyle = 'perArea';
            d3.select('#xLabel').html('Photons / 13um*13um Area');
            self.update.call(self);
            self.updateAxes.call(self)
            self.draw.call(self);
        })

} 

// create a trace object prototype to represent a single sensor
function Trace(paramObj){
    
    if (!paramObj){
        paramObj = {
                name : 'Ideal Sensor',
                iDark : 0,
                readNoise : 0,
                enf : 1,
                qe : 1,
                tExp : 1,
                pixelSize : 25,
                chart : null,
                dashArray : 4,
                availableModels : ['A','B'],
                currentModel : ['A']
        }
    }


    // so I need to shoehorn a choice of sensor into here... how?  THere should be a dropdown of
    // available sensors for each pre-defined camera.  Updating the sensor should change the QE
    // there should be a global control for wavelength that can be used to check.  When that value is changed
    // it should update each trace's QE and replot, based on a call to the traces' chip.getQE() method

    //object of parameters to change and printable names
    var controlParams = {
                     iDark:'Dark Current, e/pix/s',
                     readNoise : 'Read Noise, e',
                     enf : 'ENF',
                     qe : 'QE',
                     pixelSize : 'Pixel Size, um'
                     }

    var self = this;

    // copy input parameters to object properties
    paramKeys = Object.keys(paramObj)
    for (var i in paramKeys){
        this[paramKeys[i]] = paramObj[paramKeys[i]]
    }

    // push this object to its chart's list of traces
    this.chart.traces.push(this);

    // append a path to the chart and hold a reference to its selection
    this.path = this.chart.svg
        .append('path')
        .attr('fill','none')
        .attr('stroke', this.color)
        .attr('stroke-dasharray', this.dashArray)

    // create a control panel
    this.panel = d3.select('#sensorDiv')
        .append('div')
        .style('border','1px solid black')
        .style('display', 'inline-block')
        .style('padding', '5px')
        .style('position','relative')
        .style('margin','2px')
        .style('font-size','10pt')
        .style('font-weight', 800)
        .attr('class','sensorPanel')

    this.panel
        .append('button')
        .text('X')
        .style('box-shadow','none')
        .style('padding','1px 2px 2px 3px')
        .style('color','black')
        .style('font-weight','800')
        .style('font-size','8pt')
        .style('text-align','center')
        .style('position','absolute')
        .style('top','1px')
        .style('left','1px')
        .style('background','red')
        .style('border-radius','0px')
        .style('border','2px solid white')
        .on('click',function(){self.remove()})
    
    var colorBadge = this.panel
            .append('div')
            .style('background-color', this.color)
            .style('width', 20)
            .style('height', '8px')
            .html('&nbsp;')

    var nameBadge = this.panel
            .append('p')
            .text(this.name)
            .style('text-align','center')
            .style('font-size','12pt')
            .style('margin','0')
    
    // create a chart legend for this sensor

    this.legendEntry = d3.select('#legendDiv')
        .append('div')
        .style('display','flex')

    var legendLine = this.legendEntry
                        .append('div')
                        .style('background-color',self.color)
                        .style('width','30px')
                        .style('height','3px')
                        .style('margin','9px 4px 0 0 ')
                        //.attr('class','dashedDiv')
                        

    var legendItem = this.legendEntry
                        .append('div')
                        .attr('class','legendItem')
                        .text(this.name)

    // append ui elements for each controllable parameter
    Object.keys(controlParams)
        .forEach(function(l){
            var controlInputDiv = self.panel
                .append('div')
                .style('margin','5px 0 0 0 ')
                .classed('controlP', true)
                .attr('param',l)
                .text( controlParams[l] + ' : ')

            var paramBounds = {
                'readNoise' : [0,1000000],
                'qe' : [0,1],
                'iDark' : [0,1000000],
                'enf' : [0,100],
                'pixelSize' : [0.0001,50000]
            }
            
            // add an input field for each value
            var numberInput = controlInputDiv.append('input')
                .attr('type','text')
                .style('width','39px')
                .attr('value',self[l])
                .on('change', function(){
                    if( isNaN(Number(this.value)) ){
                        this.value = 0;
                    }
                    var currentParam = d3.select(this.parentNode).attr('param');
                    this.value = Math.min(this.value , paramBounds[currentParam][1]); 
                    this.value = Math.max(this.value , paramBounds[currentParam][0]);

                    self[l] = this.value;
                    mainChart.draw();
                    self.updatePanel();
                } )
                
            var p = self.panel.append('div')

            if (0){
                p.append('button')
                .attr('class','mathButton')
                .text('+')
                .on('click', function(){
                            self[l] = paramScales[l](self[l] + paramStep[l]);
                            mainChart.draw();
                            self.updatePanel();
                            })
                
                p.append('button')
                .attr('class','mathButton')
                .text('-')
                .on('click', function(){
                            self[l] = paramScales[l](self[l] - paramStep[l]);
                            mainChart.draw();
                            self.updatePanel();
                            })
            }
        })
    
    // add a pull-down UI element to allow choosing from pre-defined cameras

    self.panel.append('div').html('Camera Type:').style('margin','5px 0 0 0')

    var select = self.panel
        .append('div')
        .style('padding', '0px 5px 0 0 ')
        .append('select')
        .attr('value', 'Pre-Defined Cameras')
        .attr('class', 'select')
        .on('change', onchangeCamera)
        
    var options = select
        .selectAll('option')
        .data(sensorChoices).enter()
        .append('option')
        .text(function (d) { return d; });
    
    function onchangeCamera() {
            var selectValue = d3.select(this).property('value');
            if (selectValue[0] !== '-'){
                var newParams = sensorDefinitions[selectValue];
                var keys = Object.keys(newParams);
                for (var i in keys){
                    self[keys[i]] = newParams[keys[i]]
                }

                // change the available sensor options, and apply the first available one
                // first remove old choices
                self.panel
                    .select('.availableModels')
                    .selectAll('option')
                    .remove();
                // then update as appropriate
                self.panel
                    .select('.availableModels')
                    .selectAll('option')
                    .data(sensorDefinitions[selectValue]['availableModels'])
                    .enter()
                    .append('option')
                    .text(function(d) {return d;})
                // then update the params using the first value of the available models for that camera
                if (selectValue[0] !== '-'){
                    //update QE based on current wavelenth and model choice
                    var firstModel = sensorDefinitions[selectValue]['availableModels'][0]
                    self.qe = models[firstModel].getQE(self.chart.wavelength)
                    self.currentModel = firstModel;
                }


                self.updatePanel();
                self.chart.draw();
            }
        };

    self.panel.append('div').html('Sensor Type:').style('margin','5px 0 0 0').style('padding','0')
    // add a pull-down UI element to allow choosing from pre-defined model variants
    var select = self.panel
        .append('div')
        .style('padding', '0')
        .append('select')
        .attr('value', 'Available Models')
        .attr('class', 'select availableModels')
        .on('change', onchangeModel)
            
    var options = self.panel
        .select('.availableModels')
        .selectAll('option')
        .data(self.availableModels).enter()
        .append('option')
        .text(function (d) { return d; });
    
    function onchangeModel() {
            var selectValue = d3.select(this).property('value');
            if (selectValue[0] !== '-'){
                //update QE based on current wavelenth and model choice
                self.qe = models[selectValue].getQE(self.chart.wavelength)
                self.currentModel = selectValue;
                self.updatePanel();
                self.chart.draw();
            }
        };


    // method to update QE
    this.updateQE = function() {
        self.qe = models[self.currentModel].getQE(self.chart.wavelength);
        console.log(self)
    }

    // method to update control panel display fields
    this.updatePanel = function(){
        
        legendItem.text(self.name)
        
        // create the legend item background, styling appropriately if dashed
        if (self.dashArray != 0){
            legendLine.style('background','white')
            legendLine.style('background-image', `repeating-linear-gradient( 90deg, ${self.color} 0px 4px, white 4px 8px)`);
        }
        else {
            legendLine.style('background', self.color);
        }
        
        colorBadge.style('background-color', self.color);
        nameBadge.text(self.name)
        
        self.panel.selectAll('.controlP').each( function(l,j){ 
            var newParam = d3.select(this).attr('param');
            //d3.select(this).text(controlParams[newParam] + ' : ' + Math.round(100*self[newParam]) / 100)
            var valueOutput = self[newParam];
            if (valueOutput < 0.01){
                console.log(valueOutput)
                valueOutput = Number(valueOutput).toExponential();
                console.log(valueOutput)
            }
            d3.select(this).select('input').property('value', valueOutput)
        } );
    }

    // update x and y data for the trace
    this.update = function(){
        var chartRangeX = d3.extent(self.chart.xTicks)
        self.xAxisPhotons = range(chartRangeX[0],10).concat(range(11,chartRangeX[1],10));
        self.yAxisSN = self.xAxisPhotons.map( function(val){
        
        var readNoise = self.readNoise;
        var nPixels = 1;
        var iDark = self.iDark;

            if (self.chart.illuminationStyle == 'perPixel'){
                    val = val;
            }
            
            // if the chart is to be plotted with fixed illumination intensity,
            //calculate parameters related to pixel size
            if (self.chart.illuminationStyle == 'perArea'){
                // set the number of photons 
                val = val * (self.pixelSize**2) / (13**2);
            }

            var signal = self.qe * val;
            var noise = self.enf * Math.sqrt( (self.qe*val) + readNoise**2 + self.chart.tExp * iDark )
            return signal / noise
        })
    }

    // function to remove trace from the chart
    this.remove = function(){
        // remove the control panel
        self.panel.remove()
        // remove the path from the chart
        self.path.remove()
        // figure out which trace this is, and remove it from the chart's list of traces
        for (var i=0;i<self.chart.traces.length;i++){
            console.log(i);
            console.log(self.chart.traces[i]===self)
            if (self.chart.traces[i]===self){
                self.chart.traces.splice(i,1);
            }
        }
        // remove the legend entry
        this.legendEntry.remove();


    }

    // method to draw trace to graph
    this.draw = function(){
        // "zip" the object from an object with arrays as properties to a list of objs with one number for each property...
        var dataObj = {x : self.xAxisPhotons, y : self.yAxisSN };
        dataObj = objZip(dataObj)
        this.path
            .attr('d', this.chart.dataLine(dataObj))
            .attr('stroke', self.color)
            .attr('stroke-dasharray', self.dashArray)
            .attr('stroke-width',2)
    }
}

// ================================

d3.select('body')
    .append('div')
    .attr('id','contentDiv')

var mainChart = new Chart()

var t = new Trace({
    name : 'Custom Camera',
    iDark : 0,
    readNoise : 0,
    enf : 1,
    qe : 1,
    tExp : 1,
    pixelSize : 25,
    chart : mainChart,
    dashArray : 0,
    color : 'black',
    availableModels : ['Ideal'],
    currentModel : 'Ideal'
});

mainChart.draw();



d3.select('#notesDiv')
    .html(`<p>Signal : Noise Calculation - Here, signal to noise is plotted as:</p>
        <p>Signal = QE * n_photons <br>
        Noise = ENF * SQRT( QE * n<sub>photons</sub> + ReadNoise<sup>2</sup> + T<sub>exp</sub>*I<sub>Dark</sub> )<br>
        </p>
    `)


//============================  Additional misc funcitons ==============================//

function range(start, stop, step = 1){
    var output = [];
    for (i = start; i<=stop; i += step){
        output.push(i);
    }
    return output;
}

// possibly-necesary function that zips my initial guess at the correct data format into a list of single-point objects
function objZip(obj){
    var output = [];
    var keys = Object.keys(obj)
    for (var i = 0; i < obj[keys[0]].length; i++){
        var newObj = {}
        for (var k in keys){
            newObj[keys[k]] = obj[keys[k]][i];            
        }
        output.push(newObj)
    }
    return output;
}

// random color helper function
function randColor(){
    function roll(){
        return Math.round(255*Math.random())
    }
    return `rgb(${[roll(),roll(),roll()].join(',')})`
}
