var data = { 
  "class": "go.TreeModel",
  "nodeDataArray": [
    {"key":1, "name":"Stella Payne Diaz", "phone":"CEO", "person": 300, "email": "manh@gmail"},
    {"key":2, "name":"Luke Warm", "phone":"VP Marketing/Sales", "person": 300, "email": "manh@gmail", "parent":1},
    {"key":3, "name":"Meg Meehan Hoffa", "phone":"Sales", "person": 300, "email": "manh@gmail", "parent":2},
    {"key":4, "name":"Peggy Flaming", "phone":"VP Engineering", "person": 300, "email": "manh@gmail", "parent":1},
    {"key":5, "name":"Saul Wellingood", "phone":"Manufacturing", "person": 300, "email": "manh@gmail", "parent":4},
    {"key":6, "name":"Al Ligori", "phone":"Marketing", "person": 300, "email": "manh@gmail", "parent":2},
    {"key":7, "name":"Dot Stubadd", "phone":"Sales Rep", "person": 300, "email": "manh@gmail", "parent":3},
    {"key":8, "name":"Les Ismore", "phone":"Project Mgr", "person": 300, "email": "manh@gmail", "parent":5},
    {"key":9, "name":"April Lynn Parris", "phone":"Events Mgr", "person": 300, "email": "manh@gmail", "parent":6},
    {"key":10, "name":"Xavier Breath", "phone":"Engineering", "person": 300, "email": "manh@gmail", "parent":4},
    {"key":11, "name":"Anita Hammer", "phone":"Process", "person": 300, "email": "manh@gmail", "parent":5},
    {"key":12, "name":"Billy Aiken", "phone":"Software", "person": 300, "email": "manh@gmail", "parent":10},
    {"key":13, "name":"Stan Wellback", "phone":"Testing", "person": 300, "email": "manh@gmail", "parent":10},
    {"key":14, "name":"Marge Innovera", "phone":"Hardware", "person": 300, "email": "manh@gmail", "parent":10},
    {"key":15, "name":"Evan Elpus", "phone":"Quality", "person": 300, "email": "manh@gmail", "parent":5},
    {"key":16, "name":"Lotta B. Essen", "phone":"Sales Rep", "person": 300, "email": "manh@gmail", "parent":3}
  ]
}

function init() {
  var $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram =
    $(go.Diagram, "myDiagramDiv", // must be the ID or reference to div
      {
        maxSelectionCount: 0, // users can select only one part at a time
        validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
        layout:
          $(go.TreeLayout,
            {
              treeStyle: go.TreeLayout.StyleLastParents,
              arrangement: go.TreeLayout.ArrangementHorizontal,
              // properties for most of the tree:
              angle: 90,
              layerSpacing: 35,
              // properties for the "last parents":
              alternateAngle: 90,
              alternateLayerSpacing: 35,
              alternateAlignment: go.TreeLayout.AlignmentBus,
              alternateNodeSpacing: 20
            }),
      });

  var levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
    "#008299", "#D24726", "#008A00", "#094AB2"];

  // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
  myDiagram.layout.commitNodes = function() {
    go.TreeLayout.prototype.commitNodes.call(myDiagram.layout);  // do the standard behavior
    // then go through all of the vertexes and set their corresponding node's Shape.fill
    // to a brush dependent on the TreeVertex.level value
    myDiagram.layout.network.vertexes.each(function(v) {
      if (v.node) {
        var level = v.level % (levelColors.length);
        var color = levelColors[level];
        var shape = v.node.findObject("SHAPE");
        if (shape) shape.stroke = $(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
      }
    });
  };

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  function textStyle() {
    return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
  }

  // This converter is used by the Picture.
  function findHeadShot(key) {
    return "../images/hs" + key + ".jpg"
  }

  // define the Node template
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      
      $(go.Shape, "Rectangle",
        {
          name: "SHAPE", fill: "#333333", stroke: 'white', strokeWidth: 3.5,
          // set the port properties:
          portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
        }),
      $(go.Panel, "Horizontal",
        $(go.Picture,
          {
            name: "Picture",
            desiredSize: new go.Size(80, 80),
            margin: 1.5,
          },
          new go.Binding("source", "key", findHeadShot)),
        // define the panel where the text will appear
        $(go.Panel, "Table",
          {
            minSize: new go.Size(130, NaN),
            maxSize: new go.Size(150, NaN),
            margin: new go.Margin(6, 10, 0, 6),
            defaultAlignment: go.Spot.Left
          },
          $(go.RowColumnDefinition, { column: 2, width: 4 }),

          $(go.TextBlock, textStyle(),  // the name
            {
              row: 0, column: 0, columnSpan: 5,
              font: "12pt Segoe UI,sans-serif",
              editable: true, isMultiline: false,
              minSize: new go.Size(10, 16)
            },
            new go.Binding("text", "name").makeTwoWay()),

          $(go.TextBlock, "Phone: ", textStyle(),
            { row: 1, column: 0 }),

          $(go.TextBlock, textStyle(),
            {
              row: 1, column: 1, columnSpan: 4,
              editable: true, isMultiline: false,
              minSize: new go.Size(10, 14),
              margin: new go.Margin(0, 0, 0, 3)
            },
            new go.Binding("text", "phone").makeTwoWay()),

            $(go.TextBlock, "Email: ", textStyle(),
            { row: 2, column: 0 }),

          $(go.TextBlock, textStyle(),
            {
              row: 2, column: 1, columnSpan: 4,
              editable: true, isMultiline: false,
              minSize: new go.Size(10, 14),
              margin: new go.Margin(0, 0, 0, 3)
            },
            new go.Binding("text", "email").makeTwoWay()),

            $(go.TextBlock, "Person: ", textStyle(),
            { row: 3, column: 0 }),

            $(go.TextBlock, textStyle(),
              {
                row: 3, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "person").makeTwoWay()),
            
          $(go.TextBlock, textStyle(),
            { row: 4, column: 0 },
            new go.Binding("text", "key", function(v) { return "ID: " + v; })),
          $(go.TextBlock, textStyle(),
            { row: 4, column: 3, }, // we include a name so we can access this TextBlock when deleting Nodes/Links
            new go.Binding("text", "parent", function(v) { return "Parent: " + v; })),
        )  // end Table Panel
      ) // end Horizontal Panel
    );  // end Node

  myDiagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,
      { corner: 5, relinkableFrom: true, relinkableTo: true },
      $(go.Shape, { strokeWidth: 1.5, stroke: "#F5F5F5" }));  // the link shape

  myDiagram.model = go.Model.fromJson(data);

  document.getElementById('zoomToFit').addEventListener('click', function() {
    myDiagram.commandHandler.zoomToFit();
  });

  document.getElementById('centerRoot').addEventListener('click', function() {
    myDiagram.scale = 1;
    myDiagram.commandHandler.scrollToPart(myDiagram.findNodeForKey(1));
  });
}