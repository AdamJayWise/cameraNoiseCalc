// definition of sensor types

  var sensorDefinitions = {
    "-- Pre-Defined Cameras --": {
    },
    
    "Ideal Camera" : {
        "name" : "Ideal Sensor",
        "iDark" : 0,
        "readNoise" : 0,
        "enf" : 1,
        "qe" : 1,
        "tExp" : 1,
        "pixelSize" : 25,
        "color" : "black",
        "dashArray" : 4,
        "type" : "ccd",
        "lineClass" : "dashedDiv",
        "availableModels" : ['Ideal'],
    },

    "-- Andor --": {
    },

    "Zyla 5.5" : {
        "name" : "Zyla 5.5",
        "iDark" : 0.1,
        "readNoise" : 1.7,
        "enf" : 1,
        "qe" : 0.6,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "green",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Zyla 5.5']
    },

    "Zyla 4.2 Plus" : {
        "name" : "Zyla 4.2 Plus",
        "iDark" : 0.1,
        "readNoise" : 1.4,
        "enf" : 1,
        "qe" : 0.82,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "orange",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Zyla 4.2 PLUS']
    },

    "Newton 971P EMCCD" : {
        "name" : "Newton 970 EMCCD",
        "iDark" : 0.0007,
        "readNoise" : 0,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "blue",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV','BVF','FI'],
    },

    "Newton DU9x0 CCD" : {
        "name" : "Newton DU940P CCD",
        "iDark" : 0.00001,
        "readNoise" : 2.5,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13.5,
        "color" : "red",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['BU','BU2','BVF','FI','OE','UV','BR-DD','BEX2-DD'],
    },

    "iXon Ultra 888" : {
        "name" : "iXon Ultra 888",
        "iDark" : 0.00025,
        "readNoise" : 0,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "olive",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV','BVF'],
    },

    "iXon Ultra 897" : {
        "name" : "iXon Ultra 897",
        "iDark" : 0.00025,
        "readNoise" : 0,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "silver",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV','BVF'],
    },

    "iXon Life 888" : {
        "name" : "iXon Life 888",
        "iDark" : 0.00025,
        "readNoise" : 0,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "lime",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV'],
    },

    "iXon Life 897" : {
        "name" : "iXon Life 897",
        "iDark" : 0.00025,
        "readNoise" : 0,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "violet",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV'],
    },

    "Sona 4.2B-11" : {
        "name" : "Sona 4.2B-11",
        "iDark" : 0.4,
        "readNoise" : 1.8,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 11,
        "color" : "purple",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Sona'],
    },

    "Marana 4.2B-11" : {
        "name" : "Marana 4.2B-11",
        "iDark" : 0.4,
        "readNoise" : 1.8,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 11,
        "color" : "cyan",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Marana-TVISB','Marana-UV'],
        
    },

    "Neo 5.5" : {
        "name" : "Neo 5.5",
        "iDark" : 0.007,
        "readNoise" : 1.5,
        "enf" : 1,
        "qe" : 0.6,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "gray",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Neo 5.5'],
    },

    "Idus DU490A" : {
        "name" : "Idus DU490A",
        "iDark" : 12000,
        "readNoise" : 580,
        "enf" : 1,
        "qe" : 0.85,
        "tExp" : 1,
        "pixelSize" : 25,
        "color" : "red",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['Idus 1.7'],
    }


}


