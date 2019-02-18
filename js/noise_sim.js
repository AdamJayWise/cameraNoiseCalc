console.log('Noise Sim')

var sensorChoices = ['Predefined Sensors','Ideal Sensor', 'Newton 970 EMCCD', 'Zyla 5.5']

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
}

function Chart(paramObj){

    if (!paramObj){
        paramObj = {canvasWidth : 600, canvasHeight : 300, canvasMargin : 70};
    }

    this.svg = d3.select('body')
        .append('svg')
        .attr('width', paramObj.canvasWidth)
        .attr('height', paramObj.canvasHeight)
    
    this.svg
        .append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width', paramObj.canvasWidth)
        .attr('height', paramObj.canvasHeight)
        .attr('stroke','black')
        .attr('fill','none')

    this.traces = []

    this.draw = function(){
        this.traces.forEach(e=>e.draw())
    }

    this.update = function(){
        this.traces.forEach(e=>e.update())
    }

    // generate scales and axes including formatting
    this.xScale = d3.scaleLog()
                    .domain([1,1000])
                    .range([paramObj.canvasMargin, paramObj.canvasWidth-paramObj.canvasMargin])

    this.yScale = d3.scaleLog()
                    .domain([0.1,40])//.domain([Math.min(...yAxisSN),Math.max(...yAxisSN)])
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
                    .tickValues([0.1,1,2,10,40])
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
    controlParams = {
                     iDark:'Dark Current, e/pix/s',
                     readNoise : 'Read Noise, e',
                     enf : 'ENF',
                     qe : 'QE',
                     tExp : 'Exposure, s',
                     pixelSize : 'Pixel Size, um',
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
        .style('margin','5px')
        .style('font-size','10pt')
        .style('font-weight', 800)
    
    
    var colorBadge = this.panel
            .append('div')
            .style('background-color', this.color)
            .style('width', 20)
            .style('height', 20)
            .html('&nbsp;')

    this.panel.append('p').text(this.name).attr('text-align','center')

        
    // append Ps for each controllable parameter
    
    
    Object.keys(controlParams)
        .forEach(function(l){
            self.panel
                .append('p')
                .classed('controlP', true)
                .attr('param',l)
                .text( controlParams[l] + ' : ' + self[l])
                
            var p = self.panel.append('div')

            p.append('button')
            .text('+')
            .on('click', function(){
                        self[l] += 0.3;
                        mainChart.draw();
                        self.updatePanel();
                        })
            
            p.append('button')
            .text('-')
            .on('click', function(){
                        self[l] -= 0.3;
                        mainChart.draw();
                        self.updatePanel();
                        })
        
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
        self.panel.selectAll('.controlP').each( function(l,j){ 
            var newParam = d3.select(this).attr('param');
            d3.select(this).text(controlParams[newParam] + ' : ' + self[newParam])
        } );
    }

    // method to draw trace to graph
    this.draw = function(){
        var xAxisPhotons = range(1,10).concat(range(11,1000,10));
        var yAxisSN = xAxisPhotons.map( function(val){
            var signal = self.qe * val;
            var noise = self.enf * Math.sqrt( self.qe*val + self.readNoise**2 + self.iDark )
            return signal / noise
        })

        // "zip" the object from an object with arrays as properties to a list of objs with one number for each property...
        var dataObj = {x : xAxisPhotons, y : yAxisSN };
        dataObj = objZip(dataObj)

        this.path
            .attr('d', this.chart.dataLine(dataObj))
            .attr('stroke', self.color)
            .attr('stroke-dasharray', self.dashArray)

    }

}

// ================================

var mainChart = new Chart()


d3.select('body')
    .append('div')
    .style('width','100%')
    .append('button')
    .text('Add Sensor')
    .on('click',function(){
    var t = new Trace({
        name : 'Bad Sensor',
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
    name : 'Ideal Sensor',
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
