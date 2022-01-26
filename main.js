
class Atom {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.c = new Array(3);
    this.c2 = [];
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
  var lastToNext;
  for (var layer=2; layer<=n;layer++) {

    lastToNext = [];
    for (var i = 0; i < thisLayercP.length; i++) {
      if (thisLayercP[i] == 0) lastToNext.push(i+i_start-1);
    }
    lastToNext = arrayRotate(lastToNext);
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

function connectLayers(layer1,layer2,L,d,cutOff) {
  var R;
  var a;
  for (var i=0;i<layer1.length;i++) {
    for (var j=0;j<layer2.length;j++) {
      R = Math.sqrt(Math.pow(layer1[i].x - layer2[j].x,2) + Math.pow(layer1[i].y - layer2[j].y,2) + Math.pow(L,2));
      a = Math.exp(-R/d);
      if (Math.abs(a)>cutOff) {
        layer1[i].c2.push(j);
        layer2[j].c2.push(i);
      }
    }
  }
  return {layer1,layer2};
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


function numberToColor(n) {
  switch (n) {
    case 0: return '#000000';
    case 1: return '#FFFF74';
    case 2: return '#FF9BFF';
    case 3: return '#00D3FF';
    case 4: return '#E2630D';
    case 5: return '#007E00';
    case 6: return '#0050E6';
    case 7: return '#AC0047';
    case 8: return '#00FFC8';
    case 9: return '#006468';
    case 10: return '#FFD5C4';
    case 11: return '#6C5200';
    case 12: return '#7A7581';
    case 13: return '#44005C';
    case 14: return '#9E9E77';
    case 15: return '#FF5C78';
    case 16: return '#8197F1';
    case 17: return '#003200';
    case 18: return '#C721DD';
    case 19: return '#FFAD07';
    case 20: return '#611C00';
    case 21: return '#F3FFFA';
    case 22: return '#009E88';
    case 23: return '#5EC700';
    case 24: return '#002D54';
    case 25: return '#553C4A';
    case 26: return '#444439';
    case 27: return '#008FB6';
    case 28: return '#CFD4FD';
    case 29: return '#C40000';
    case 30: return '#A4675C';
    case 31: return '#BB8FA8';
    case 32: return '#290001';
    case 33: return '#A78600';
    case 34: return '#002D30';
    case 35: return '#C7DEAA';
    case 36: return '#8D9FA3';
    case 37: return '#6F5B95';
    case 38: return '#A1FFFF';
    case 39: return '#B39688';
    case 40: return '#4E6D50';
    case 41: return '#FF977B';
    case 42: return '#FFD1EC';
    case 43: return '#9E5100';
    case 44: return '#AE5B8E';
    case 45: return '#799400';
    case 46: return '#362200';
    case 47: return '#0E0026';
    case 48: return '#80765F';
    case 49: return '#485C00';
    case 50: return '#C8C2B5';
    case 51: return '#8800A1';
    case 52: return '#00A853';
    case 53: return '#FFE1AA';
    case 54: return '#674F42';
    case 55: return '#FF342D';
    case 56: return '#6B0041';
    case 57: return '#0806B1';
    case 58: return '#986DFF';
    case 59: return '#FF4EC7';
    case 60: return '#8AB9A2';
    case 61: return '#2EFF71';
    case 62: return '#005577';
    case 63: return '#0078E3';
    case 64: return '#B2ADB9';
    case 65: return '#00C3C6';
    case 66: return '#00AEFF';
    case 67: return '#4E545F';
    case 68: return '#FF9BB0';
    case 69: return '#FED206';
    case 70: return '#687B7A';
    case 71: return '#B1DCFC';
    case 72: return '#FFF6FF';
    case 73: return '#620019';
    case 74: return '#C79253';
    case 75: return '#A891CF';
    case 76: return '#EF007A';
    case 77: return '#B8CE00';
    case 78: return '#001700';
    case 79: return '#204B39';
    case 80: return '#875866';
    case 81: return '#B5FF4E';
    case 82: return '#B40080';
    case 83: return '#853F34';
    case 84: return '#69936B';
    case 85: return '#FFBC80';
    case 86: return '#4C3779';
    case 87: return '#323606';
    case 88: return '#008E94';
    case 89: return '#CAAC51';
    case 90: return '#787B3B';
    case 91: return '#B6F9D9';
    case 92: return '#DA003F';
    case 93: return '#2E2124';
    case 94: return '#005815';
    case 95: return '#FF8E1D';
    case 96: return '#6674B1';
    case 97: return '#00CDAD';
    case 98: return '#007F63';
    case 99: return '#996F3D';
    default: return '#FFFFFF';
  }
}

function siteColors(sites1,sites2,L,d,cutOff) {
  var colors1 = new Array(sites1.length);
  var colors2 = new Array(sites2.length);
  var counts1 = new Array(sites1.length);
  var counts2 = new Array(sites2.length);
  var R;
  var a;
  for (var i=0;i<sites1.length;i++) {
    counts1[i] = 0;
    counts2[i] = 0;
  }
 

  for (var i=0;i<sites1.length;i++) {
    for (var j=0;j<sites2.length;j++) {
      R = Math.sqrt(Math.pow(sites1[i].x - sites2[j].x,2) + Math.pow(sites1[i].y - sites2[j].y,2) + Math.pow(L,2));
      a = Math.exp(-R/d);
      if (Math.abs(a) > cutOff) {
        counts1[i]+=1;
        counts2[j]+=1;
      }
    }
  }
  for (var i=0;i<sites1.length;i++) {
    colors1[i] = numberToColor(counts1[i]);
    colors2[i] = numberToColor(counts2[i]);
  }
  return {colors1,colors2};
}

var N = 10
var Layer1 = constructStructure(N);

var sites1 = getPointsFromStructure(Layer1);
var sites2 = [...sites1];


var colors = siteColors(sites1,sites2,1,0.177,0.003);
var color1 = colors.colors1;
var color2 = colors.colors2;


var slider = document.getElementById("myRange");
var output = document.getElementById("value");

var N_input = document.getElementById("N");
var L_input = document.getElementById("L");
var p_input = document.getElementById("p");
var delta_input = document.getElementById("delta");
var pointsize_input = document.getElementById("pointsize");

var menu = document.getElementById("mobile-menu");
var menuLinks = document.getElementById("menue");

mobileMenu = () => {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
}

menu.addEventListener('click',mobileMenu);


output.innerHTML = slider.value;

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [{
      label: '',
      backgroundColor: color1,
      data: sites1,
    },
    {
      label: '',
      backgroundColor: color2,
      data: sites2,
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
  output.innerHTML = this.value*60/600;
  var l = slider.value;
  let phi = l*Math.PI/3600;
  chart.data.datasets[0].data = rotate(sites1,phi);
  chart.data.datasets[1].data = rotate(sites2,-phi);
  colors = siteColors(chart.data.datasets[0].data,chart.data.datasets[1].data,parseFloat(L_input.value),parseFloat(p_input.value),parseFloat(delta_input.value));
  chart.data.datasets[0].backgroundColor = colors.colors1;
  chart.data.datasets[1].backgroundColor = colors.colors2;

  chart.update('none');
}

function initialize() {
  N = parseInt(N_input.value)

  if (N<=50) {
    Layer1 = constructStructure(N);

    sites1 = getPointsFromStructure(Layer1);
    sites2 = [...sites1];

    var l = slider.value;
    let phi = l*Math.PI/3600;
    chart.data.datasets[0].data = rotate(sites1,phi);
    chart.data.datasets[1].data = rotate(sites2,-phi);
    colors = siteColors(chart.data.datasets[0].data,chart.data.datasets[1].data,parseFloat(L_input.value),parseFloat(p_input.value),parseFloat(delta_input.value));
    color1 = colors.colors1;
    color2 = colors.colors2;
    chart.data.datasets[0].backgroundColor = colors.colors1;
    chart.data.datasets[1].backgroundColor = colors.colors2;
    chart.options.scales.x.min = -Math.sqrt(3)*N;
    chart.options.scales.x.max = Math.sqrt(3)*N;
    chart.options.scales.y.min = -Math.sqrt(3)*N;
    chart.options.scales.y.max = Math.sqrt(3)*N;
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
    chart.options.pointRadius = parseFloat(pointsize_input.value);
    chart.update('none');
  } else {
    alert("Parameters could not be applied!");
  }
}







