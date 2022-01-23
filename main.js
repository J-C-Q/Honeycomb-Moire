
class Atom {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.c = new Array(3);
  }
}

function newLayerTranslation(currentPos) {
  currentPos[0].x += Math.sqrt(3);
  return currentPos;
}

function translationFunction(currentPos,side, k) {
  var translationVec = [[0.0, 1.0], [-1*Math.sqrt(3) / 2, 0.5], [-1*Math.sqrt(3) / 2, -0.5]];
  if (side == 1) {
    if (k%2 == 1) {
      currentPos[0].x += translationVec[0][0];
      currentPos[0].y += translationVec[0][1];
    } else {
      currentPos[0].x += translationVec[1][0];
      currentPos[0].y += translationVec[1][1];
    }
  } else if (side == 2) {
    if (k%2 == 1) {
      currentPos[0].x += translationVec[2][0];
      currentPos[0].y += translationVec[2][1];
    } else {
      currentPos[0].x += translationVec[1][0];
      currentPos[0].y += translationVec[1][1];
    }
  } else if (side == 3) {
    if (k%2 == 1) {
      currentPos[0].x += translationVec[2][0];
      currentPos[0].y += translationVec[2][1];
    } else {
      currentPos[0].x -= translationVec[0][0];
      currentPos[0].y -= translationVec[0][1];
    }
  } else if (side == 4) {
    if (k%2 == 1) {
      currentPos[0].x -= translationVec[1][0];
      currentPos[0].y -= translationVec[1][1];
    } else {
      currentPos[0].x -= translationVec[0][0];
      currentPos[0].y -= translationVec[0][1];
    }
  } else if (side == 5) {
    if (k%2 == 1) {
      currentPos[0].x -= translationVec[1][0];
      currentPos[0].y -= translationVec[1][1];
    } else {
      currentPos[0].x -= translationVec[2][0];
      currentPos[0].y -= translationVec[2][1];
    }
  } else if (side == 6) {
    if (k%2 == 1) {
      currentPos[0].x += translationVec[0][0];
      currentPos[0].y += translationVec[0][1];
    } else {
      currentPos[0].x -= translationVec[2][0];
      currentPos[0].y -= translationVec[2][1];
    }
  }
  return currentPos;
}

function connectionPattern(cPLastLayer, lastLayer) {
  var cPNextLayer = new Array(6*Math.pow((lastLayer+1),2)+6*(lastLayer+1)+1);
  var j = 0;
  var last = -1;
  for (var i=0;i<cPLastLayer.length-1;i++) {
    if (cPLastLayer[i] == last) {
      cPNextLayer[j] = cPLastLayer[i];
      cPNextLayer[j+1] = 1;
      cPNextLayer[j+2] = 0;
      j += 3; 
    } else {
      cPNextLayer[j] = cPLastLayer[i];
      j += 1;
    }
    last = cPLastLayer[i];
  }
  cPNextLayer[j] = cPLastLayer[cPLastLayer.length-1];
  return cPNextLayer;
}

function arrayRotate(arr, reverse) {
  if (reverse) arr.unshift(arr.pop());
  else arr.push(arr.shift());
  return arr;
}


