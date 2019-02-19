console.log('Noise Sim')

var sensorChoices = ['Predefined Sensors',
                    'Ideal Sensor',
                    'Newton 940 CCD',
                    'Newton 970 EMCCD', 
                    'Zyla 5.5',
                    'Zyla 4.2 Plus',
                    'Sona 4.2 ']

var sensorDefinitions = {
    'Ideal Sensor' : {
        name : 'Ideal Sensor',
        iDark : 0,
        readNoise : 0,
        enf : 1,
        qe : 1,
        tExp : 1,
        pixelSize : 25,
        color : 'black',
        dashArray : 4
    },

    'Zyla 5.5' : {
        name : 'Zyla 5.5',
        iDark : 0.1,
        readNoise : 0.9,
        enf : 1,
        qe : 0.6,
        tExp : 1,
        pixelSize : 25,
        color : 'green',
        dashArray : '0'
    },

    'Zyla 4.2 Plus' : {
        name : 'Zyla 4.2 Plus',
        iDark : 0.1,
        readNoise : 0.9,
        enf : 1,
        qe : 0.82,
        tExp : 1,
        pixelSize : 6.5,
        color : 'orange',
        dashArray : '0'
    },

    'Newton 970 EMCCD' : {
        name : 'Newton 970 EMCCD',
        iDark : 0.0007,
        readNoise : 0,
        enf : 1.2,
        qe : 0.95,
        tExp : 1,
        pixelSize : 25,
        color : 'blue',
        dashArray : '0'
    },

    'Newton 940 CCD' : {
        name : 'Newton 940 CCD',
        iDark : 0.00001,
        readNoise : 2.5,
        enf : 1,
        qe : 0.95,
        tExp : 1,
        pixelSize : 25,
        color : 'red',
        dashArray : '0'
    },

    'Sona 4.2' : {
        name : 'Sona 4.2',
        iDark : 0.4,
        readNoise : 1.6,
        enf : 1,
        qe : 0.95,
        tExp : 1,
        pixelSize : 25,
        color : 'purple',
        dashArray : '0'
    },
}

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

// define steps for changing parameters
var paramStep = { qe : 0.05,
    iDark : 0.01,
    readNoise : 0.1,
    enf : 0.1 }

function Chart(paramObj){

    var self = this;

    if (!paramObj){
        paramObj = {canvasWidth : 900, canvasHeight : 400, canvasMargin : 70, tExp : 1};
    }

    // plot parameters
    this.tExp = paramObj.tExp;

    this.svg = d3.select('body')
        .append('div')
        .style('text-align','center')
        .append('svg')
        .attr('width', paramObj.canvasWidth)
        .attr('height', paramObj.canvasHeight)
    
    this.traces = []

    this.draw = function(){
        this.traces.forEach(e=>e.draw())
    }

    this.update = function(){
        this.traces.forEach(e=>e.update())
    }

    // generate scales and axes including formatting
    this.xScale = d3.scaleLog()
                    .domain([1,200])
                    .range([paramObj.canvasMargin, paramObj.canvasWidth-paramObj.canvasMargin])

    this.yScale = d3.scaleLog()
                    .domain([0.1,20])//.domain([Math.min(...yAxisSN),Math.max(...yAxisSN)])
                    .range([paramObj.canvasHeight-paramObj.canvasMargin, paramObj.canvasMargin])

    this.dataLine = d3.line()
                    .x(d=>this.xScale(d.x))
                    .y(d=>this.yScale(d.y))

    this.xAxis = d3.axisBottom()
                    .scale(this.xScale)
                    .tickValues([1,10,100,1000])
                    .tickFormat(d=>d);

    this.yAxis = d3.axisLeft()
                    .scale(this.yScale)
                    .tickValues([0.1,1,2,5,10,20])
                    .tickFormat(d=>d);
    
       // add x axis label
    this.svg
       .append('text')
       .text('Photons / Pixel')
       .attr('fill','black')
       .attr('x',paramObj.canvasWidth/2)
       .attr('y', paramObj.canvasHeight-paramObj.canvasMargin/5)
       .style('text-anchor','middle')

    // add y axis label
    this.svg
       .append('text')
       .text('Signal / Noise Ratio')
       .attr('fill','black')
       .style('text-anchor','middle')
       .attr('transform', `translate(${paramObj.canvasMargin/3},${paramObj.canvasHeight/2}) rotate(-90)`)

    this.svg
        .append('g')
        .attr('id','yAxis')
        .attr('transform',`translate(${paramObj.canvasMargin/1.5},0)`)
        .call(this.yAxis);
            
    this.svg
        .append('g').attr('id','xAxis')
        .attr('transform',`translate(0,${paramObj.canvasHeight-paramObj.canvasMargin/1.5})`)
        .call(this.xAxis)

    var expInput = d3.select('body')
        .append('div')
        .html('&nbsp; Exposure Time, s : ')
        .append('input')
        .attr('id','texp')
        .attr('value',1)
        .on('input', function(){
            self.tExp = this.value;
            self.draw()
        })
    
} 

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
    this.panel = d3.select('body')
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
            .style('height', 20)
            .html('&nbsp;')

    var nameBadge = this.panel
            .append('p')
            .text(this.name)
            .style('text-align','center')
            .style('font-size','12pt')
            .style('margin','0')

        
    // append Ps for each controllable parameter
    
    
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
    
    var select = self.panel
        .append('div')
        .style('padding','10px 10px 0 0 ')
        .append('select')
        .attr('class','select')
        .on('change',onchange)
        
    var options = select
        .selectAll('option')
          .data(sensorChoices).enter()
          .append('option')
              .text(function (d) { return d; });
    
    function onchange() {
            var selectValue = d3.select(this).property('value');
            var newParams = sensorDefinitions[selectValue];
            var keys = Object.keys(newParams);
            for (var i in keys){
                self[keys[i]] = newParams[keys[i]]
            }
            self.updatePanel();
            self.chart.draw();
        };

    

    // method to update control panel figures
    this.updatePanel = function(){
        colorBadge.style('background-color', self.color);
        nameBadge.text(self.name)
        self.panel.selectAll('.controlP').each( function(l,j){ 
            var newParam = d3.select(this).attr('param');
            d3.select(this).text(controlParams[newParam] + ' : ' + Math.round(100*self[newParam]) / 100)
        } );
    }

    // method to draw trace to graph
    this.draw = function(){
        var xAxisPhotons = range(1,10).concat(range(11,200,10));
        var yAxisSN = xAxisPhotons.map( function(val){
            var signal = self.qe * val;
            var noise = self.enf * Math.sqrt( self.qe*val + self.readNoise**2 + self.chart.tExp*self.iDark )
            return signal / noise
        })

        // "zip" the object from an object with arrays as properties to a list of objs with one number for each property...
        var dataObj = {x : xAxisPhotons, y : yAxisSN };
        dataObj = objZip(dataObj)

        this.path
            .attr('d', this.chart.dataLine(dataObj))
            .attr('stroke', self.color)
            .attr('stroke-dasharray', self.dashArray)
            .attr('stroke-width',2)

    }

}

// ================================

var mainChart = new Chart()

var controlDiv = d3.select('body')
    .append('div')
    .style('margin','10px')
    .attr('id','controlDiv')

controlDiv.append('button')
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


//===========
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
