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
        "availableModels" : ['Ideal'],
    },

    //"-- Andor --": {
    //},

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

    "Zyla 5.5, 2x2 Binned" : {
        "name" : "Zyla 5.5, 2x2 Binned",
        "iDark" : 0.1*4,
        "readNoise" : 1.7*2,
        "enf" : 1,
        "qe" : 0.6,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "limeGreen",
        "dashArray" : 4,
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

    "Zyla 4.2 Plus, 2x2 Binned" : {
        "name" : "Zyla 4.2 Plus, 2x2 Binned",
        "iDark" : 4*0.1,
        "readNoise" : 2*1.4,
        "enf" : 1,
        "qe" : 0.82,
        "tExp" : 1,
        "pixelSize" : 2*(6.5),
        "color" : "orangeRed",
        "dashArray" : 4,
        "type" : "scmos",
        "availableModels" : ['Zyla 4.2 PLUS']
    },

    "Newton 970 EMCCD" : {
        "name" : "Newton 970 EMCCD",
        "iDark" : 0.0007,
        "readNoise" : 0.008,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "blue",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV','BVF','FI', 'UVB'],
    },

    "Newton 971 EMCCD" : {
        "name" : "Newton 971 EMCCD",
        "iDark" : 0.0007,
        "readNoise" : 0.008,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "blue",
        "dashArray" : "2",
        "type" : "emccd",
        "availableModels" : ['BV','BVF','FI', 'UVB'],
    },

    "Newton 920" : {
        "name" : "Newton 920",
        "iDark" : 0.0002,
        "readNoise" : 4,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 26,
        "color" : "red",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['BU','BU2','BVF','OE'],
    },

    "Newton DU920 (Deep Depletion)" : {
        "name" : "Newton DU920P (Deep Depletion)",
        "iDark" : 0.003,
        "readNoise" : 4,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 26,
        "color" : "red",
        "dashArray" : 2,
        "type" : "ccd",
        "availableModels" : ['BR-DD','BEX2-DD'],
    },

    "Newton 940" : {
        "name" : "Newton DU940",
        "iDark" : 0.0001,
        "readNoise" : 2.5,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13.5,
        "color" : "darkRed",
        "dashArray" : 0,
        "type" : "ccd",
        "availableModels" : ['BU','BU2','BV','FI','UV'],
    },

    "iXon Ultra 888" : {
        "name" : "iXon Ultra 888",
        "iDark" : 0.00025,
        "readNoise" : 0.012,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "olive",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV','BVF','EX','EXF','BB (iXon)','UVB'],
    },

    "iXon Ultra 897" : {
        "name" : "iXon Ultra 897",
        "iDark" : 0.00025,
        "readNoise" : 0.015,
        "enf" : 1.41,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "silver",
        "dashArray" : "0",
        "type" : "emccd",
        "availableModels" : ['BV','BVF','EX','EXF', 'BB (iXon)', 'UVB'],
    },

    "iXon Life 888" : {
        "name" : "iXon Life 888",
        "iDark" : 0.00025,
        "readNoise" : 0.04,
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
        "readNoise" : 0.065,
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
        "readNoise" : 1.6,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 11,
        "color" : "purple",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Sona'],
    },

    "Sona 4.2B-6 (Low Noise Mode)" : {
        "name" : "Sona 4.2B-6 (Low Noise Mode)",
        "iDark" : 0.1,
        "readNoise" : 1.29,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "purple",
        "dashArray" : "2",
        "type" : "scmos",
        "availableModels" : ['Sona'],
    },


    "Marana 4.2B-11" : {
        "name" : "Marana 4.2B-11",
        "iDark" : 0.4,
        "readNoise" : 1.6,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 11,
        "color" : "cyan",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Marana-TVISB','Marana-UV'],
        
    },

    "Marana 4.2B-6" : {
        "name" : "Marana 4.2B-6",
        "iDark" : 0.1,
        "readNoise" : 1.6,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "dodgerblue",
        "dashArray" : "0",
        "type" : "scmos",
        "availableModels" : ['Marana-TVISB'],
        
    },

    "Marana 4.2B-6 (Low Noise Mode)" : {
        "name" : "Marana 4.2B-6 (Low Noise Mode)",
        "iDark" : 0.1,
        "readNoise" : 1.2,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 6.5,
        "color" : "dodgerblue",
        "dashArray" : "3 3",
        "type" : "scmos",
        "availableModels" : ['Marana-TVISB'],
        
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

    "iDus DU420A BU/BV" : {
        "name" : "iDus DU420A BU/BV",
        "iDark" : 0.002,
        "readNoise" : 6,
        "enf" : 1,
        "qe" : 0.97,
        "tExp" : 1,
        "pixelSize" : 26,
        "color" : "lightCoral",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['BU','BU2','BVF'],
    },

    "iDus DU420A OE" : {
        "name" : "iDus DU420A OE",
        "iDark" : 0.0004,
        "readNoise" : 4,
        "enf" : 1,
        "qe" : 0.59,
        "tExp" : 1,
        "pixelSize" : 26,
        "color" : "DarkSalmon",
        "dashArray" : "2",
        "type" : "ccd",
        "availableModels" : ['OE'],
    },

    "iDus DU420A (Deep Depletion)" : {
        "name" : "iDus DU420A (Deep Depletion)",
        "iDark" : 0.008,
        "readNoise" : 4,
        "enf" : 1,
        "qe" : 0.59,
        "tExp" : 1,
        "pixelSize" : 26,
        "color" : "indianRed",
        "dashArray" : "4",
        "type" : "ccd",
        "availableModels" : ['BR-DD','BEX2-DD'],
    },

    "iVac 316 LDC-DD" : {
        "name" : "iVac 324 FI",
        "iDark" :  0.033,
        "readNoise" : 6.0,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 15,
        "color" : "peru",
        "dashArray" : "1",
        "type" : "ccd",
        "availableModels" : ['LDC-DD'],
    },

    "iVac 324 FI" : {
        "name" : "iVac 324 FI",
        "iDark" :  0.0028,
        "readNoise" : 5.8,
        "enf" : 1,
        "qe" : 0.57,
        "tExp" : 1,
        "pixelSize" : 16,
        "color" : "peru",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['FI'],
    },

    "iDus DV416A-LDC-DD" : {
        "name" : "iDus DV416A-LDC-DD",
        "iDark" :  0.025,
        "readNoise" : 4,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 15,
        "color" : "MediumSlateBlue",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['LDC-DD'],
    },
    
    "iDus DU416A-LDC-DD" : {
        "name" : "iDus DU416A-LDC-DD",
        "iDark" :  0.0006,
        "readNoise" : 4,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 15,
        "color" : "MediumSlateBlue",
        "dashArray" : "2",
        "type" : "ccd",
        "availableModels" : ['LDC-DD'],
    },

    "iKon-M DU934" : {
        "name" : "iKon-M DU934",
        "iDark" :  0.00012,
        "readNoise" : 2.9,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "LightSlateGray",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['BU', 'BV', 'FI'],
    },

    "iKon-M DU934 (Deep Depletion)" : {
        "name" : "iKon-M DU934 (Deep Depletion)",
        "iDark" :  0.00047,
        "readNoise" : 3.3,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13,
        "color" : "LightSlateGray",
        "dashArray" : "4",
        "type" : "ccd",
        "availableModels" : ['BR-DD','BEX2-DD'],
    },

    "iKon-L 936" : {
        "name" : "iKon-L 936",
        "iDark" :  0.000059,
        "readNoise" : 2.9,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13.5,
        "color" : "Orange",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['BV', 'BU2', 'FI'],
    },

    "iKon-L 936 (Deep Depletion)" : {
        "name" : "iKon-L 936 (Deep Depletion)",
        "iDark" :  0.0003,
        "readNoise" : 2.9,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 13.5,
        "color" : "Orange",
        "dashArray" : "4 2",
        "type" : "ccd",
        "availableModels" : ['BR-DD','BEX2-DD'],
    },

    "iKon-XL 230" : {
        "name" : "iKon-XL 230",
        "iDark" :  0.00006,
        "readNoise" : 3.8,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 15,
        "color" : "palevioletred",
        "dashArray" : "0",
        "type" : "ccd",
        "availableModels" : ['BV', 'BB (iKon-XL)'],
    },

    "iKon-XL 231" : {
        "name" : "iKon-XL 231",
        "iDark" :  0.00013,
        "readNoise" : 2.1,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 15,
        "color" : "palevioletred",
        "dashArray" : "4",
        "type" : "ccd",
        "availableModels" : ['BV', 'BB (iKon-XL)', 'BEX2', 'BEX2-DD', 'BR-DD'],
    },


  /*

    "CoolSNAP HQ" : {
        "name" : "CoolSNAP HQ",
        "iDark" :  0.05,
        "readNoise" : 6,
        "enf" : 1,
        "qe" : 0.95,
        "tExp" : 1,
        "pixelSize" : 6.45,
        "color" : "blue",
        "dashArray" : "4",
        "type" : "ccd",
        "availableModels" : ['coolsnap'],
    },


**/




}


