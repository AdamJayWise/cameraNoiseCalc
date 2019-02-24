console.log('Noise Sim')
d3.select('body').append('div').text('Signal : Noise Visualizer').style('text-align','center').style('font-size','20pt')

// sensorChoices is an object read in from a separate js file... I could have planned this better
var sensorChoices = Object.keys(sensorDefinitions);

// build a d3 scale for each parameter to clamp legal values
var paramBounds = { qe : [0.1,1],
               iDark : [0,100],
               readNoise : [0, 100],
               enf : [1,3.5] }

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
    enf : 0.1 }

// create a chart class to mananage plotting
function Chart(paramObj){

    var self = this;

    if (!paramObj){
        paramObj = {canvasWidth : 900,
                    canvasHeight : 400,
                    canvasMargin : 50,
                    tExp : 1,
                    yTicks : [0.2,1,2,5,10,20],
                    xTicks : [1,10,25,50,100,25,500,1000] };
    }

    // copy values from parameter object to self
   Object.keys(paramObj).forEach(function(k){self[k]=paramObj[k]})

    // plot parameters ... more to here soon
    this.tExp = paramObj.tExp;
    this.illuminationStyle = 'perPixel' // could also be perArea (13*13um)
    // ....

    this.svg = d3.select('#contentDiv')
        .append('div')
        .style('text-align','center')
        .append('svg')
        .attr('width', paramObj.canvasWidth)
        .attr('height', paramObj.canvasHeight)
    
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
                        .attr('width',  self.xScale( self.xTicks.slice(-1)[0]) -self.xScale( self.xTicks[0]) )
                        .attr('height', self.yScale(self.yTicks[i]) - self.yScale(self.yTicks[i+1]) - 2)
                        .attr('fill','rgba(0,0,0,.1')
                        .attr('stroke-width','2')
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
    var controlDiv = d3.select('#contentDiv')
        .append('div')
        .style('margin','5px')
        .attr('id','controlDiv')
    
    controlDiv
        .append('span')
        .html('&nbsp; Exposure Time, s : ')
        .append('input')
        .style('width','50px')
        .attr('id','texp')
        .attr('value',1)
        .on('input', function(){
            self.tExp = this.value;
            self.draw()
        })

    controlDiv
        .append('button')
        .style('margin','0 0 0 10px')
        .text('Add Sensor')
        .on('click',function(){
        var t = new Trace({
            name : 'Custom Sensor',
            iDark : 0,
            readNoise : 5,
            enf : 1,
            qe : 1,
            tExp : 1,
            pixelSize : 25,
            chart : mainChart,
            dashArray : 0,
            color : randColor()
        });
        mainChart.draw()
        })

    controlDiv
        .append('button')
        .style('margin','0 0 0 10px')
        .text('Download as CSV')
        .on('click', function(){self.downloadData.call(self)})

    controlDiv
        .append('button')
        .style('margin','0 0 0 10px')
        .text('Plot as Photons / Pixel')
        .on('click', function(){
            self.illuminationStyle = 'perPixel';
            d3.select('#xLabel').text('Photons/Pixel');
            self.update();
            self.draw();
        })

    controlDiv
        .append('button')
        .style('margin','0 0 0 10px')
        .html('Plot as Photons / 13um<sup>2</sup>')
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
                dashArray : 4
        }
    }


    //object of parameters to change and printable names
    var controlParams = {
                     iDark:'Dark Current, e/pix/s',
                     readNoise : 'Read Noise, e',
                     enf : 'ENF',
                     qe : 'QE',
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
    this.panel = d3.select('#contentDiv')
        .append('div')
        .style('border','1px solid black')
        .style('display', 'inline-block')
        .style('padding', '5px')
        .style('margin','2px')
        .style('font-size','10pt')
        .style('font-weight', 800)
    
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

    // append ui elements for each controllable parameter
    Object.keys(controlParams)
        .forEach(function(l){
            self.panel
                .append('div')
                .style('margin','5px 0 0 0 ')
                .classed('controlP', true)
                .attr('param',l)
                .text( controlParams[l] + ' : ' + self[l])
                
            var p = self.panel.append('div')

            if (self.name == 'Custom Sensor'){
                p.append('button')
                .text('+')
                .on('click', function(){
                            self[l] = paramScales[l](self[l] + paramStep[l]);
                            mainChart.draw();
                            self.updatePanel();
                            })
                
                p.append('button')
                .text('-')
                .on('click', function(){
                            self[l] = paramScales[l](self[l] - paramStep[l]);
                            mainChart.draw();
                            self.updatePanel();
                            })
            }
        })
    
    // add a pull-down UI element to allow choosing from pre-defined sensors
    var select = self.panel
        .append('div')
        .style('padding', '10px 10px 0 0 ')
        .append('select')
        .attr('value', 'Pre-Defined Sensors')
        .attr('class', 'select')
        .on('change', onchange)
        
    var options = select
        .selectAll('option')
        .data(sensorChoices).enter()
        .append('option')
        .text(function (d) { return d; });
    
    function onchange() {
            var selectValue = d3.select(this).property('value');
            if (selectValue[0] !== '-'){
                var newParams = sensorDefinitions[selectValue];
                var keys = Object.keys(newParams);
                for (var i in keys){
                    self[keys[i]] = newParams[keys[i]]
                }
                self.updatePanel();
                self.chart.draw();
            }
        };


    // method to update control panel display fields
    this.updatePanel = function(){
        colorBadge.style('background-color', self.color);
        nameBadge.text(self.name)
        self.panel.selectAll('.controlP').each( function(l,j){ 
            var newParam = d3.select(this).attr('param');
            d3.select(this).text(controlParams[newParam] + ' : ' + Math.round(100*self[newParam]) / 100)
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
                readNoise = readNoise;

            }
            
            // if the chart is to be plotted with fixed illumination intensity,
            //calculate parameters related to pixel size
            if (self.chart.illuminationStyle == 'perArea'){
                val = val
                nPixels = (13**2)/(self.pixelSize**2);
                if (self.type == 'scmos') {
                    // if the camera is scmos, make the read noise stack
                    readNoise = Math.sqrt( self.readNoise * nPixels )
                }
                iDark = ( self.iDark * nPixels )
            }

            var signal = self.qe * val;
            var noise = self.enf * Math.sqrt( self.qe*val + readNoise**2 + self.chart.tExp * iDark )
            return signal / noise
        })
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
    name : 'Custom Sensor',
    iDark : 0,
    readNoise : 0,
    enf : 1,
    qe : 1,
    tExp : 1,
    pixelSize : 25,
    chart : mainChart,
    dashArray : 4,
    color : 'black'
});

mainChart.draw();



d3.select('body')
    .append('div')
    .attr('id','footerDiv')
    .append('div')
    .html(`<p>Signal : Noise Calculation - Here, signal to noise is plotted as:</p>
        <p>Signal = QE * n_photons <br>
        Noise = ENF * SQRT( QE * n<sub>photons</sub> + ReadNoise<sup>2</sup> + T<sub>exp</sub>*I<sub>Dark</sub> )<br>
        <sub>Will replace this with a Tex or something ASAP to minimize ugliness</sub> </p>
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
