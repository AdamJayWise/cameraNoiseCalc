// definition of sensor types

  var sensorDefinitions = {
    "-- Pre-Defined Sensors --": {
    },
    
    "Ideal Sensor" : {
        "name" : "Ideal Sensor",
        "iDark" : 0,
        "readNoise" : 0,
        "enf" : 1,
        "qe" : 1,
        "tExp" : 1,
        "pixelSize" : 25,
        "color" : "black",
        "dashArray" : 4,
        "type" : "ccd"
    },

    "-- Andor --": {
    },

    "Zyla 5.5" : {
        "name" : "Zyla 5.5",
        "iDark" : 0.1,
        "readNoise" : 0.9,
        "enf" : 1,
        "qe" : 0.6,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "green",
        "dashArray" : "0",
        "type" : "scmos"
    },

    "Zyla 4.2 Plus" : {
        "name" : "Zyla 4.2 Plus",
        "iDark" : 0.1,
        "readNoise" : 0.9,
        "enf" : 1,
        "qe" : 0.82,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "orange",
        "dashArray" : "0",
        "type" : "scmos"
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
        "type" : "emccd"
    },

    "Newton DU940P CCD" : {
        "name" : "Newton DU940P CCD",
        "iDark" : 0.00001,
        "readNoise" : 2.5,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13.5,
        "color" : "red",
        "dashArray" : "0",
        "type" : "ccd"
    },

    "iXon Ultra EMCCD" : {
        "name" : "iXon Ultra EMCCD",
        "iDark" : 0.00025,
        "readNoise" : 0,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "violet",
        "dashArray" : "0",
        "type" : "emccd"
    },

    "Sona 4.2" : {
        "name" : "Sona 4.2",
        "iDark" : 0.4,
        "readNoise" : 1.6,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 11,
        "color" : "purple",
        "dashArray" : "0",
        "type" : "scmos"
    },

    "Neo" : {
        "name" : "Neo",
        "iDark" : 0.007,
        "readNoise" : 1,
        "enf" : 1,
        "qe" : 0.6,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "gray",
        "dashArray" : "0",
        "type" : "scmos"
    }

}