function constructStructure(n) {

  var atoms = new Array(6*Math.pow(n,2) + 6*n+1);
  for (var i=0;i<atoms.length;i++) {
    atoms[i] = new Atom();
  }
  var currentPos = [{x:0,y:0}];

  atoms[0].x = currentPos[0].x;
  atoms[0].y = currentPos[0].y;
  atoms[0].c = [4,8,12];
  currentPos = newLayerTranslation(currentPos);

  var i_start = 1;
  var i_end = 12;
  var thisLayercP = [0,0,0,1,0,0,0,1,0,0,0,1];
  var k = 1;

  var c1 = 0;
  var c2 = 0;
  var c3 = 0;
  for (var i=i_start;i<=i_end;i++) {
    
    if (i != i_end) {
      c1 = i+1;
    } else {
      c1 = i_start;
    }
    if (i != i_start) {
      c2 = i-1;
    } else {
      c2 = i_end;
    }
    if (thisLayercP[i-i_start] == 1) {
      c3 = 1;
    } else {
      c3 = 0;
    }
    atoms[i].x = currentPos[0].x;
    atoms[i].y = currentPos[0].y;
    atoms[i].c = [c1,c2,c3];
    currentPos = translationFunction(currentPos,Math.ceil(k/2),k);
    k += 1;
  }
  
  for (var layer=2; layer<=n;layer++) {
    var lastToNext = thisLayercP.indexOf(0);
    var lastLayercP = [...thisLayercP];
    currentPos = newLayerTranslation(currentPos);

    i_start = 6*Math.pow((layer-1),2)+6*(layer-1)+1;
    i_end = 6*Math.pow(layer,2)+6*layer+0;
    thisLayercP = connectionPattern(lastLayercP,layer-1);

    var j = 1;
    k = 1;

    for (var i=i_start;i<=i_end;i++) {
      if (i != i_end) {
        c1 = i+1;
      } else {
        c1 = i_start;
      }
      if (i != i_start) {
        c2 = i-1;
      } else {
        c2 = i_end;
      }
      c3 = 0;
      atoms[i].x = currentPos[0].x;
      atoms[i].y = currentPos[0].y;
      atoms[i].c = [c1,c2,c3];
      currentPos = translationFunction(currentPos,Math.ceil(k/(2*layer)),k);
      k += 1;

    }
  }
  return atoms;
}

function getPointsFromStructure(atomss) {
  var points = new Array(atomss.length)
  for (var i=0; i<atomss.length;i++) {
    points[i] = {x:atomss[i].x,y:atomss[i].y};
  }
  return points;
}

function rotate(pointss,phi) {
  var px;
  var py;
  var newpoints = [];

  for (var i = 0; i<pointss.length; i++) {
    px = pointss[i].x;
    py = pointss[i].y;
    newpoints.push({x:px*Math.cos(phi)-py*Math.sin(phi),y:px*Math.sin(phi)+py*Math.cos(phi)});
  }
  return newpoints;
}

var N = 50
var sites = getPointsFromStructure(constructStructure(N));


var slider = document.getElementById("myRange");
var output = document.getElementById("value");
output.innerHTML = slider.value;

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [{
      label: '',
      backgroundColor: '#FF652F',
      borderColor: '#FF652F',
      data: sites,
    },
    {
      label: '',
      backgroundColor: '#0000FF',
      borderColor: '#0000FF',
      data: sites,
    }]
  },
  options: {
    scales: {
        x: {
          type: 'linear',
          min: -Math.sqrt(3)*N,
          max: Math.sqrt(3)*N,
          
          ticks: {
            display: false,
            callback: function(value, index) {
              return value;
            },
            font: {
              size: 25,
              family: 'Computer Modern Serif' 
            },
            color: 'rgb(255,255,255)'
          },
          grid: {
            drawBorder: false,
            display: false,
            lineWidth: 5,
            color: '#272727'
          }
        },
        y: {
          type: 'linear',
          min: -Math.sqrt(3)*N,
          max: Math.sqrt(3)*N,
          ticks: {
            display: false,
            callback: function(value, index) {
              return value;
            },
            font: {
              size: 25,
              family: 'Computer Modern Serif',
            },
            color: 'rgb(255,255,255)'
          },
          grid: {
            drawBorder: false,
            display: false,
            lineWidth: 5,
            color: '#272727'
          }
        }
    },
 
    resposive: true,
    pointRadius: 2,
    maintainAspectRatio: false,
    showtooltips: false,
    events: [],
    animations: 'hide',
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

slider.oninput = function() {
  output.innerHTML = this.value*60/100;
  var l = slider.value;
  //var color = 'rgb(214,214,214)';//'linear-gradient(90deg,rgb(0,0,117)'+l+'%, rgb(214,214,214)'+l+'%)';
  //slider.style.background=color;
  let phi = l*Math.PI/600;
  chart.data.datasets[0].data = rotate(sites,phi);
  chart.data.datasets[1].data = rotate(sites,-phi);
  chart.update('none');
}







